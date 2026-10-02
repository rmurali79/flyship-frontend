import API_BASE from '../config/api';

import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Plane, LayoutGrid, List, Scale, Luggage } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import StatsWidget from '../components/StatsWidget';
import ConfirmDialog from '../components/ConfirmDialog';
import ItemImage from '../components/ItemImage';
import ShipmentDrawer from '../components/ShipmentDrawer';
import StatusPill from '../components/ui/StatusPill';
import PageHeader from '../components/ui/PageHeader';
import { formatMoney } from '../utils/money';
import { contextLine, greeting, nextTrip, statTiles } from '../utils/dashboardSummary';

// Looks up a city in the cities table by name (exact, else a known name it contains).
const findCity = (name, cityMap) => {
    const lower = name.toLowerCase();
    const key = cityMap[lower] ? lower : Object.keys(cityMap).find(k => lower.includes(k));
    return key ? cityMap[key] : null;
};

// Airport-style code for a city ("NYC"); cities not on file use their first three letters.
const cityCode = (name, cityMap) => (name ? findCity(name, cityMap)?.code || name.slice(0, 3).toUpperCase() : '—');

// The city name shown under its code, unless the name is just the code again ("LON").
const cityLabel = (name, cityMap) => (name && name.toUpperCase() !== cityCode(name, cityMap) ? name : '');

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
    const [stats, setStats] = useState({});

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
        // Stats load on their own so a failure there never blanks the listings.
        axios.get(API_BASE + '/api/users/stats', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => setStats(res.data || {}))
            .catch(err => console.error('Error fetching stats:', err));
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

    const ownShipments = user.role === 'both' ? myListings : user.role === 'shipper' ? shipments : [];
    const tiles = statTiles({ role: user.role, stats, deliveries: acceptedDeliveries, ownShipments, plans: travelPlans });
    const context = contextLine({
        role: user.role,
        plans: travelPlans,
        browseShipments: isTraveler ? shipments : [],
        ownShipments,
        route: (p) => `${cityCode(p.origin, cityMap)} → ${cityCode(p.destination, cityMap)}`,
    });

    const seg = (active) => `seg-item ${active ? 'seg-item-active' : ''}`;
    const filterField = 'field py-1.5';
    const filterLabel = 'mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400';
    const acceptedListings = (user.role === 'both' ? myListings : shipments).filter(s => s.status === 'accepted');

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
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-6">
                <div>
                    <h1 className="page-title">{greeting(user.name)}</h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        {isTraveler && nextTrip(travelPlans) && <Plane size={15} className="rotate-45 text-peerpost-gold" aria-hidden="true" />}
                        {context}
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    {isShipper && <Link to="/create-shipment" className={`btn ${isTraveler ? 'btn-secondary' : 'btn-primary'}`}>+ Create shipment</Link>}
                    {isTraveler && <Link to="/create-travel-plan" className="btn btn-primary">+ Add trip</Link>}
                </div>
            </div>
            <StatsWidget tiles={tiles} />
            {openShipmentId && (
                <ShipmentDrawer shipmentId={openShipmentId} onClose={closeShipment} onChanged={loadData} />
            )}

            {isTraveler && (
                <section className="mb-10">
                    <h2 className="section-title mb-4">My travel plans</h2>
                    {travelPlans.length === 0 ? (
                        <p className="text-sm text-gray-500 dark:text-gray-400">No travel plans added yet.</p>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {travelPlans.map(plan => (
                                <TravelPlanCard key={plan.id} plan={plan} cityMap={cityMap} onCancel={() => handleCancelPlan(plan.id)} />
                            ))}
                        </div>
                    )}
                </section>
            )}

            {isTraveler && acceptedDeliveries.length > 0 && (
                <section className="mb-10">
                    <h2 className="section-title mb-4">To deliver</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {acceptedDeliveries.map(shipment => (
                            <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                        ))}
                    </div>
                </section>
            )}

            {isShipper && acceptedListings.length > 0 && (
                <section className="mb-10">
                    <h2 className="section-title mb-4">In progress</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {acceptedListings.map(shipment => (
                            <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                        ))}
                    </div>
                </section>
            )}

            {user.role === 'both' && (
                <section className="mb-10">
                    <h2 className="section-title mb-4">My listings</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {myListings.length > 0 ? (
                            myListings.filter(s => s.status !== 'accepted').map(shipment => (
                                <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No active listings.</p>
                        )}
                    </div>
                </section>
            )}

            <PageHeader
                className="border-t border-gray-200 dark:border-gray-700 pt-8"
                title={user.role === 'shipper' ? 'My listings' : 'Available for pickup'}
                titleAs="h2"
                actions={<>
                    {user.role === 'traveler' && (
                        <div className="seg">
                            <button className={seg(viewMode === 'matched')} onClick={() => setViewMode('matched')}>Matched for Me</button>
                            <button className={seg(viewMode === 'all')} onClick={() => setViewMode('all')}>All Shipments</button>
                        </div>
                    )}
                </>}
            />

            <div className="card flex flex-wrap items-end gap-4 mb-6 p-4">
                <div className="flex flex-col">
                    <label className={filterLabel}>City</label>
                    <input
                        type="text"
                        aria-label="City filter"
                        placeholder="Search origin or destination..."
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className={`${filterField} w-56`}
                    />
                </div>
                <div className="flex flex-col">
                    <label className={filterLabel}>Budget (USD)</label>
                    <div className="flex gap-2">
                        <select aria-label="Amount operator" value={amountOp} onChange={(e) => setAmountOp(e.target.value)} className={`${filterField} w-auto`}>
                            <option value="lt">Less than</option>
                            <option value="gt">Greater than</option>
                        </select>
                        <input
                            type="number"
                            aria-label="Amount value"
                            placeholder="Amount"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            className={`${filterField} w-28`}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className={filterLabel}>Weight (kg)</label>
                    <div className="flex gap-2">
                        <select aria-label="Weight operator" value={weightOp} onChange={(e) => setWeightOp(e.target.value)} className={`${filterField} w-auto`}>
                            <option value="lt">Less than</option>
                            <option value="gt">Greater than</option>
                        </select>
                        <input
                            type="number"
                            aria-label="Weight value"
                            placeholder="Weight"
                            value={weightValue}
                            onChange={(e) => setWeightValue(e.target.value)}
                            className={`${filterField} w-28`}
                        />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className={filterLabel}>Sort by</label>
                    <div className="flex gap-2">
                        <select aria-label="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${filterField} w-auto`}>
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
                            className={`${filterField} w-auto disabled:opacity-50`}
                        >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                </div>
                <button onClick={clearListingFilters} className="link text-sm px-1 py-1.5">Clear filters</button>

                <div className="seg ml-auto">
                    <button aria-label="Grid view" title="Grid view" onClick={() => setListingLayout('grid')} className={`${seg(listingLayout === 'grid')} px-2`}>
                        <LayoutGrid size={18} />
                    </button>
                    <button aria-label="List view" title="List view" onClick={() => setListingLayout('list')} className={`${seg(listingLayout === 'list')} px-2`}>
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
                <div className="card overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
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
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No shipments found.</p>
            )}
            {shipments.length > 0 && visibleShipments.length === 0 && (
                <p className="text-center text-gray-500 dark:text-gray-400 mt-10">No shipments match your filters.</p>
            )}
        </div>
    );
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_MS = 24 * 60 * 60 * 1000;

// "Due 14 Jan" (year shown when it isn't this year). Only an open shipment's deadline can be
// close or overdue; that's the one case it gets color.
const parseDay = (dateString) => {
    const [y, m, d] = String(dateString || '').slice(0, 10).split('-').map(Number);
    return y && m && d ? { y, m, d } : null;
};

// "14 Jan", with the year only when it isn't this year.
export const shortDate = (dateString, today = new Date()) => {
    const p = parseDay(dateString);
    return p ? `${p.d} ${MONTHS[p.m - 1]}${p.y !== today.getFullYear() ? ` ${p.y}` : ''}` : '';
};

export const deadlineInfo = (dateString, status, today = new Date()) => {
    const p = parseDay(dateString);
    if (!p) return null;
    const due = new Date(p.y, p.m - 1, p.d);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const days = Math.round((due - startOfToday) / DAY_MS);
    const date = shortDate(dateString, today);
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
        <span className="figure font-medium text-gray-900 dark:text-gray-100">{cityCode(name, cityMap)}</span>
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
            <td className="p-3 figure font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                {formatMoney(shipment.max_budget)}
            </td>
            <td className="p-3"><Deadline shipment={shipment} placeholder="—" /></td>
            <td className="p-3"><StatusPill status={shipment.status} /></td>
            <td className="p-3 text-gray-400 dark:text-gray-500"><span aria-hidden="true">›</span></td>
        </tr>
    );
};

// Boarding-pass route: airport-style codes joined by a dashed flight path, city names below.
const Route = ({ from, to, cityMap }) => (
    <div className="flex items-center">
        <div className="min-w-0">
            <div className="figure text-2xl font-medium leading-none text-gray-900 dark:text-gray-100">{cityCode(from, cityMap)}</div>
            <div className="mt-1.5 h-4 text-xs text-gray-500 dark:text-gray-400 truncate">{cityLabel(from, cityMap)}</div>
        </div>
        <div className="flex-1 flex items-center gap-1.5 mx-3 mb-5 text-gray-300 dark:text-gray-600" aria-hidden="true">
            <span className="flex-1 border-t border-dashed border-current" />
            <Plane size={16} className="rotate-45 text-peerpost-gold" />
            <span className="flex-1 border-t border-dashed border-current" />
        </div>
        <div className="min-w-0 text-right">
            <div className="figure text-2xl font-medium leading-none text-gray-900 dark:text-gray-100">{cityCode(to, cityMap)}</div>
            <div className="mt-1.5 h-4 text-xs text-gray-500 dark:text-gray-400 truncate">{cityLabel(to, cityMap)}</div>
        </div>
    </div>
);

const passCard = 'card block transition hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600';

// Travel plan as a boarding pass: dates and route on top; luggage space and Cancel below.
const TravelPlanCard = ({ plan, cityMap, onCancel }) => (
    <div className={passCard}>
        <div className="px-5 pt-4 pb-4">
            <div className="flex items-center justify-between h-5 mb-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Trip</span>
                <span className="figure text-xs text-gray-500 dark:text-gray-400">
                    {shortDate(plan.start_date)}{plan.end_date && plan.end_date !== plan.start_date ? ` → ${shortDate(plan.end_date)}` : ''}
                </span>
            </div>
            <Route from={plan.origin} to={plan.destination} cityMap={cityMap} />
        </div>
        <div className="border-t border-dashed border-gray-200 dark:border-gray-700 px-5 py-3 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                <Luggage size={15} aria-hidden="true" />
                {plan.available_baggage_kg ? <><span className="figure">{plan.available_baggage_kg} kg</span> space</> : 'Space not set'}
            </span>
            <button onClick={onCancel} className="btn btn-danger-outline btn-sm">Cancel trip</button>
        </div>
    </div>
);

// Boarding-pass card: the route up top (airport-style codes joined by a flight path), a
// tear line, then the parcel with its photo, weight and budget. The whole card opens the
// details panel.
const ShipmentCard = ({ shipment, cityMap }) => (
    <Link
        to={shipmentLink(shipment)}
        state={{ fromListing: true }}
        className={`${passCard} focus:outline-none focus-visible:ring-2 focus-visible:ring-peerpost-gold/60`}
    >
        <div className="px-5 pt-4 pb-4">
            <div className="flex items-center justify-between h-5 mb-4">
                <StatusPill status={shipment.status} />
                <Deadline shipment={shipment} />
            </div>
            <Route from={shipment.origin} to={shipment.destination} cityMap={cityMap} />
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
                <div className="figure text-lg font-medium leading-tight text-gray-900 dark:text-gray-100 whitespace-nowrap">{formatMoney(shipment.max_budget)}</div>
            </div>
        </div>
    </Link>
);

export default Dashboard;
