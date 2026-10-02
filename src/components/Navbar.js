import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center text-gray-900 dark:text-white">
                        <FlyshipMark size={40} className="h-10 w-auto" />
                    </Link>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <ThemeToggle />
                        {user ? (
                            <>
                            <NotificationBell />
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-peerpost-gold/60 rounded-full"
                                >
                                    <span className="hidden md:inline text-gray-700 dark:text-gray-300 text-sm">
                                        {user.name}
                                    </span>
                                    <span className="w-10 h-10 rounded-full bg-peerpost-gold text-peerpost-goldInk font-bold flex items-center justify-center text-sm overflow-hidden">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 card shadow-lg py-1 z-50">
                                        <div className="px-4 py-2 border-b dark:border-gray-700">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/profile"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                        >
                                            Edit Profile
                                        </Link>
                                        <Link
                                            to="/wallet"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                        >
                                            Wallet
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm border-t dark:border-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                            </>
                        ) : (
                            <div className="space-x-2">
                                <Link to="/login" className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded bg-peerpost-gold text-peerpost-goldInk font-semibold hover:bg-peerpost-goldHover">
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
