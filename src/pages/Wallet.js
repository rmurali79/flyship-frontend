import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Wallet as WalletIcon, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatMoney } from '../utils/money';

const Wallet = () => {
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
        return wallet?.balance ?? 0;
    };

    const getLockedBalance = (currency) => {
        const wallet = wallets.find(w => w.currency === currency);
        return wallet?.locked_balance ?? 0;
    };

    return (
        <div className="max-w-4xl mx-auto my-10 px-4">
            <div className="flex items-center mb-8">
                <WalletIcon className="w-8 h-8 mr-3 text-peerpost-gold" />
                <h1 className="page-title">Wallet</h1>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {['USD', 'EUR', 'SGD'].map(currency => (
                    <div key={currency} className="card p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{currency} balance</h3>
                            {flagMapping[currency] && (
                                <img
                                    src={`https://flagcdn.com/w40/${flagMapping[currency].code}.png`}
                                    srcSet={`https://flagcdn.com/w80/${flagMapping[currency].code}.png 2x`}
                                    width="40"
                                    alt={currency}
                                    className="w-10 h-10 object-cover rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
                                />
                            )}
                        </div>
                        <p className="figure text-3xl font-semibold text-gray-900 dark:text-white mt-2">
                            {formatMoney(getBalance(currency), currency)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Locked: <span className="figure">{formatMoney(getLockedBalance(currency), currency)}</span>
                        </p>
                    </div>
                ))}
            </div>

            {/* Action Area */}
            <div className="card overflow-hidden">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button
                        className={`flex-1 py-4 font-semibold text-center flex items-center justify-center ${activeTab === 'deposit' ? 'text-gray-900 border-b-2 border-peerpost-gold dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                        onClick={() => setActiveTab('deposit')}
                    >
                        <ArrowDownCircle className="w-5 h-5 mr-2" />
                        Deposit Funds
                    </button>
                    <button
                        className={`flex-1 py-4 font-semibold text-center flex items-center justify-center ${activeTab === 'withdraw' ? 'text-gray-900 border-b-2 border-peerpost-gold dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                        onClick={() => setActiveTab('withdraw')}
                    >
                        <ArrowUpCircle className="w-5 h-5 mr-2" />
                        Withdraw Funds
                    </button>
                </div>

                <div className="p-8">
                    {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300">{message}</div>}
                    {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300">{error}</div>}

                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="mb-4">
                            <label className="label">Currency</label>
                            <select
                                className="field py-2.5"
                                value={formData.currency}
                                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="SGD">SGD</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                        <div className="mb-6">
                            <label className="label">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                className="field py-2.5"
                                placeholder="0.00"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-full"
                        >
                            {activeTab === 'deposit' ? 'Deposit' : 'Withdraw'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Wallet;
