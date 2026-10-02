import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, LogOut, UserRound, Wallet as WalletIcon } from 'lucide-react';
import API_BASE from '../config/api';
import { formatMoney } from '../utils/money';
import { useAuth } from '../context/AuthContext';
import FlyshipMark from './FlyshipMark';
import NotificationBell from './NotificationBell';
import ThemeToggle from './ThemeToggle';

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

// The balance shown in the top bar: USD if it holds anything, else the first wallet that does.
export const headlineBalance = (wallets = []) => {
    const usd = wallets.find(w => w.currency === 'USD');
    if (usd && Number(usd.balance) > 0) return usd;
    return wallets.find(w => Number(w.balance) > 0) || usd || { currency: 'USD', balance: 0 };
};

const navLinkClass = ({ isActive }) =>
    `px-1 py-5 text-sm font-semibold border-b-2 transition ${isActive
        ? 'border-peerpost-gold text-gray-900 dark:text-white'
        : 'border-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`;

const menuItemClass = 'flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [wallet, setWallet] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Refreshed on navigation, so a deposit or payout shows up when you leave the wallet page.
    useEffect(() => {
        if (!user) { setWallet(null); return; }
        let cancelled = false;
        axios.get(API_BASE + '/api/wallet', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
            .then(res => { if (!cancelled) setWallet(headlineBalance(Array.isArray(res.data) ? res.data : [])); })
            .catch(() => { if (!cancelled) setWallet(null); });
        return () => { cancelled = true; };
    }, [user, location.pathname]);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    return (
        // Keep the bar free of backdrop-filter / transform / filter: any of them makes it the
        // containing block for fixed children, which collapsed the notification panel to 0px.
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex items-center h-16 gap-8">
                    <Link to="/" className="flex items-center text-gray-900 dark:text-white">
                        <FlyshipMark size={40} className="h-10 w-auto" />
                    </Link>

                    {user && (
                        <div className="hidden md:flex items-center gap-6 self-stretch">
                            <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
                            <NavLink to="/wallet" className={navLinkClass}>Wallet</NavLink>
                        </div>
                    )}

                    <div className="ml-auto flex items-center gap-2 md:gap-3">
                        {user && wallet && (
                            <Link
                                to="/wallet"
                                title="Wallet balance"
                                className="hidden sm:inline-flex figure items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-800 hover:border-gray-300 dark:border-gray-700 dark:text-gray-100 dark:hover:border-gray-600"
                            >
                                {formatMoney(wallet.balance, wallet.currency)}
                            </Link>
                        )}
                        <ThemeToggle compact={!!user} />
                        {user ? (
                            <>
                            <NotificationBell />
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    aria-label="Account menu"
                                    aria-expanded={menuOpen}
                                    className="flex rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-peerpost-gold/60"
                                >
                                    <span className="w-9 h-9 rounded-full bg-peerpost-gold text-peerpost-goldInk font-bold flex items-center justify-center text-sm overflow-hidden">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 card shadow-lg py-1 z-50" onClick={() => setMenuOpen(false)}>
                                        <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-700">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role === 'both' ? 'Shipper and traveler' : user.role}</p>
                                        </div>
                                        <Link to="/dashboard" className={`${menuItemClass} md:hidden`}><LayoutDashboard size={16} aria-hidden="true" />Dashboard</Link>
                                        <Link to="/wallet" className={`${menuItemClass} md:hidden`}><WalletIcon size={16} aria-hidden="true" />Wallet</Link>
                                        <Link to="/profile" className={menuItemClass}><UserRound size={16} aria-hidden="true" />Edit profile</Link>
                                        <button onClick={handleLogout} className={`${menuItemClass} w-full text-left text-red-600 dark:text-red-400 border-t border-gray-200 dark:border-gray-700`}>
                                            <LogOut size={16} aria-hidden="true" />Log out
                                        </button>
                                    </div>
                                )}
                            </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login" className="btn btn-secondary border-transparent dark:border-transparent">Log in</Link>
                                <Link to="/register" className="btn btn-primary">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
