import API_BASE from '../config/api';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Briefcase, DollarSign, Package, CreditCard } from 'lucide-react';
import { formatMoney } from '../utils/money';

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

    const isShipper = user.role === 'shipper' || user.role === 'both';
    const isTraveler = user.role === 'traveler' || user.role === 'both';

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
            {isShipper && (
                <>
                    <StatTile label="Total spends" value={formatMoney(stats.totalSpends || 0)} icon={CreditCard} />
                    <StatTile label="Items shipped" value={stats.itemsShipped ?? 0} icon={Package} />
                </>
            )}
            {isTraveler && (
                <>
                    <StatTile label="Total earnings" value={formatMoney(stats.totalEarnings || 0)} icon={DollarSign} />
                    <StatTile label="Trips done" value={stats.tripsDone ?? 0} icon={Briefcase} />
                </>
            )}
        </div>
    );
};

const StatTile = ({ label, value, icon: Icon }) => (
    <div className="card p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
            <div className="figure mt-1.5 text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">{value}</div>
        </div>
        <div className="flex-none p-2 sm:p-2.5 rounded-lg bg-peerpost-gold/10 text-peerpost-gold">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </div>
    </div>
);

export default StatsWidget;
