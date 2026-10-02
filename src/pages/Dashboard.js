import API_BASE from '../config/api';

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plane, LayoutGrid, List, Scale } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { formatDate } from '../utils/date';
import StatsWidget from '../components/StatsWidget';
import ConfirmDialog from '../components/ConfirmDialog';
import ItemImage from '../components/ItemImage';
import ShipmentDrawer from '../components/ShipmentDrawer';

// A little flight-route connector: two "airports" joined by a dashed path,
// with an optional plane mid-flight, used anywhere an origin/destination
// pair is shown.
const FlightPath = ({ className = '', showPlane = true }) => (
    <div className={`flex items-center flex-shrink-0 ${className}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
        <span className="flex-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
        {showPlane && <Plane size={16} className="text-blue-500 dark:text-blue-400 flex-shrink-0 -rotate-45 mx-0.5" />}
        <span className="flex-1 border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
    </div>
);

// Resolves a city name to its photo via cityMap; falls back to a code tile
// (e.g. "BER") when there's no photo on file, or if the photo fails to load.
const findCity = (name, cityMap) => {
    const lower = name.toLowerCase();
    const key = cityMap[lower] ? lower : Object.keys(cityMap).find(k => lower.includes(k));
    return key ? cityMap[key] : null;
};

// Airport-style code for a city ("NYC"); cities not on file use their first three letters.
const cityCode = (name, cityMap) => (name ? findCity(name, cityMap)?.code || name.slice(0, 3).toUpperCase() : '—');

// The city name shown under its code, unless the name is just the code again ("LON").
const cityLabel = (name, cityMap) => (name && name.toUpperCase() !== cityCode(name, cityMap) ? name : '');

const CityThumb = ({ name, cityMap, size = 'default' }) => {
    const [errored, setErrored] = useState(false);
    if (!name) return null;

    const entry = findCity(name, cityMap);
    const rawUrl = entry?.imageUrl;
    const resolvedUrl = rawUrl ? (rawUrl.startsWith('http') ? rawUrl : API_BASE + rawUrl) : null;
    const code = entry?.code || name.slice(0, 3).toUpperCase();
    const dims = size === 'small' ? 'w-14 h-10' : 'w-24 h-16';

    if (resolvedUrl && !errored) {
        return (
            <img
                src={resolvedUrl}
                alt={name}
                title={name}
                className={`${dims} rounded-lg object-cover border border-gray-200 mb-2`}
                onError={() => setErrored(true)}
            />
        );
    }

    return (
        <div
            title={name}
            className={`${dims} rounded-lg border border-gray-200 mb-2 flex items-center justify-center bg-[#0B1B2E]`}
        >
            <span className={`${size === 'small' ? 'text-[10px]' : 'text-sm'} font-bold tracking-wide text-white`}>{code}</span>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const snackbar = useSnackbar();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [travelPlans, setTravelPlans] = useState([]);
    const [viewMode, setViewMode] = useState('matched');
    const [confirmDialog, setConfirmDialog] = useState({ open: false });

    const [acceptedDeliveries, setAcceptedDeliveries] = useState([]);
    const [myListings, setMyListings] = useState([]);

    const [cityFilter, setCityFilter] = useState('');
    const [amountOp, setAmountOp] = useState('lt');
    const [amountValue, setAmountValue] = useState('');
    const [weightOp, setWeightOp] = useState('lt');
    const [weightValue, setWeightValue] = useState('');
    const [sortBy, setSortBy] = useState('none');
    const [sortDir, setSortDir] = useState('asc');
    const [listingLayout, setListingLayout] = useState('grid');

    const isShipper = user.role === 'shipper' || user.role === 'both';
    const isTraveler = user.role === 'traveler' || user.role === 'both';

    const [cityMap, setCityMap] = useState({});

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/cities');
                const map = {};
                res.data.forEach(c => {
                    map[c.name.toLowerCase()] = { imageUrl: c.image_url || null, code: c.code };
                });
                setCityMap(map);
            } catch (error) {
                console.error('Failed to fetch cities', error);
            }
        };
        fetchCities();
    }, []);

    const loadData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            let endpoint = '/api/shipments';
            if (isTraveler && viewMode === 'matched') {
                endpoint = '/api/shipments?matched=true';
            } else if (user.role === 'shipper') {
                endpoint = '/api/shipments/my-shipments';
            }

            const requests = [axios.get(`${API_BASE}${endpoint}`, config)];
            if (isTraveler) {
                requests.push(axios.get(API_BASE + '/api/travel-plans/my-plans', config));
                requests.push(axios.get(API_BASE + '/api/shipments/my-deliveries', config));
            }
            if (user.role === 'both') {
                requests.push(axios.get(API_BASE + '/api/shipments/my-shipments', config));
            }

            const results = await Promise.all(requests);

            setShipments(results[0].data.filter(s => s.status !== 'deleted'));

            let nextIndex = 1;
            if (isTraveler) {
                setTravelPlans(results[nextIndex++].data);
                setAcceptedDeliveries(results[nextIndex++].data);
            }
            if (user.role === 'both') {
                setMyListings(results[nextIndex++].data.filter(s => s.status !== 'deleted'));
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }, [user.role, viewMode, isTraveler]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // The shipment open in the side panel lives in the URL (?shipment=<id>), so the back button
    // closes it and the link can be shared.
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const openShipmentId = searchParams.get('shipment');
    const closeShipment = useCallback(() => {
        if (location.state?.fromListing) {
            navigate(-1);
        } else {
            setSearchParams(prev => { prev.delete('shipment'); return prev; }, { replace: true });
        }
    }, [location.state, navigate, setSearchParams]);

    const handleCancelPlan = (planId) => {
        setConfirmDialog({
            open: true,
            title: 'Cancel Travel Plan',
            message: 'Are you sure you want to cancel this Travel Plan? If you have accepted shipments associated with this plan, you may be charged a penalty.',
            confirmText: 'Cancel Plan',
            variant: 'danger',
            onConfirm: async () => {
                setConfirmDialog({ open: false });
                try {
                    const token = localStorage.getItem('token');
                    await axios.post(`${API_BASE}/api/travel-plans/${planId}/cancel`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    snackbar.success('Travel plan cancelled successfully');
                    window.location.reload();
                } catch (error) {
                    console.error('Cancellation failed:', error);
                    snackbar.error(error.response?.data?.error || 'Failed to cancel travel plan');
                }
            },
        });
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    const applyListingFilters = (list) => {
        return list.filter(s => {
            if (cityFilter.trim()) {
                const needle = cityFilter.trim().toLowerCase();
                const matchesCity = (s.origin && s.origin.toLowerCase().includes(needle)) ||
                    (s.destination && s.destination.toLowerCase().includes(needle));
                if (!matchesCity) return false;
            }
            if (amountValue !== '') {
                const budget = parseFloat(s.max_budget);
                if (isNaN(budget)) return false;
                if (amountOp === 'lt' && !(budget < parseFloat(amountValue))) return false;
                if (amountOp === 'gt' && !(budget > parseFloat(amountValue))) return false;
            }
            if (weightValue !== '') {
                const weight = parseFloat(s.weight);
                if (isNaN(weight)) return false;
                if (weightOp === 'lt' && !(weight < parseFloat(weightValue))) return false;
                if (weightOp === 'gt' && !(weight > parseFloat(weightValue))) return false;
            }
            return true;
        });
    };

    const clearListingFilters = () => {
        setCityFilter('');
        setAmountOp('lt');
        setAmountValue('');
        setWeightOp('lt');
        setWeightValue('');
    };

    const applyListingSort = (list) => {
        if (sortBy === 'none') return list;
        const dir = sortDir === 'asc' ? 1 : -1;
        return [...list].sort((a, b) => {
            let valA, valB;
            if (sortBy === 'city') {
                valA = (a.origin || '').toLowerCase();
                valB = (b.origin || '').toLowerCase();
            } else if (sortBy === 'budget') {
                valA = parseFloat(a.max_budget) || 0;
                valB = parseFloat(b.max_budget) || 0;
            } else if (sortBy === 'weight') {
                valA = parseFloat(a.weight) || 0;
                valB = parseFloat(b.weight) || 0;
            }
            if (valA < valB) return -1 * dir;
            if (valA > valB) return 1 * dir;
            return 0;
        });
    };

    const visibleShipments = applyListingSort(applyListingFilters(shipments
        .filter(s => user.role === 'shipper' ? s.status !== 'accepted' : true)));

    return (
        <div>
            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                confirmText={confirmDialog.confirmText}
                variant={confirmDialog.variant}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ open: false })}
            />
            <StatsWidget />
            {openShipmentId && (
                <ShipmentDrawer shipmentId={openShipmentId} onClose={closeShipment} onChanged={loadData} />
            )}

            {isTraveler && (
                <div className="mb-8 p-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold dark:text-white">My Travel Plans</h2>
                        <Link to="/create-travel-plan" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                            + Add Travel Plan
                        </Link>
                    </div>
                    {travelPlans.length === 0 ? (
                        <p className="text-gray-600 dark:text-gray-400">No travel plans added yet.</p>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {travelPlans.map(plan => (
                                <div key={plan.id} className="bg-white dark:bg-gray-700 p-4 rounded shadow border dark:border-gray-600 flex flex-col">
                                    <div className="flex items-center justify-center gap-4 mb-3">
                                        <div className="flex flex-col items-center">
                                            <CityThumb name={plan.origin} cityMap={cityMap} />
                                            <span className="font-bold text-sm dark:text-white text-center">{plan.origin}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(plan.start_date)}</span>
                                        </div>
                                        <FlightPath className="w-16" />
                                        <div className="flex flex-col items-center">
                                            <CityThumb name={plan.destination} cityMap={cityMap} />
                                            <span className="font-bold text-sm dark:text-white text-center">{plan.destination}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(plan.end_date)}</span>
                                        </div>
                                    </div>
                                    {plan.available_baggage_kg && (
                                        <div className="text-gray-500 dark:text-gray-400 text-xs text-center mb-3">
                                            🧳 {plan.available_baggage_kg} kg available
                                        </div>
                                    )}
                                    <div className="flex justify-end mt-auto">
                                        <button
                                            onClick={() => handleCancelPlan(plan.id)}
                                            className="text-red-500 hover:text-red-700 font-semibold text-sm border border-red-200 hover:border-red-400 rounded px-3 py-1.5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isTraveler && acceptedDeliveries.length > 0 && (
                <div className="mb-10">
                    <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mr-3">To Deliver</span>
                        Accepted Deliveries
                    </h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {acceptedDeliveries.map(shipment => (
                            <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                        ))}
                    </div>
                </div>
            )}

            {isShipper && (
                (user.role === 'both' ? myListings : shipments).filter(s => s.status === 'accepted').length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold dark:text-white mb-4 flex items-center">
                            <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded mr-3">In Progress</span>
                            Accepted Shipments
                        </h2>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(user.role === 'both' ? myListings : shipments).filter(s => s.status === 'accepted').map(shipment => (
                                <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                            ))}
                        </div>
                    </div>
                )
            )}

            {user.role === 'both' && (
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold dark:text-white">My Listings (Posted by Me)</h2>
                        <Link to="/create-shipment" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                            + Create Shipment
                        </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myListings.length > 0 ? (
                            myListings.filter(s => s.status !== 'accepted').map(shipment => (
                                <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No active listings.</p>
                        )}
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-t pt-8 dark:border-gray-700">
                <h1 className="text-3xl font-bold dark:text-white">
                    {user.role === 'shipper' ? 'My Listings (Pending)' : 'Available for Pickup'}
                </h1>

                {user.role === 'traveler' && (
                    <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1">
                        <button
                            className={`px-4 py-2 rounded ${viewMode === 'matched' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                            onClick={() => setViewMode('matched')}
                        >
                            Matched for Me
                        </button>
                        <button
                            className={`px-4 py-2 rounded ${viewMode === 'all' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                            onClick={() => setViewMode('all')}
                        >
                            All Shipments
                        </button>
                    </div>
                )}

                {user.role === 'shipper' && (
                    <Link to="/create-shipment" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        + Create Shipment
                    </Link>
                )}
            </div>

            <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">City</label>
                    <input
                        type="text"
                        aria-label="City filter"
                        placeholder="Search origin or destination..."
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="border dark:border-gray-600 rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white w-56"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Amount</label>
                    <div className="flex gap-2">
                        <select
                            aria-label="Amount operator"
                            value={amountOp}
                            onChange={(e) => setAmountOp(e.target.value)}
                            className="border dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                        >
                            <option value="lt">Less than</option>
                            <option value="gt">Greater than</option>
                        </select>
                        <input
                            type="number"
                            aria-label="Amount value"
                            placeholder="Amount"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            className="border dark:border-gray-600 rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white w-28"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Weight (kg)</label>
                    <div className="flex gap-2">
                        <select
                            aria-label="Weight operator"
                            value={weightOp}
                            onChange={(e) => setWeightOp(e.target.value)}
                            className="border dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                        >
                            <option value="lt">Less than</option>
                            <option value="gt">Greater than</option>
                        </select>
                        <input
                            type="number"
                            aria-label="Weight value"
                            placeholder="Weight"
                            value={weightValue}
                            onChange={(e) => setWeightValue(e.target.value)}
                            className="border dark:border-gray-600 rounded px-3 py-1.5 text-sm dark:bg-gray-700 dark:text-white w-28"
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Sort by</label>
                    <div className="flex gap-2">
                        <select
                            aria-label="Sort by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="border dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                        >
                            <option value="none">None</option>
                            <option value="city">City</option>
                            <option value="budget">Budget</option>
                            <option value="weight">Weight</option>
                        </select>
                        <select
                            aria-label="Sort direction"
                            value={sortDir}
                            onChange={(e) => setSortDir(e.target.value)}
                            disabled={sortBy === 'none'}
                            className="border dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white disabled:opacity-50"
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                <button
                    onClick={clearListingFilters}
                    className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1.5"
                >
                    Clear filters
                </button>

                <div className="flex bg-gray-200 dark:bg-gray-700 rounded p-1 ml-auto">
                    <button
                        aria-label="Grid view"
                        title="Grid view"
                        onClick={() => setListingLayout('grid')}
                        className={`p-2 rounded ${listingLayout === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <LayoutGrid size={18} />
                    </button>
                    <button
                        aria-label="List view"
                        title="List view"
                        onClick={() => setListingLayout('list')}
                        className={`p-2 rounded ${listingLayout === 'list' ? 'bg-white dark:bg-gray-600 shadow' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                        <List size={18} />
                    </button>
                </div>
            </div>

            {listingLayout === 'grid' ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {visibleShipments.map(shipment => (
                        <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                                <th className="p-3">Origin</th>
                                <th className="p-3">Destination</th>
                                <th className="p-3">Item</th>
                                <th className="p-3">Weight</th>
                                <th className="p-3">Budget</th>
                                <th className="p-3">Reach By</th>
                                <th className="p-3">Status</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleShipments.map(shipment => (
                                <ShipmentRow key={shipment.id} shipment={shipment} cityMap={cityMap} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {shipments.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No shipments found.</p>
            )}
            {shipments.length > 0 && visibleShipments.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No shipments match your filters.</p>
            )}
        </div>
    );
};

const STATUS_STYLES = {
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
    accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
    in_transit: 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
};

const StatusPill = ({ status }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700 dark:bg-gray-400/15 dark:text-gray-300'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
    </span>
);

// Budgets are entered in USD. Shown with the ISO code ("USD 50"), never a bare "$".
const formatBudget = (amount) => {
    const value = Number(amount);
    if (amount == null || amount === '' || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'USD', currencyDisplay: 'code', minimumFractionDigits: 0, maximumFractionDigits: 2,
    }).format(value);
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

// "Due 14 Jan" (year shown when it isn't this year). Only an open shipment's deadline can be
// close or overdue; that's the one case it gets color.
export const deadlineInfo = (dateString, status, today = new Date()) => {
    if (!dateString) return null;
    const [y, m, d] = String(dateString).slice(0, 10).split('-').map(Number);
    if (!y || !m || !d) return null;
    const due = new Date(y, m - 1, d);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((due - startOfToday) / DAY_MS);
    const date = `${d} ${MONTHS[m - 1]}${y !== today.getFullYear() ? ` ${y}` : ''}`;
    const open = status !== 'delivered' && status !== 'cancelled' && status !== 'deleted';
    if (open && days < 0) return { text: `Overdue · ${date}`, tone: 'overdue' };
    if (open && days <= 3) return { text: days === 0 ? 'Due today' : `Due in ${days} day${days === 1 ? '' : 's'}`, tone: 'soon' };
    return { text: `Due ${date}`, tone: 'normal' };
};

const DEADLINE_TONES = {
    overdue: 'text-red-600 dark:text-red-400 font-medium',
    soon: 'text-amber-700 dark:text-amber-400 font-medium',
    normal: 'text-gray-500 dark:text-gray-400',
};

const Deadline = ({ shipment, className = '', placeholder = null }) => {
    const info = deadlineInfo(shipment.reach_latest_by, shipment.status);
    if (!info) return placeholder && <span className={`text-xs text-gray-400 ${className}`}>{placeholder}</span>;
    return <span className={`text-xs whitespace-nowrap ${DEADLINE_TONES[info.tone]} ${className}`}>{info.text}</span>;
};

const shipmentLink = (shipment) => ({ search: `?shipment=${shipment.id}` });

const CityCell = ({ name, cityMap }) => (
    <div className="flex items-baseline gap-2 whitespace-nowrap">
        <span className="font-mono font-medium text-gray-900 dark:text-gray-100">{cityCode(name, cityMap)}</span>
        <span className="text-gray-500 dark:text-gray-400">{cityLabel(name, cityMap)}</span>
    </div>
);

const ShipmentRow = ({ shipment, cityMap }) => {
    const navigate = useNavigate();
    return (
        <tr
            onClick={() => navigate(shipmentLink(shipment), { state: { fromListing: true } })}
            className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
        >
            <td className="p-3"><CityCell name={shipment.origin} cityMap={cityMap} /></td>
            <td className="p-3"><CityCell name={shipment.destination} cityMap={cityMap} /></td>
            <td className="p-3 max-w-xs truncate font-medium text-gray-800 dark:text-gray-200">
                {shipment.item_description || 'No description'}
            </td>
            <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {shipment.weight ? `${shipment.weight} kg` : '—'}
            </td>
            <td className="p-3 font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {formatBudget(shipment.max_budget)}
            </td>
            <td className="p-3"><Deadline shipment={shipment} placeholder="—" /></td>
            <td className="p-3"><StatusPill status={shipment.status} /></td>
            <td className="p-3 text-gray-400 dark:text-gray-500"><span aria-hidden="true">›</span></td>
        </tr>
    );
};

// Boarding-pass card: the route up top (airport-style codes joined by a flight path), a
// tear line, then the parcel with its photo, weight and budget. The whole card opens the
// details panel.
const ShipmentCard = ({ shipment, cityMap }) => (
    <Link
        to={shipmentLink(shipment)}
        state={{ fromListing: true }}
        className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
        <div className="px-5 pt-4 pb-4">
            <div className="flex items-center justify-between h-5 mb-4">
                <StatusPill status={shipment.status} />
                <Deadline shipment={shipment} />
            </div>
            <div className="flex items-center">
                <div className="min-w-0">
                    <div className="font-mono text-2xl font-medium leading-none text-gray-900 dark:text-gray-100">{cityCode(shipment.origin, cityMap)}</div>
                    <div className="mt-1.5 h-4 text-xs text-gray-500 dark:text-gray-400 truncate">{cityLabel(shipment.origin, cityMap)}</div>
                </div>
                <div className="flex-1 flex items-center gap-1.5 mx-3 mb-5 text-gray-300 dark:text-gray-600" aria-hidden="true">
                    <span className="flex-1 border-t border-dashed border-current" />
                    <Plane size={16} className="rotate-45 text-gray-400 dark:text-gray-500" />
                    <span className="flex-1 border-t border-dashed border-current" />
                </div>
                <div className="min-w-0 text-right">
                    <div className="font-mono text-2xl font-medium leading-none text-gray-900 dark:text-gray-100">{cityCode(shipment.destination, cityMap)}</div>
                    <div className="mt-1.5 h-4 text-xs text-gray-500 dark:text-gray-400 truncate">{cityLabel(shipment.destination, cityMap)}</div>
                </div>
            </div>
        </div>

        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 px-5 py-3.5 flex items-center gap-3">
            <ItemImage shipment={shipment} compact className="w-14 h-14 rounded-lg flex-none" />
            <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate" title={shipment.item_description || undefined}>
                    {shipment.item_description || 'No description'}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Scale size={13} aria-hidden="true" />
                    {shipment.weight ? `${shipment.weight} kg` : 'Weight not set'}
                </p>
            </div>
            <div className="text-right flex-none">
                <div className="text-[11px] text-gray-400 dark:text-gray-500">Budget</div>
                <div className="text-lg font-medium leading-tight text-gray-900 dark:text-gray-100 whitespace-nowrap">{formatBudget(shipment.max_budget)}</div>
            </div>
        </div>
    </Link>
);

export default Dashboard;
