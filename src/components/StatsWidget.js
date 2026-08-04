import API_BASE from '../config/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, DollarSign, Package, CreditCard } from 'lucide-react';

const StatsWidget = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalSpends: 0,
        totalEarnings: 0,
        itemsShipped: 0,
        tripsDone: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get token if needed manually, but better to fix AuthContext to use interceptors if possible.
                // For now, manual header like in other components.
                const token = localStorage.getItem('token');
                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };
                const res = await axios.get(API_BASE + '/api/users/stats', config);
                setStats(res.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };
        fetchStats();
    }, []);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const isShipper = user.role === 'shipper' || user.role === 'both';
    const isTraveler = user.role === 'traveler' || user.role === 'both';

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {isShipper && (
                <>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
                        <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase">Total Spends</div>
                            <div className="text-lg sm:text-2xl font-bold dark:text-white mt-1">{formatCurrency(stats.totalSpends)}</div>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                            <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center justify-between">
                        <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase">Items Shipped</div>
                            <div className="text-lg sm:text-2xl font-bold dark:text-white mt-1">{stats.itemsShipped}</div>
                        </div>
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full dark:bg-green-900">
                            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-300" />
                        </div>
                    </div>
                </>
            )}

            {isTraveler && (
                <>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-green-500 flex items-center justify-between">
                        <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase">Total Earnings</div>
                            <div className="text-lg sm:text-2xl font-bold dark:text-white mt-1">{formatCurrency(stats.totalEarnings)}</div>
                        </div>
                        <div className="p-2 sm:p-3 bg-green-100 rounded-full dark:bg-green-900">
                            <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-300" />
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md border-l-4 border-blue-500 flex items-center justify-between">
                        <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold uppercase">Trips Done</div>
                            <div className="text-lg sm:text-2xl font-bold dark:text-white mt-1">{stats.tripsDone}</div>
                        </div>
                        <div className="p-2 sm:p-3 bg-blue-100 rounded-full dark:bg-blue-900">
                            <Briefcase className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-300" />
                        </div>
                    </div>
                </>
            )}

            {/* Common or Placeholder stats if needed, but requirements specific */}
        </div>
    );
};

export default StatsWidget;
