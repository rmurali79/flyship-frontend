import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const Wallet = () => {
    const { user } = useAuth();
    const [wallets, setWallets] = useState([]);

    const flagMapping = {
        'USD': { code: 'us', emoji: '🇺🇸' },
        'EUR': { code: 'eu', emoji: '🇪🇺' },
        'SGD': { code: 'sg', emoji: '🇸🇬' },
        'GBP': { code: 'gb', emoji: '🇬🇧' },
    };
    const [activeTab, setActiveTab] = useState('deposit');
    const [formData, setFormData] = useState({
        currency: 'USD',
        amount: ''
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const fetchWallets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(API_BASE + '/api/wallet', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWallets(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchWallets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const url = `${API_BASE}/api/wallet/${activeTab}`;
            await axios.post(url, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage(`${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'} successful!`);
            setFormData({ ...formData, amount: '' });
            fetchWallets(); // Refresh balance
        } catch (err) {
            setError(err.response?.data?.error || 'Transaction failed');
        }
    };

    const getBalance = (currency) => {
        const wallet = wallets.find(w => w.currency === currency);
        return wallet ? wallet.balance : '0.00';
    };

    const getLockedBalance = (currency) => {
        const wallet = wallets.find(w => w.currency === currency);
        return wallet ? wallet.locked_balance : '0.00';
    };

    return (
        <div className="max-w-4xl mx-auto my-10 px-4">
            <div className="flex items-center mb-8">
                <WalletIcon className="w-8 h-8 mr-3 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl font-bold dark:text-white">Manage Wallet</h1>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {['USD', 'EUR', 'SGD'].map(currency => (
                    <div key={currency} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-blue-500">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-gray-500 dark:text-gray-400 font-bold">{currency} Balance</h3>
                            {flagMapping[currency] && (
                                <img
                                    src={`https://flagcdn.com/w40/${flagMapping[currency].code}.png`}
                                    srcSet={`https://flagcdn.com/w80/${flagMapping[currency].code}.png 2x`}
                                    width="40"
                                    alt={currency}
                                    className="w-10 h-10 object-cover rounded-full shadow-sm border border-gray-200"
                                />
                            )}
                        </div>
                        <p className="text-3xl font-bold dark:text-white mt-2">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(getBalance(currency))}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Locked: {new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(getLockedBalance(currency))}
                        </p>
                    </div>
                ))}
            </div>

            {/* Action Area */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b dark:border-gray-700">
                    <button
                        className={`flex-1 py-4 font-bold text-center flex items-center justify-center ${activeTab === 'deposit' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        onClick={() => setActiveTab('deposit')}
                    >
                        <ArrowDownCircle className="w-5 h-5 mr-2" />
                        Deposit Funds
                    </button>
                    <button
                        className={`flex-1 py-4 font-bold text-center flex items-center justify-center ${activeTab === 'withdraw' ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 dark:bg-gray-700 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        onClick={() => setActiveTab('withdraw')}
                    >
                        <ArrowUpCircle className="w-5 h-5 mr-2" />
                        Withdraw Funds
                    </button>
                </div>

                <div className="p-8">
                    {message && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{message}</div>}
                    {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Currency</label>
                            <select
                                className="w-full p-3 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="USD">🇺🇸 USD ($)</option>
                                <option value="EUR">🇪🇺 EUR (€)</option>
                                <option value="SGD">🇸🇬 SGD (S$)</option>
                                <option value="GBP">🇬🇧 GBP (£)</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="w-full p-3 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full py-3 rounded text-white font-bold transition ${activeTab === 'deposit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                        >
                            {activeTab === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
