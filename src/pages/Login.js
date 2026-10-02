import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const inputClass = "pp-field w-full h-11 rounded-[9px] border border-peerpost-borderStrong bg-peerpost-ink text-peerpost-heading placeholder-peerpost-faint px-3.5 text-[14.5px] font-body focus:outline-none focus:ring-2 focus:ring-peerpost-gold/60";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
            navigate('/dashboard');
        } else {
            setError(res.error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-peerpost-ink flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px] bg-peerpost-surface border border-peerpost-border rounded-2xl p-10">
                <div className="text-center mb-8">
                    <h2 className="font-heading font-medium text-[27px] text-peerpost-heading mb-2">Welcome back</h2>
                    <p className="font-body text-sm text-peerpost-muted">Log in to track shipments and manage your trips.</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-sm p-3 font-body">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
                    <div className="flex flex-col gap-[7px]">
                        <label className="font-body text-[13px] font-semibold text-peerpost-body">Email address</label>
                        <input
                            type="email"
                            className={inputClass}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <label className="font-body text-[13px] font-semibold text-peerpost-body">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className={inputClass + " pr-10"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-peerpost-faint hover:text-peerpost-body"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-1.5 text-center font-body text-[15px] font-bold text-peerpost-goldInk bg-peerpost-gold hover:bg-peerpost-goldHover transition py-3.5 rounded-[9px]"
                    >
                        Log in
                    </button>
                </form>

                <p className="mt-7 text-center font-body text-[13.5px] text-peerpost-muted">
                    New to PeerPost? <Link to="/register" className="font-bold text-peerpost-gold hover:text-peerpost-goldHover">Create an account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
