import API_BASE from '../config/api';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';
import { formatDate } from '../utils/date';
import StatsWidget from '../components/StatsWidget';
import ConfirmDialog from '../components/ConfirmDialog';

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

    const isShipper = user.role === 'shipper' || user.role === 'both';
    const isTraveler = user.role === 'traveler' || user.role === 'both';

    const [cityMap, setCityMap] = useState({});

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/cities');
                const map = {};
                res.data.forEach(c => {
                    if (c.image_url) map[c.name.toLowerCase()] = c.image_url;
                });
                console.log('City Map Loaded:', map); // DEBUG
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

                const resShipments = await axios.get(`${API_BASE}${endpoint}`, config);
                setShipments(resShipments.data.filter(s => s.status !== 'deleted'));

                if (isTraveler) {
                    const resPlans = await axios.get(API_BASE + '/api/travel-plans/my-plans', config);
                    setTravelPlans(resPlans.data);

                    const resDeliveries = await axios.get(API_BASE + '/api/shipments/my-deliveries', config);
                    setAcceptedDeliveries(resDeliveries.data);
                }

                if (user.role === 'both') {
                    const resMy = await axios.get(API_BASE + '/api/shipments/my-shipments', config);
                    setMyListings(resMy.data.filter(s => s.status !== 'deleted'));
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

    const getCityImageLocal = (name) => {
        if (!name || !cityMap) return null;
        const lower = name.toLowerCase();
        if (cityMap[lower]) return cityMap[lower];
        const found = Object.keys(cityMap).find(k => lower.includes(k));
        return found ? cityMap[found] : null;
    };

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
                                            {getCityImageLocal(plan.origin) && <img src={getCityImageLocal(plan.origin)} className="w-24 h-16 rounded-lg object-cover border border-gray-200 mb-2" alt={plan.origin} />}
                                            <span className="font-bold text-sm dark:text-white text-center">{plan.origin}</span>
                                        </div>
                                        <span className="font-bold text-gray-400 text-2xl">➝</span>
                                        <div className="flex flex-col items-center">
                                            {getCityImageLocal(plan.destination) && <img src={getCityImageLocal(plan.destination)} className="w-24 h-16 rounded-lg object-cover border border-gray-200 mb-2" alt={plan.destination} />}
                                            <span className="font-bold text-sm dark:text-white text-center">{plan.destination}</span>
                                        </div>
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300 text-sm text-center mb-3">
                                        {formatDate(plan.start_date)} - {formatDate(plan.end_date)}
                                    </div>
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {shipments
                    .filter(s => user.role === 'shipper' ? s.status !== 'accepted' : true)
                    .map(shipment => (
                        <ShipmentCard key={shipment.id} shipment={shipment} cityMap={cityMap} />
                    ))}
            </div>

            {shipments.length === 0 && (
                <p className="text-center text-gray-500 mt-10">No shipments found.</p>
            )}
        </div>
    );
};

const ShipmentCard = ({ shipment, cityMap }) => {
    const getCityImage = (name) => {
        if (!name || !cityMap) return null;
        const lower = name.toLowerCase();

        let url = null;
        if (cityMap[lower]) url = cityMap[lower];
        else {
            const found = Object.keys(cityMap).find(k => lower.includes(k));
            if (found) url = cityMap[found];
        }

        if (!url) console.warn(`Missing image for city: ${name}`);
        return url;
    };

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
                </div>
                <div className="flex-grow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col items-center">
                            {getCityImage(shipment.origin) && (
                                <img src={getCityImage(shipment.origin)} alt={shipment.origin} className="w-24 h-16 rounded-lg object-cover border border-gray-200 mb-2" title={shipment.origin} />
                            )}
                            <span className="font-semibold text-xs text-gray-600 dark:text-gray-400 text-center">{shipment.origin}</span>
                        </div>
                        <span className="font-bold text-gray-400 text-xl">→</span>
                        <div className="flex flex-col items-center">
                            {getCityImage(shipment.destination) && (
                                <img src={getCityImage(shipment.destination)} alt={shipment.destination} className="w-24 h-16 rounded-lg object-cover border border-gray-200 mb-2" title={shipment.destination} />
                            )}
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
                <span className={`px-2 py-1 rounded text-sm ${shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    shipment.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                    }`}>
                    {shipment.status.toUpperCase()}
                </span>
                <span className="text-blue-600 text-sm">View Details →</span>
            </div>
        </Link>
    );
};

export default Dashboard;
