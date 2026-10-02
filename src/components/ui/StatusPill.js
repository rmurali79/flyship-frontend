import React from 'react';

// One status vocabulary and color set for shipments, quotes and disputes, in light and dark.
const TONES = {
    amber: 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-300',
    violet: 'bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300',
    orange: 'bg-orange-100 text-orange-800 dark:bg-orange-400/15 dark:text-orange-300',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-400/15 dark:text-gray-300',
};

const STATUS_TONE = {
    pending: 'amber',
    open: 'amber',
    accepted: 'blue',
    under_review: 'blue',
    in_transit: 'violet',
    delivered: 'green',
    completed: 'green',
    deleted: 'red',
    rejected: 'red',
    withdrawn: 'orange',
    cancelled: 'gray',
};

export const statusLabel = (status = '') =>
    status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

const StatusPill = ({ status, className = '' }) => (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${TONES[STATUS_TONE[status]] || TONES.gray} ${className}`}>
        {statusLabel(status)}
    </span>
);

export default StatusPill;
