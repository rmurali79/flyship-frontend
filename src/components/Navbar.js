import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FlyshipMark from './FlyshipMark';

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setDarkMode(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setDarkMode(true);
        }
    };

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400">
                        <FlyshipMark size={40} dark={darkMode} className="h-10 w-auto md:h-8" />
                        <span className="hidden md:inline">Flyship</span>
                    </Link>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        {user ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                                >
                                    <span className="hidden md:inline text-gray-700 dark:text-gray-300 text-sm">
                                        {user.name}
                                    </span>
                                    <span className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm border-2 border-blue-700 overflow-hidden">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            getInitials(user.name)
                                        )}
                                    </span>
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-700 rounded-lg shadow-lg border dark:border-gray-600 py-1 z-50">
                                        <div className="px-4 py-2 border-b dark:border-gray-600">
                                            <p className="font-bold text-gray-900 dark:text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
                                        </div>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/wallet"
                                            onClick={() => setMenuOpen(false)}
                                            className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm"
                                        >
                                            Wallet
                                        </Link>
                                        <div className="px-4 py-2 border-t dark:border-gray-600 flex items-center justify-between">
                                            <span className="text-sm text-gray-700 dark:text-gray-200">Dark mode</span>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={darkMode}
                                                onClick={toggleDarkMode}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                                                    darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <span
                                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                        darkMode ? 'translate-x-6' : 'translate-x-1'
                                                    }`}
                                                />
                                            </button>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm border-t dark:border-gray-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-x-2">
                                <Link to="/login" className="px-4 py-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                    Login
                                </Link>
                                <Link to="/register" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
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
