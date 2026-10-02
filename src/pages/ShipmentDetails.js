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
import ItemImage from '../components/ItemImage';
import StatusPill from '../components/ui/StatusPill';
import { formatMoney } from '../utils/money';

export const DISPUTE_REASONS = [
    { value: 'item_damaged', label: 'Item damaged' },
    { value: 'item_lost', label: 'Item lost' },
    { value: 'item_not_as_described', label: 'Item not as described' },
    { value: 'late_delivery', label: 'Late delivery' },
    { value: 'no_show', label: 'No show' },
    { value: 'communication_issue', label: 'Communication issue' },
    { value: 'price_disagreement', label: 'Price disagreement' },
    { value: 'schedule_change', label: 'Schedule change' },
    { value: 'found_alternative', label: 'Found an alternative' },
    { value: 'other', label: 'Other' },
];

const reasonLabel = (value) => DISPUTE_REASONS.find(r => r.value === value)?.label || value;

// Rendered as its own page (/shipment/:id) or, given shipmentId and onClose, inside the
// dashboard's side panel. onChanged tells the host that the shipment was modified.
const ShipmentDetails = ({ shipmentId, onClose, onChanged }) => {
    const params = useParams();
    const id = shipmentId ?? params.id;
    const inPanel = !!onClose;
    const { user } = useAuth();
    const navigate = useNavigate();
    const snackbar = useSnackbar();
    const [shipment, setShipment] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newQuote, setNewQuote] = useState({ amount: '', delivery_date: '', currency: 'USD', message: '' });
    const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
    const [showPayment, setShowPayment] = useState(null);
    const [deleteReasonCategory, setDeleteReasonCategory] = useState('');
    const [deleteReason, setDeleteReason] = useState('');
    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [withdrawReasonCategory, setWithdrawReasonCategory] = useState('');
    const [withdrawReason, setWithdrawReason] = useState('');
    const [showWithdrawForm, setShowWithdrawForm] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false });
    const [disputes, setDisputes] = useState([]);
    const [showDisputeForm, setShowDisputeForm] = useState(false);
    const [newDispute, setNewDispute] = useState({ reason_category: '', description: '', evidence_photo_urls: [] });
    const [resolutionNotesByDispute, setResolutionNotesByDispute] = useState({});

    const refreshData = useCallback(async () => {
        const [res, quotesRes, reviewsRes, disputesRes] = await Promise.all([
            axios.get(`${API_BASE}/api/shipments/${id}`),
            axios.get(`${API_BASE}/api/quotes/shipment/${id}`),
            axios.get(`${API_BASE}/api/reviews/shipment/${id}`),
            axios.get(`${API_BASE}/api/disputes`, { params: { subject_type: 'shipment', subject_id: id } }),
        ]);
        setShipment(res.data);
        setQuotes(quotesRes.data);
        setReviews(reviewsRes.data);
        setDisputes(disputesRes.data);
    }, [id]);

    useEffect(() => {
        refreshData().catch(err => console.error('Error fetching data:', err));
    }, [refreshData]);

    const reload = async () => {
        await refreshData();
        onChanged?.();
    };

    const close = onClose || (() => navigate('/dashboard'));

    const handleQuoteSubmit = async (e) => {
        e.preventDefault();

        if (parseFloat(newQuote.amount) > parseFloat(shipment.max_budget)) {
            snackbar.warn(`Quote amount cannot exceed the budget of ${formatMoney(shipment.max_budget)}`);
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
            await reload();
            setNewQuote({ amount: '', delivery_date: '', currency: 'USD', message: '' });
            snackbar.success('Quote submitted successfully');
        } catch (error) {
            snackbar.error('Failed to submit quote: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleAcceptQuote = async (quoteId) => {
        try {
            await axios.post(`${API_BASE}/api/quotes/${quoteId}/accept`);
            await reload();
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
            await reload();
            setNewReview({ rating: 0, comment: '' });
            snackbar.success('Review submitted');
        } catch (error) {
            snackbar.error('Failed to submit review: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        try {
            await axios.post(`${API_BASE}/api/shipments/${id}/status`, { status: newStatus });
            await reload();
            snackbar.success(newStatus === 'in_transit' ? 'Marked as picked up' : 'Marked as delivered');
        } catch (error) {
            snackbar.error('Failed to update status: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDeleteShipment = () => {
        if (!deleteReasonCategory) { snackbar.warn('Please select a reason'); return; }
        setConfirmDialog({
            open: true,
            title: 'Delete shipment',
            message: 'Are you sure you want to delete this shipment? This cannot be undone. All pending quotes will be released.',
            confirmText: 'Delete',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog({ open: false });
                try {
                    await axios.post(`${API_BASE}/api/shipments/${id}/delete`, {
                        reason_category: deleteReasonCategory,
                        reason: deleteReason,
                    });
                    snackbar.success('Shipment deleted');
                    onChanged?.();
                    close();
                } catch (error) {
                    snackbar.error('Failed to delete: ' + (error.response?.data?.error || error.message));
                }
            },
        });
    };

    const handleWithdrawQuote = (quoteId) => {
        if (!withdrawReasonCategory) { snackbar.warn('Please select a reason'); return; }
        setConfirmDialog({
            open: true,
            title: 'Withdraw Quote',
            message: 'Are you sure you want to withdraw this quote? Your locked funds will be released.',
            confirmText: 'Withdraw',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog({ open: false });
                try {
                    await axios.post(`${API_BASE}/api/quotes/${quoteId}/withdraw`, {
                        reason_category: withdrawReasonCategory,
                        reason: withdrawReason,
                    });
                    setShowWithdrawForm(null);
                    setWithdrawReasonCategory('');
                    setWithdrawReason('');
                    await reload();
                    snackbar.success('Quote withdrawn');
                } catch (error) {
                    snackbar.error('Failed to withdraw: ' + (error.response?.data?.error || error.message));
                }
            },
        });
    };

    const handleEvidenceUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const uploadData = new FormData();
        uploadData.append('photo', file);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(API_BASE + '/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            const url = res.data.url.startsWith('http') ? res.data.url : API_BASE + res.data.url;
            setNewDispute(d => ({ ...d, evidence_photo_urls: [...d.evidence_photo_urls, url] }));
        } catch (error) {
            snackbar.error('Evidence upload failed');
        } finally {
            e.target.value = '';
        }
    };

    const handleFileDispute = async () => {
        if (!newDispute.reason_category) { snackbar.warn('Please select a reason'); return; }
        try {
            await axios.post(`${API_BASE}/api/disputes`, {
                subject_type: 'shipment',
                subject_id: id,
                reason_category: newDispute.reason_category,
                description: newDispute.description,
                evidence_photo_urls: newDispute.evidence_photo_urls,
            });
            setShowDisputeForm(false);
            setNewDispute({ reason_category: '', description: '', evidence_photo_urls: [] });
            await reload();
            snackbar.success('Dispute filed');
        } catch (error) {
            snackbar.error('Failed to file dispute: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleDisputeAction = async (disputeId, action) => {
        const notes = resolutionNotesByDispute[disputeId] || '';
        if (action === 'reject' && !notes.trim()) { snackbar.warn('Please explain why you are rejecting this dispute'); return; }
        try {
            await axios.post(`${API_BASE}/api/disputes/${disputeId}/${action}`,
                action === 'withdraw' || action === 'review' ? undefined : { resolution_notes: notes });
            await reload();
            snackbar.success('Dispute updated');
        } catch (error) {
            snackbar.error('Failed to update dispute: ' + (error.response?.data?.error || error.message));
        }
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
    const canFileDispute = !!acceptedQuote && (user.id === shipment.shipperId || isAcceptedTraveler);

    return (
        <div className={inPanel ? 'p-4 sm:p-6' : 'max-w-5xl mx-auto my-10 px-4'}>
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
            <div className="card p-6 sm:p-8 mb-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="page-title mb-2">{shipment.origin} <span className="text-gray-400">to</span> {shipment.destination}</h1>
                        <StatusPill status={shipment.status} className="text-sm" />
                        {isAcceptedTraveler && shipment.status === 'accepted' && (
                            <button
                                onClick={() => handleUpdateStatus('in_transit')}
                                className="ml-3 btn btn-primary"
                            >
                                Mark as picked up
                            </button>
                        )}
                        {isAcceptedTraveler && shipment.status === 'in_transit' && (
                            <button
                                onClick={() => handleUpdateStatus('delivered')}
                                className="ml-3 btn btn-primary"
                            >
                                Mark as delivered
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
                                className="btn btn-danger"
                            >
                                Delete shipment
                            </button>
                        )}
                        <button
                            onClick={close}
                            aria-label="Close and return to listing"
                            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {showDeleteForm && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">Delete shipment</h3>
                        <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                            All pending quotes will be released. If a quote was accepted, cancellation penalties may apply.
                        </p>
                        <select
                            className="field mb-3"
                            value={deleteReasonCategory}
                            onChange={(e) => setDeleteReasonCategory(e.target.value)}
                        >
                            <option value="">Select a reason...</option>
                            {DISPUTE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <textarea
                            className="field mb-3"
                            rows="2"
                            placeholder="Additional details (optional)..."
                            value={deleteReason}
                            onChange={(e) => setDeleteReason(e.target.value)}
                        />
                        <div className="flex gap-2">
                            <button onClick={handleDeleteShipment} className="btn btn-danger">
                                Confirm Delete
                            </button>
                            <button onClick={() => { setShowDeleteForm(false); setDeleteReasonCategory(''); setDeleteReason(''); }} className="btn btn-secondary">
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {(shipment.cancellation_reason_category || shipment.cancellation_reason) && (
                    <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-500">
                        <p className="text-sm text-red-700 dark:text-red-300">
                            <span className="font-bold">Deletion reason:</span>{' '}
                            {shipment.cancellation_reason_category ? reasonLabel(shipment.cancellation_reason_category) : null}
                            {shipment.cancellation_reason_category && shipment.cancellation_reason && ' — '}
                            {shipment.cancellation_reason}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Item details</h2>
                        <ItemImage shipment={shipment} className="w-full h-64 rounded-lg mb-4" />
                        <div className="space-y-3 text-gray-700 dark:text-gray-300">
                            <p><span className="font-bold">Description:</span> {shipment.item_description || shipment.details}</p>
                            <p><span className="font-bold">Weight:</span> {shipment.weight ? `${shipment.weight} kg` : 'N/A'}</p>
                            <p><span className="font-bold">Dimensions:</span> {shipment.dimension_length && `${shipment.dimension_length} x ${shipment.dimension_width} x ${shipment.dimension_height} cm`}</p>
                            <p><span className="font-bold">Max budget:</span> <span className="figure">{formatMoney(shipment.max_budget)}</span></p>
                        </div>
                    </div>

                    <div>
                        <h2 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">Logistics and delivery</h2>
                        <div className="space-y-6 text-gray-700 dark:text-gray-300">
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Shipment arrangement</h3>
                                <p className="capitalize">{shipment.shipment_arrangement ? shipment.shipment_arrangement.replace('_', ' ') : 'N/A'}</p>
                                {shipment.collection_point && (
                                    <p className="mt-1"><span className="font-semibold">Collection Point:</span> {shipment.collection_point}</p>
                                )}
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Delivery details</h3>
                                <p><span className="font-semibold">Recipient:</span> {shipment.delivery_recipient_name || 'N/A'}</p>
                                <p><span className="font-semibold">Address:</span> {shipment.delivery_address || 'N/A'}</p>
                                <p className="mt-1"><span className="font-semibold">Arrangement:</span> {shipment.delivery_arrangement ? shipment.delivery_arrangement.replace('_', ' ') : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {(shipment.escrow_amount > 0) && (
                <div className="card p-6 sm:p-8 mt-6">
                    <h2 className="section-title text-lg mb-4">Security and escrow</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-2">
                        This shipment requires a security deposit from the traveler.
                    </p>
                    <div className="flex gap-8">
                        <div>
                            <span className="block text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">Escrow amount</span>
                            <span className="figure text-2xl font-semibold text-gray-900 dark:text-white">
                                {formatMoney(shipment.escrow_amount, shipment.escrow_currency)}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            <div className="card p-6 sm:p-8">
                <h2 className="section-title mb-6">Traveler quotes</h2>

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
                                                {formatMoney(quote.amount, quote.currency)}
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
                                            {quote.status === 'withdrawn' && quote.withdrawal_reason_category && (
                                                <p className="text-sm text-orange-600 mt-1">
                                                    Withdrawn: {reasonLabel(quote.withdrawal_reason_category)}
                                                    {quote.withdrawal_reason && ` — ${quote.withdrawal_reason}`}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        {shipment.status === 'pending' && quote.status === 'pending' && (
                                            <button onClick={() => handleAcceptQuote(quote.id)} className="btn btn-primary">
                                                Accept quote
                                            </button>
                                        )}
                                        {quote.status === 'accepted' && (
                                            <StatusPill status="accepted" />
                                        )}
                                        {quote.status === 'withdrawn' && (
                                            <StatusPill status="withdrawn" />
                                        )}
                                        {quote.status === 'rejected' && (
                                            <StatusPill status="rejected" />
                                        )}
                                    </div>
                                </div>
                                {showPayment === quote.id && (
                                    <Payment
                                        quoteId={quote.id}
                                        amount={quote.amount}
                                        currency={quote.currency}
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
                            <form onSubmit={handleQuoteSubmit} className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/40">
                                <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Submit a quote</h3>
                                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                                    <p>Max budget: <span className="figure font-bold">{formatMoney(shipment.max_budget)}</span></p>
                                    <p>Reaching By: <span className="font-bold">{formatDate(shipment.reach_latest_by)}</span></p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="label">Amount</label>
                                        <input type="number" step="0.01" className="field" value={newQuote.amount} onChange={(e) => setNewQuote({ ...newQuote, amount: e.target.value })} required placeholder="0.00" max={shipment.max_budget} />
                                    </div>
                                    <div>
                                        <label className="label">Currency</label>
                                        <select className="field" value={newQuote.currency || 'USD'} onChange={(e) => setNewQuote({ ...newQuote, currency: e.target.value })}>
                                            <option value="USD">USD ($)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="SGD">SGD (S$)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="label">Delivery Date</label>
                                        <input type="date" className="field" value={newQuote.delivery_date} onChange={(e) => setNewQuote({ ...newQuote, delivery_date: e.target.value })} required max={shipment.reach_latest_by} />
                                    </div>
                                    <div className="mb-4">
                                        <label className="label">Message (Optional)</label>
                                        <textarea className="field" rows="3" placeholder="Add a note about your travel schedule or delivery details..." value={newQuote.message} onChange={(e) => setNewQuote({ ...newQuote, message: e.target.value })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary w-full md:w-auto">
                                    Submit quote
                                </button>
                            </form>
                        )}

                        <h3 className="font-display font-semibold mb-4 text-gray-900 dark:text-white">Existing quotes</h3>
                        <div className="space-y-2">
                            {quotes.map(quote => (
                                <div key={quote.id} className={`border p-3 rounded bg-white dark:bg-gray-700 dark:border-gray-600 ${quote.status === 'withdrawn' ? 'opacity-60' : ''}`}>
                                    <div className="flex justify-between items-center">
                                        <div className="dark:text-white font-medium">
                                            {formatMoney(quote.amount, quote.currency)}
                                            {' - '}
                                            {formatDate(quote.delivery_date)}
                                            {quote.message && (
                                                <p className="text-sm text-gray-500 font-normal mt-1">"{quote.message}"</p>
                                            )}
                                            {quote.status === 'withdrawn' && quote.withdrawal_reason_category && (
                                                <p className="text-sm text-orange-500 font-normal mt-1">
                                                    Reason: {reasonLabel(quote.withdrawal_reason_category)}
                                                    {quote.withdrawal_reason && ` — ${quote.withdrawal_reason}`}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusPill status={quote.status} />
                                            {(quote.status === 'pending' || quote.status === 'accepted') && quote.traveler_id === user.id && (
                                                <button
                                                    onClick={() => { setShowWithdrawForm(showWithdrawForm === quote.id ? null : quote.id); setWithdrawReasonCategory(''); setWithdrawReason(''); }}
                                                    className="btn btn-danger-outline btn-sm"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {showWithdrawForm === quote.id && (
                                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-800">
                                            <select
                                                className="field mb-2 text-sm"
                                                value={withdrawReasonCategory}
                                                onChange={(e) => setWithdrawReasonCategory(e.target.value)}
                                            >
                                                <option value="">Select a reason...</option>
                                                {DISPUTE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                            </select>
                                            <textarea
                                                className="field mb-2 text-sm"
                                                rows="2"
                                                placeholder="Additional details (optional)..."
                                                value={withdrawReason}
                                                onChange={(e) => setWithdrawReason(e.target.value)}
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={() => handleWithdrawQuote(quote.id)} className="btn btn-danger btn-sm">
                                                    Confirm Withdraw
                                                </button>
                                                <button onClick={() => { setShowWithdrawForm(null); setWithdrawReasonCategory(''); setWithdrawReason(''); }} className="btn btn-secondary btn-sm">
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

            {canFileDispute && (
                <div className="card p-6 sm:p-8 mt-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="section-title">Disputes</h2>
                        <button
                            onClick={() => setShowDisputeForm(!showDisputeForm)}
                            className="btn btn-danger"
                        >
                            File a dispute
                        </button>
                    </div>

                    {showDisputeForm && (
                        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                            <select
                                className="field mb-3"
                                value={newDispute.reason_category}
                                onChange={(e) => setNewDispute({ ...newDispute, reason_category: e.target.value })}
                            >
                                <option value="">Select a reason...</option>
                                {DISPUTE_REASONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            <textarea
                                className="field mb-3"
                                rows="3"
                                placeholder="Describe what happened (optional)..."
                                value={newDispute.description}
                                onChange={(e) => setNewDispute({ ...newDispute, description: e.target.value })}
                            />
                            <label className="label text-sm font-semibold">Evidence photos</label>
                            <input type="file" accept="image/*" className="mb-2 text-sm text-gray-500 dark:text-gray-300" onChange={handleEvidenceUpload} />
                            {newDispute.evidence_photo_urls.length > 0 && (
                                <div className="flex gap-2 flex-wrap mb-3">
                                    {newDispute.evidence_photo_urls.map((url, i) => (
                                        <img key={i} src={url} alt="Evidence" className="w-16 h-16 object-cover rounded border" />
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button onClick={handleFileDispute} className="btn btn-danger">
                                    Submit Dispute
                                </button>
                                <button
                                    onClick={() => { setShowDisputeForm(false); setNewDispute({ reason_category: '', description: '', evidence_photo_urls: [] }); }}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {disputes.length === 0 ? (
                        <p className="text-gray-500 italic">No disputes filed for this shipment.</p>
                    ) : (
                        <div className="space-y-4">
                            {disputes.map(dispute => {
                                const isRespondent = dispute.respondent_user_id === user.id;
                                const isFiler = dispute.filed_by_user_id === user.id;
                                const isActionable = dispute.status === 'open' || dispute.status === 'under_review';
                                return (
                                    <div key={dispute.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold dark:text-white">{reasonLabel(dispute.reason_category)}</p>
                                                {dispute.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{dispute.description}</p>}
                                            </div>
                                            <StatusPill status={dispute.status} />
                                        </div>
                                        {dispute.evidence?.length > 0 && (
                                            <div className="flex gap-2 flex-wrap mb-2">
                                                {dispute.evidence.map(ev => (
                                                    <a key={ev.id} href={ev.photo_url} target="_blank" rel="noopener noreferrer">
                                                        <img src={ev.photo_url} alt="Evidence" className="w-16 h-16 object-cover rounded border" />
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                        {dispute.resolution_notes && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 italic mb-2">Resolution: {dispute.resolution_notes}</p>
                                        )}
                                        {isActionable && (isFiler || isRespondent) && (
                                            <div className="mt-2">
                                                {isRespondent && (
                                                    <>
                                                        <textarea
                                                            className="field mb-2 text-sm"
                                                            rows="2"
                                                            placeholder="Notes (required to reject, optional to accept)..."
                                                            value={resolutionNotesByDispute[dispute.id] || ''}
                                                            onChange={(e) => setResolutionNotesByDispute({ ...resolutionNotesByDispute, [dispute.id]: e.target.value })}
                                                        />
                                                        <div className="flex gap-2 flex-wrap">
                                                            {dispute.status === 'open' && (
                                                                <button onClick={() => handleDisputeAction(dispute.id, 'review')} className="btn btn-secondary btn-sm">
                                                                    Mark Under Review
                                                                </button>
                                                            )}
                                                            <button onClick={() => handleDisputeAction(dispute.id, 'accept')} className="btn btn-primary btn-sm">
                                                                Accept
                                                            </button>
                                                            <button onClick={() => handleDisputeAction(dispute.id, 'reject')} className="btn btn-secondary btn-sm">
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                                {isFiler && (
                                                    <button onClick={() => handleDisputeAction(dispute.id, 'withdraw')} className="mt-2 btn btn-secondary btn-sm">
                                                        Withdraw Dispute
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {isReviewParticipant && (
                <div className="card p-6 sm:p-8 mt-6">
                    <h2 className="section-title mb-6">Delivery review</h2>

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
                        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/40">
                            <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Rate {otherPartyLabel}</h3>
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
                                className="field mb-4"
                                rows="3"
                                placeholder="Leave a comment (optional)..."
                                value={newReview.comment}
                                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                            />
                            <button onClick={handleReviewSubmit} className="btn btn-primary">
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

            <div className="card p-6 sm:p-8 mt-6">
                <h2 className="section-title mb-6">Tracking history</h2>
                <div className="relative border-l-2 border-peerpost-gold/60 ml-3">
                    {shipment.History && shipment.History.length > 0 ? (
                        shipment.History.map((history, index) => (
                            <div key={index} className="mb-8 ml-6">
                                <span className="absolute -left-[9px] mt-1.5 bg-peerpost-gold h-4 w-4 rounded-full border-[3px] border-white dark:border-gray-800"></span>
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
