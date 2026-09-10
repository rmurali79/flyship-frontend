import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import API_BASE from '../config/api';

const POLL_INTERVAL_MS = 30000;

const NotificationBell = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const menuRef = useRef(null);

    const fetchUnreadCount = useCallback(async () => {
        try {
            const res = await axios.get(API_BASE + '/api/notifications/unread-count');
            setUnreadCount(res.data.unread_count || 0);
        } catch (error) {
            // Best-effort: leave the last known count on failure.
        }
    }, []);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, POLL_INTERVAL_MS);
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOpen = async () => {
        const next = !open;
        setOpen(next);
        if (next) {
            setLoading(true);
            try {
                const res = await axios.get(API_BASE + '/api/notifications');
                setNotifications(res.data || []);
            } catch (error) {
                setNotifications([]);
            } finally {
                setLoading(false);
            }
        }
    };

    const markAsRead = async (id) => {
        try {
            await axios.put(`${API_BASE}/api/notifications/${id}/read`);
            setNotifications((current) => current.map((n) => (n.id === id ? { ...n, read: true } : n)));
            setUnreadCount((count) => Math.max(0, count - 1));
        } catch (error) {
            // Best-effort: leave state unchanged on failure.
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.put(`${API_BASE}/api/notifications/read-all`);
            setNotifications((current) => current.map((n) => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            // Best-effort: leave state unchanged on failure.
        }
    };

    const hasUnread = notifications.some((n) => !n.read);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleOpen}
                aria-label="Notifications"
                className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 min-w-[1rem] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>
            {open && (
                <div
                    data-testid="notification-panel"
                    className="fixed inset-y-0 right-0 top-16 w-80 bg-white dark:bg-gray-700 shadow-lg border-l dark:border-gray-600 z-50 flex flex-col"
                >
                    <div className="px-4 py-2 border-b dark:border-gray-600 flex items-center justify-between">
                        <p className="font-bold text-gray-900 dark:text-white text-sm">Notifications</p>
                        {hasUnread && (
                            <button onClick={markAllAsRead} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
                        ) : notifications.length === 0 ? (
                            <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
                        ) : (
                            notifications.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => !n.read && markAsRead(n.id)}
                                    className={`w-full text-left px-4 py-2 text-sm border-b last:border-b-0 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 ${
                                        n.read
                                            ? 'text-gray-500 dark:text-gray-400'
                                            : 'text-gray-900 dark:text-white font-medium bg-blue-50 dark:bg-gray-600/50'
                                    }`}
                                >
                                    <p>{n.title}</p>
                                    <p className="text-xs font-normal text-gray-500 dark:text-gray-400 mt-0.5">{n.message}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
