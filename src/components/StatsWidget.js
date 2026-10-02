import React from 'react';
import { Briefcase, CreditCard, DollarSign, Hourglass, Package, Star, Truck } from 'lucide-react';

const ICONS = {
    Earnings: DollarSign,
    'Total spent': CreditCard,
    'Active deliveries': Truck,
    'Deliveries done': Briefcase,
    'Awaiting quotes': Hourglass,
    'In progress': Package,
    Rating: Star,
};

// Full-width row of stat tiles; the dashboard builds the tiles (utils/dashboardSummary).
const StatsWidget = ({ tiles }) => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 mb-10">
        {tiles.map(({ label, value, hint }) => {
            const Icon = ICONS[label] || Package;
            return (
                <div key={label} className="card p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{label}</div>
                        <Icon className="w-4 h-4 flex-none text-peerpost-gold" aria-hidden="true" />
                    </div>
                    <div className="figure mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white truncate">{value}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate">{hint}</div>
                </div>
            );
        })}
    </div>
);

export default StatsWidget;
