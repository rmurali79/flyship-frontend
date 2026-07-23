import API_BASE from '../config/api';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OTPVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const email = location.state?.email;

    if (!email) {
        return <div className="text-center mt-10">Invalid access. Please register first.</div>;
    }

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(API_BASE + '/api/auth/verify-otp', { email, otp });
            setMessage(res.data.message);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Verification failed');
        }
    };

    const handleResend = async () => {
        try {
            const res = await axios.post(API_BASE + '/api/auth/resend-otp', { email });
            setMessage(res.data.message);
            setError('');
        } catch (err) {
            setError(err.response?.data?.error || 'Resend failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center dark:text-white">Verify Your Email</h2>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
                An OTP has been sent to <strong>{email}</strong>.
            </p>

            {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleVerify}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Enter OTP</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center tracking-widest text-xl"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength="6"
                        required
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition mb-4">
                    Verify
                </button>
            </form>

            <button
                onClick={handleResend}
                className="w-full text-blue-600 hover:underline dark:text-blue-400 text-sm"
            >
                Resend OTP
            </button>
        </div>
    );
};

export default OTPVerification;
