import API_BASE from '../config/api';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { X, Star } from 'lucide-react';
import Payment from '../components/Payment';
import ConfirmDialog from '../components/ConfirmDialog';
import { formatDate } from '../utils/date';

const ShipmentDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const [shipment, setShipment] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newQuote, setNewQuote] = useState({ amount: '', delivery_date: '', currency: 'USD', message: '' });
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [showPayment, setShowPayment] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [withdrawReason, setWithdrawReason] = useState('');
    const [showWithdrawForm, setShowWithdrawForm] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false });

    const refreshData = useCallback(async () => {
        const [res, quotesRes, reviewsRes] = await Promise.all([
            axios.get(`${API_BASE}/api/shipments/${id}`),
            axios.get(`${API_BASE}/api/quotes/shipment/${id}`),
            axios.get(`${API_BASE}/api/reviews/shipment/${id}`),
        ]);
        setShipment(res.data);
        setQuotes(quotesRes.data);
        setReviews(reviewsRes.data);
    }, [id]);

    useEffect(() => {
        refreshData().catch(err => console.error('Error fetching data:', err));
    }, [refreshData]);

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(newQuote.amount) > parseFloat(shipment.max_budget)) {
            snackbar.warn(`Quote amount cannot exceed the budget of $${shipment.max_budget}`);
            return;
        }

        const deadline = new Date(shipment.reach_latest_by);
        const quoteDate = new Date(newQuote.delivery_date);
        deadline.setHours(0, 0, 0, 0);
        quoteDate.setHours(0, 0, 0, 0);

        if (quoteDate > deadline) {
            snackbar.warn(`Delivery date must be on or before ${shipment.reach_latest_by}`);
            return;
        }

        try {
            await axios.post(API_BASE + '/api/quotes', {
                shipment_id: id,
                amount: newQuote.amount,
                delivery_date: newQuote.delivery_date,
                currency: newQuote.currency || 'USD',
                message: newQuote.message
            });
            await refreshData();
            setNewQuote({ amount: '', delivery_date: '', currency: 'USD', message: '' });
            snackbar.success('Quote submitted successfully');
        } catch (error) {
            snackbar.error('Failed to submit quote: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleAcceptQuote = async (quoteId) => {
        try {
            await axios.post(`${API_BASE}/api/quotes/${quoteId}/accept`);
            await refreshData();
            setShowPayment(quoteId);
            snackbar.success('Quote accepted');
        } catch (error) {
            snackbar.error('Failed to accept quote: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleReviewSubmit = async () => {
        if (!newReview.rating) { snackbar.warn('Please select a rating'); return; }
        try {
            await axios.post(`${API_BASE}/api/reviews`, {
                shipment_id: id,
                rating: newReview.rating,
                comment: newReview.comment,
            });
            await refreshData();
            setNewReview({ rating: 0, comment: '' });
            snackbar.success('Review submitted');
        } catch (error) {
            snackbar.error('Failed to submit review: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await axios.post(`${API_BASE}/api/shipments/${id}/status`, { status: newStatus });
            await refreshData();
            snackbar.success(newStatus === 'in_transit' ? 'Marked as picked up' : 'Marked as delivered');
        } catch (error) {
            snackbar.error('Failed to update status: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteShipment = () => {
        if (!deleteReason.trim()) { snackbar.warn('Please provide a reason'); return; }
        setConfirmDialog({
            open: true,
            title: 'Delete Shipment',
            message: 'Are you sure you want to delete this shipment? This cannot be undone. All pending quotes will be released.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog({ open: false });
                try {
                    await axios.post(`${API_BASE}/api/shipments/${id}/delete`, { reason: deleteReason });
                    snackbar.success('Shipment deleted');
                    navigate('/dashboard');
                } catch (error) {
                    snackbar.error('Failed to delete: ' + (error.response?.data?.error || error.message));
                }
            },
        });
    };

    const handleWithdrawQuote = (quoteId) => {
        if (!withdrawReason.trim()) { snackbar.warn('Please provide a reason'); return; }
        setConfirmDialog({
            open: true,
            title: 'Withdraw Quote',
            message: 'Are you sure you want to withdraw this quote? Your locked funds will be released.',
            confirmText: 'Withdraw',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog({ open: false });
                try {
                    await axios.post(`${API_BASE}/api/quotes/${quoteId}/withdraw`, { reason: withdrawReason });
                    setShowWithdrawForm(null);
                    setWithdrawReason('');
                    await refreshData();
                    snackbar.success('Quote withdrawn');
                } catch (error) {
                    snackbar.error('Failed to withdraw: ' + (error.response?.data?.error || error.message));
                }
            },
        });
    };

    if (!shipment) return <div className="text-center mt-10">Loading...</div>;

    const isShipperOwner = user.role === 'shipper' && shipment.shipperId === user.id;
    const canDelete = isShipperOwner && shipment.status !== 'delivered' && shipment.status !== 'deleted';

    const acceptedQuote = quotes.find(q => q.status === 'accepted');
    const isAcceptedTraveler = user.id === acceptedQuote?.traveler_id;
    const isReviewParticipant = shipment.status === 'delivered' && acceptedQuote &&
        (user.id === shipment.shipperId || user.id === acceptedQuote.traveler_id);
    const myReview = reviews.find(r => r.reviewer_id === user.id);
    const otherReview = reviews.find(r => r.reviewer_id !== user.id);
    const otherPartyLabel = user.id === shipment.shipperId ? 'the traveler' : 'the shipper';

    return (
        <div className="max-w-5xl mx-auto my-10 px-4">
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                variant={confirmDialog.variant}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ open: false })}
            />

            {/* Shipment Header */}
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold dark:text-white mb-2">{shipment.origin} <span className="text-gray-400">to</span> {shipment.destination}</h1>
                        <span className={`px-3 py-1 rounded text-sm font-bold ${
                            shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            shipment.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            shipment.status === 'deleted' ? 'bg-red-100 text-red-800' :
                            shipment.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                            'bg-green-100 text-green-800'
                        }`}>
                            {shipment.status.toUpperCase()}
                        </span>
                        {isAcceptedTraveler && shipment.status === 'accepted' && (
                            <button
                                onClick={() => handleUpdateStatus('in_transit')}
                                className="ml-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-bold"
                            >
                                Mark as Picked Up
                            </button>
                        )}
                        {isAcceptedTraveler && shipment.status === 'in_transit' && (
                            <button
                                onClick={() => handleUpdateStatus('delivered')}
                                className="ml-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-bold"
                            >
                                Mark as Delivered
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <span className="text-gray-500 dark:text-gray-400">
                            Posted by: {shipment.Shipper?.name || 'Unknown'}
                        </span>
                        {canDelete && (
                            <button
                                onClick={() => setShowDeleteForm(!showDeleteForm)}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold"
                            >
                                Delete Shipment
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/dashboard')}
                            aria-label="Close and return to listing"
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {showDeleteForm && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">Delete Shipment</h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                            All pending quotes will be released. If a quote was accepted, cancellation penalties may apply.
                        </p>
                        <textarea
                            className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            rows="2"
                            placeholder="Reason for deletion (required)..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleDeleteShipment} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm font-bold">
                                Confirm Delete
                            </button>
                            <button onClick={() => { setShowDeleteForm(false); setDeleteReason(''); }} className="px-4 py-2 border rounded text-sm dark:text-gray-300">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {shipment.cancellation_reason && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                        <p className="text-sm text-red-700 dark:text-red-300"><span className="font-bold">Deletion reason:</span> {shipment.cancellation_reason}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-white">Item Details</h2>
                        {shipment.photo_url && (
                            <img src={shipment.photo_url} alt="Item" className="w-full h-64 object-cover rounded-lg mb-4 bg-gray-100" />
                        )}
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p><span className="font-bold">Description:</span> {shipment.item_description || shipment.details}</p>
                            <p><span className="font-bold">Weight:</span> {shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
                            <p><span className="font-bold">Dimensions:</span> {shipment.dimension_length && `${shipment.dimension_length} x ${shipment.dimension_width} x ${shipment.dimension_height} cm`}</p>
                            <p><span className="font-bold">Max Budget:</span> {shipment.max_budget ? `$${shipment.max_budget}` : 'N/A'}</p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2 dark:text-white">Logistics & Delivery</h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Shipment Arrangement</h3>
                                <p className="capitalize">{shipment.shipment_arrangement ? shipment.shipment_arrangement.replace('_', ' ') : 'N/A'}</p>
                                {shipment.collection_point && (
                                    <p className="mt-1"><span className="font-semibold">Collection Point:</span> {shipment.collection_point}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Delivery Details</h3>
                                <p><span className="font-semibold">Recipient:</span> {shipment.delivery_recipient_name || 'N/A'}</p>
                                <p><span className="font-semibold">Address:</span> {shipment.delivery_address || 'N/A'}</p>
                                <p className="mt-1"><span className="font-semibold">Arrangement:</span> {shipment.delivery_arrangement ? shipment.delivery_arrangement.replace('_', ' ') : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(shipment.escrow_amount > 0) && (
                <div className="bg-blue-50 dark:bg-gray-700 p-8 rounded-lg shadow-md mt-6 border-l-4 border-blue-500">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Security & Escrow</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        This shipment requires a security deposit from the traveler.
                    </p>
                    <div className="flex gap-8">
                        <div>
                            <span className="block text-sm text-gray-500 dark:text-gray-400 font-bold uppercase">Escrow Amount</span>
                            <span className="text-2xl font-bold dark:text-white">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: shipment.escrow_currency || 'USD' }).format(shipment.escrow_amount)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Traveler Quotes</h2>

                {user.role === 'shipper' && (
                    <div className="space-y-4">
                        {quotes.map(quote => (
                            <div key={quote.id} className={`border p-4 rounded dark:border-gray-700 ${quote.status === 'withdrawn' ? 'opacity-60' : ''}`}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-start gap-3">
                                        <img
                                            src={quote.Traveler?.profile_picture || 'https://via.placeholder.com/40'}
                                            alt={quote.Traveler?.name}
                                            className="w-10 h-10 rounded-full object-cover border"
                                        />
                                        <div>
                                            <p className="font-bold text-lg dark:text-white">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.currency || 'USD' }).format(quote.amount)}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Delivery by: {formatDate(quote.delivery_date)}
                                            </p>
                                            <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                                Traveler: {quote.Traveler?.name}
                                                {quote.Traveler?.review_count > 0 && (
                                                    <span className="inline-flex items-center gap-0.5 text-yellow-600 dark:text-yellow-400 font-semibold">
                                                        <Star size={13} fill="currentColor" />
                                                        {quote.Traveler.average_rating.toFixed(1)} ({quote.Traveler.review_count})
                                                    </span>
                                                )}
                                            </p>
                                            {quote.message && (
                                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{quote.message}"</p>
                                            )}
                                            {quote.status === 'withdrawn' && quote.withdrawal_reason && (
                                                <p className="text-sm text-orange-600 mt-1">Withdrawn: {quote.withdrawal_reason}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {shipment.status === 'pending' && quote.status === 'pending' && (
                                            <button onClick={() => handleAcceptQuote(quote.id)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                                Accept Quote
                                            </button>
                                        )}
                                        {quote.status === 'accepted' && (
                                            <span className="text-green-600 font-bold px-4 py-2 border border-green-600 rounded">Accepted</span>
                                        )}
                                        {quote.status === 'withdrawn' && (
                                            <span className="text-orange-600 font-bold px-3 py-1 border border-orange-400 rounded text-sm">Withdrawn</span>
                                        )}
                                        {quote.status === 'rejected' && (
                                            <span className="text-gray-500 text-sm px-3 py-1 border rounded">Rejected</span>
                                        )}
                                    </div>
                                </div>
                                {showPayment === quote.id && (
                                    <Payment
                                        quoteId={quote.id}
                                        amount={quote.amount}
                                        onSuccess={() => {
                                            snackbar.success('Payment successful!');
                                            setShowPayment(null);
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                        {quotes.length === 0 && <p className="text-center text-gray-500 italic">No quotes received yet.</p>}
                    </div>
                )}

                {user.role === 'traveler' && (
                    <div>
                        {shipment.status === 'pending' && (
                            <form onSubmit={handleQuoteSubmit} className="mb-8 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                                <h3 className="text-lg font-bold mb-4 dark:text-white">Submit a Quote</h3>
                                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    <p>Max Budget: <span className="font-bold">${shipment.max_budget}</span></p>
                                    <p>Reaching By: <span className="font-bold">{formatDate(shipment.reach_latest_by)}</span></p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Amount</label>
                                        <input type="number" step="0.01" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={newQuote.amount} onChange={(e) => setNewQuote({ ...newQuote, amount: e.target.value })} required placeholder="0.00" max={shipment.max_budget} />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Currency</label>
                                        <select className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={newQuote.currency || 'USD'} onChange={(e) => setNewQuote({ ...newQuote, currency: e.target.value })}>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="SGD">SGD (S$)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Delivery Date</label>
                                        <input type="date" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={newQuote.delivery_date} onChange={(e) => setNewQuote({ ...newQuote, delivery_date: e.target.value })} required max={shipment.reach_latest_by} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold">Message (Optional)</label>
                                        <textarea className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" rows="3" placeholder="Add a note about your travel schedule or delivery details..." value={newQuote.message} onChange={(e) => setNewQuote({ ...newQuote, message: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-bold w-full md:w-auto">
                                    Submit Quote
                                </button>
                            </form>
                        )}

                        <h3 className="font-bold mb-4 dark:text-white">Existing Quotes</h3>
                        <div className="space-y-2">
                            {quotes.map(quote => (
                                <div key={quote.id} className={`border p-3 rounded bg-white dark:bg-gray-700 dark:border-gray-600 ${quote.status === 'withdrawn' ? 'opacity-60' : ''}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="dark:text-white font-medium">
                                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: quote.currency || 'USD' }).format(quote.amount)}
                                            {' - '}
                                            {formatDate(quote.delivery_date)}
                                            {quote.message && (
                                                <p className="text-sm text-gray-500 font-normal mt-1">"{quote.message}"</p>
                                            )}
                                            {quote.status === 'withdrawn' && quote.withdrawal_reason && (
                                                <p className="text-sm text-orange-500 font-normal mt-1">Reason: {quote.withdrawal_reason}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm px-2 py-1 rounded ${
                                                quote.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                quote.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                                quote.status === 'withdrawn' ? 'bg-orange-100 text-orange-800' :
                                                'bg-gray-100'
                                            }`}>
                                                {quote.status.toUpperCase()}
                                            </span>
                                            {(quote.status === 'pending' || quote.status === 'accepted') && quote.traveler_id === user.id && (
                                                <button
                                                    onClick={() => { setShowWithdrawForm(showWithdrawForm === quote.id ? null : quote.id); setWithdrawReason(''); }}
                                                    className="text-sm text-orange-600 hover:text-orange-800 font-bold px-2 py-1 border border-orange-400 rounded"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {showWithdrawForm === quote.id && (
                                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                                            <textarea
                                                className="w-full p-2 border rounded mb-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                rows="2"
                                                placeholder="Reason for withdrawal (required)..."
                                                value={withdrawReason}
                                                onChange={(e) => setWithdrawReason(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleWithdrawQuote(quote.id)} className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-orange-700">
                                                    Confirm Withdraw
                                                </button>
                                                <button onClick={() => { setShowWithdrawForm(null); setWithdrawReason(''); }} className="px-3 py-1 border rounded text-sm dark:text-gray-300">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {quotes.length === 0 && <p className="text-gray-500 italic">No quotes yet.</p>}
                        </div>
                    </div>
                )}
            </div>

            {isReviewParticipant && (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-6">
                    <h2 className="text-2xl font-bold mb-6 dark:text-white">Delivery Review</h2>

                    {myReview ? (
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Your review</p>
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Star
                                        key={n}
                                        size={20}
                                        className={n <= myReview.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                                        fill={n <= myReview.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                            {myReview.comment && <p className="text-gray-700 dark:text-gray-300 italic">"{myReview.comment}"</p>}
                        </div>
                    ) : (
                        <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">Rate {otherPartyLabel}</h3>
                            <div className="flex items-center gap-1 mb-4">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <button key={n} type="button" onClick={() => setNewReview({ ...newReview, rating: n })}>
                                        <Star
                                            size={28}
                                            className={n <= newReview.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-500'}
                                            fill={n <= newReview.rating ? 'currentColor' : 'none'}
                                        />
                                    </button>
                                ))}
                            </div>
                            <textarea
                                className="w-full p-2 border rounded mb-4 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                rows="3"
                                placeholder="Leave a comment (optional)..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                            <button onClick={handleReviewSubmit} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 font-bold">
                                Submit Review
                            </button>
                        </div>
                    )}

                    {otherReview && (
                        <div>
                            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                                {user.id === shipment.shipperId ? "Traveler's" : "Shipper's"} review of this delivery
                            </p>
                            <div className="flex items-center gap-1 mb-2">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <Star
                                        key={n}
                                        size={18}
                                        className={n <= otherReview.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'}
                                        fill={n <= otherReview.rating ? 'currentColor' : 'none'}
                                    />
                                ))}
                            </div>
                            {otherReview.comment && <p className="text-gray-700 dark:text-gray-300 italic">"{otherReview.comment}"</p>}
                        </div>
                    )}
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-6">
                <h2 className="text-2xl font-bold mb-6 dark:text-white">Tracking History</h2>
                <div className="relative border-l-4 border-blue-500 ml-4">
                    {shipment.History && shipment.History.length > 0 ? (
                        shipment.History.map((history, index) => (
                            <div key={index} className="mb-8 ml-6">
                                <span className="absolute -left-3 bg-blue-500 h-6 w-6 rounded-full border-4 border-white dark:border-gray-800"></span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{history.status.replace('_', ' ')}</h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                    {new Date(history.timestamp).toLocaleString()}
                                </time>
                                {history.description && (
                                    <p className="text-base font-normal text-gray-500 dark:text-gray-400">{history.description}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="ml-6 text-gray-500">No tracking updates yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShipmentDetails;
