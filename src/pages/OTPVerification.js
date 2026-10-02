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
        <div className="max-w-md mx-auto mt-10 card p-6 sm:p-8">
            <h1 className="page-title mb-4 text-center">Verify your email</h1>
            <p className="mb-4 text-center text-gray-600 dark:text-gray-400">
                An OTP has been sent to <strong>{email}</strong>.
            </p>

            {message && <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 dark:bg-green-400/15 dark:text-green-300">{message}</div>}
            {error && <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300">{error}</div>}

            <form onSubmit={handleVerify}>
                <div className="mb-4">
                    <label className="label">Enter OTP</label>
                    <input
                        type="text"
                        className="field figure text-center tracking-[0.4em] text-xl"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        maxLength="6"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-full transition mb-4">
                    Verify
                </button>
            </form>

            <button
                onClick={handleResend}
                className="w-full link text-sm"
            >
                Resend OTP
            </button>
        </div>
    );
};

export default OTPVerification;
