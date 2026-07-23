import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

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

const CheckoutForm = ({ quoteId, amount, onSuccess }) => {
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
        <form onSubmit={handleSubmit} className="mt-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="text-lg font-bold mb-2 dark:text-white">Payment Summary</h3>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <div className="flex justify-between">
                    <span>Quote amount</span>
                    <span>${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Platform fee (10%)</span>
                    <span>${fee}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-900 dark:text-white border-t pt-1 mt-1">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
            </div>

            <div className="mb-4 p-3 bg-white rounded border dark:bg-gray-600 dark:border-gray-500">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <p className="text-xs text-gray-400 mb-3">
                Test card: 4242 4242 4242 4242 | Any future date | Any CVC
            </p>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <button
                type="submit"
                disabled={!stripe || processing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
                {processing ? 'Processing...' : `Pay $${total}`}
            </button>
        </form>
    );
};

const Payment = ({ quoteId, amount, onSuccess }) => {
    const [stripe, setStripe] = useState(null);

    useEffect(() => {
        getStripe().then(setStripe);
    }, []);

    if (!stripe) return <div className="text-center py-4 text-gray-500">Loading payment...</div>;

    return (
        <Elements stripe={stripe}>
            <CheckoutForm quoteId={quoteId} amount={amount} onSuccess={onSuccess} />
        </Elements>
    );
};

export default Payment;
