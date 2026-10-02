import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { formatMoney } from '../utils/money';

let stripePromise = null;

const getStripe = async () => {
    if (!stripePromise) {
        const { data } = await axios.get(API_BASE + '/api/payments/config');
        stripePromise = loadStripe(data.publishableKey);
    }
    return stripePromise;
};

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#32325d',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            '::placeholder': { color: '#aab7c4' },
        },
        invalid: { color: '#fa755a' },
    },
};

const CheckoutForm = ({ quoteId, amount, currency = 'USD', onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);

    const fee = (parseFloat(amount) * 0.10).toFixed(2);
    const total = (parseFloat(amount) + parseFloat(fee)).toFixed(2);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setError(null);

        if (!stripe || !elements) return;

        try {
            const { data } = await axios.post(API_BASE + '/api/payments/create-payment-intent', {
                quote_id: quoteId
            });

            const result = await stripe.confirmCardPayment(data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                setError(result.error.message);
                setProcessing(false);
            } else if (result.paymentIntent.status === 'succeeded') {
                await axios.post(API_BASE + '/api/payments/confirm', {
                    payment_intent_id: result.paymentIntent.id,
                    quote_id: quoteId
                });
                onSuccess();
            }
        } catch (err) {
            setError(err.response?.data?.error || err.message);
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-6 rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/40">
            <h3 className="font-display text-lg font-semibold mb-2 text-gray-900 dark:text-white">Payment summary</h3>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div className="flex justify-between">
                    <span>Quote amount</span>
                    <span className="figure">{formatMoney(amount, currency)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Platform fee (10%)</span>
                    <span className="figure">{formatMoney(fee, currency)}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t border-gray-200 dark:border-gray-700 pt-1 mt-1">
                    <span>Total</span>
                    <span className="figure">{formatMoney(total, currency)}</span>
                </div>
            </div>

            <div className="mb-4 p-3 rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <p className="text-xs text-gray-400 mb-3">
                Test card: 4242 4242 4242 4242 | Any future date | Any CVC
            </p>

            {error && <div className="text-red-600 dark:text-red-400 text-sm mb-4">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="btn btn-primary btn-lg w-full"
            >
                {processing ? 'Processing...' : `Pay ${formatMoney(total, currency)}`}
            </button>
        </form>
    );
};

const Payment = ({ quoteId, amount, currency, onSuccess }) => {
    const [stripe, setStripe] = useState(null);

    useEffect(() => {
        getStripe().then(setStripe);
    }, []);

    if (!stripe) return <div className="text-center py-4 text-gray-500">Loading payment...</div>;

    return (
        <Elements stripe={stripe}>
            <CheckoutForm quoteId={quoteId} amount={amount} currency={currency} onSuccess={onSuccess} />
        </Elements>
    );
};

export default Payment;
