import API_BASE from '../config/api';

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plane, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { formatDate } from '../utils/date';
import StatsWidget from '../components/StatsWidget';
import ConfirmDialog from '../components/ConfirmDialog';

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
const CityThumb = ({ name, cityMap, size = 'default' }) => {
    const [errored, setErrored] = useState(false);
    if (!name) return null;

    const lower = name.toLowerCase();
    const key = cityMap[lower] ? lower : Object.keys(cityMap).find(k => lower.includes(k));
    const entry = key ? cityMap[key] : null;
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

    useEffect(() => {
        const fetchData = async () => {
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
        };
        fetchData();
    }, [user.role, viewMode, isShipper, isTraveler]);

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
                                <th className="p-3 w-12"></th>
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

const statusBadgeClasses = (status) =>
    `px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
        status === 'accepted' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
    }`;

const ShipmentRow = ({ shipment, cityMap }) => {
    const navigate = useNavigate();
    return (
        <tr
            onClick={() => navigate(`/shipment/${shipment.id}`)}
            className="border-b last:border-0 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
        >
            <td className="p-3">
                <div className="flex items-center gap-2">
                    <CityThumb name={shipment.origin} cityMap={cityMap} size="small" />
                    <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{shipment.origin}</span>
                </div>
            </td>
            <td className="p-3">
                <FlightPath className="w-10" showPlane={false} />
            </td>
            <td className="p-3">
                <div className="flex items-center gap-2">
                    <CityThumb name={shipment.destination} cityMap={cityMap} size="small" />
                    <span className="font-medium text-gray-800 dark:text-gray-200 whitespace-nowrap">{shipment.destination}</span>
                </div>
            </td>
            <td className="p-3 max-w-xs truncate text-gray-600 dark:text-gray-400">
                {shipment.item_description || 'No description'}
            </td>
            <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {shipment.weight ? `${shipment.weight} kg` : '—'}
            </td>
            <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {shipment.max_budget ? `$${shipment.max_budget}` : '—'}
            </td>
            <td className="p-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {shipment.reach_latest_by ? formatDate(shipment.reach_latest_by) : '—'}
            </td>
            <td className="p-3">
                <span className={statusBadgeClasses(shipment.status)}>{shipment.status.toUpperCase()}</span>
            </td>
            <td className="p-3 text-blue-600 text-sm whitespace-nowrap">View →</td>
        </tr>
    );
};

const ShipmentCard = ({ shipment, cityMap }) => {
    return (
        <Link to={`/shipment/${shipment.id}`} className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border dark:border-gray-700 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all cursor-pointer">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex flex-col">
                    {shipment.photo_url && (
                        <img
                            src={shipment.photo_url}
                            alt="Item"
                            className="w-full md:w-32 h-32 object-cover rounded-md flex-shrink-0 bg-gray-100 mb-2"
                            onError={(e) => { e.target.style.display = 'none' }}
                        />
                    )}
                    <p className="text-gray-800 dark:text-gray-300 font-medium mb-1 max-w-xs">
                        {shipment.item_description || 'No description'}
                    </p>
                    {shipment.weight && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">⚖️ {shipment.weight} kg</p>
                    )}
                    {shipment.max_budget && (
                        <p className="text-gray-500 dark:text-gray-400 text-xs">💰 Budget: {shipment.max_budget}</p>
                    )}
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col items-center">
                            <CityThumb name={shipment.origin} cityMap={cityMap} />
                            <span className="font-semibold text-xs text-gray-600 dark:text-gray-400 text-center">{shipment.origin}</span>
                        </div>
                        <FlightPath className="flex-1 mx-2" />
                        <div className="flex flex-col items-center">
                            <CityThumb name={shipment.destination} cityMap={cityMap} />
                            <span className="font-semibold text-xs text-gray-600 dark:text-gray-400 text-center">{shipment.destination}</span>
                        </div>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                        {shipment.details}
                    </p>
                    {shipment.reach_latest_by && (
                        <p className="text-red-500 text-sm mt-1 font-semibold">
                            Reach Latest By: {formatDate(shipment.reach_latest_by)}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center border-t pt-4 dark:border-gray-700">
                <span className={statusBadgeClasses(shipment.status)}>{shipment.status.toUpperCase()}</span>
                <span className="text-blue-600 text-sm">View Details →</span>
            </div>
        </Link>
    );
};

export default Dashboard;
