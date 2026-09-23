import API_BASE from '../config/api';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const inputClass = "w-full h-11 rounded-[9px] border border-peerpost-borderStrong bg-peerpost-ink text-peerpost-heading placeholder-peerpost-faint px-3.5 text-sm font-body focus:outline-none focus:ring-2 focus:ring-peerpost-gold/60";
const labelClass = "font-body text-[13px] font-semibold text-peerpost-body";

const ROLE_OPTIONS = [
    { value: 'shipper', label: 'Ship' },
    { value: 'traveler', label: 'Travel & earn' },
    { value: 'both', label: 'Both' },
];

const Register = () => {
    const snackbar = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country_code: '',
        mobile_number: '',
        password: '',
        role: 'shipper',
        profile_picture: ''
    });
    const [uploading, setUploading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');

    // We'll skip the auth context register function and call API directly to handle the custom flow easily
    // Or we could update AuthContext but direct is fine for this specific change
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('profile_picture', file);

        setUploading(true);
        try {
            const res = await axios.post(API_BASE + '/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            // Ensure we use profile_url from response
            setFormData({ ...formData, profile_picture: res.data.profile_url });
        } catch (error) {
            console.error('Upload failed', error);
            setError('Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!agreedToTerms) {
            setError('You must agree to the Terms of Service to register.');
            return;
        }
        try {
            await axios.post(API_BASE + '/api/auth/register', formData);
            snackbar.success('Registration successful! Please check your email for OTP.');
            navigate('/verify-otp', { state: { email: formData.email } });
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-peerpost-ink flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[440px] bg-peerpost-surface border border-peerpost-border rounded-2xl px-10 pt-10 pb-9">
                <div className="text-center mb-[26px]">
                    <h2 className="font-heading font-medium text-2xl text-peerpost-heading mb-2">Join PeerPost</h2>
                    <p className="font-body text-sm text-peerpost-muted">Ship a package or earn as a traveler.</p>
                </div>

                {error && (
                    <div className="mb-5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3 font-body">
                        {error}
                    </div>
                )}

                {/* role toggle */}
                <div className="flex gap-2 p-1 bg-peerpost-ink border border-peerpost-border rounded-[10px] mb-[22px]">
                    {ROLE_OPTIONS.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, role: opt.value })}
                            className={
                                "flex-1 text-center py-2.5 rounded-[7px] text-[13.5px] font-body transition " +
                                (formData.role === opt.value
                                    ? "bg-peerpost-gold text-peerpost-goldInk font-bold"
                                    : "text-peerpost-muted font-semibold hover:text-peerpost-body")
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-[7px]">
                        <label className={labelClass}>Full name</label>
                        <input
                            type="text"
                            name="name"
                            className={inputClass}
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <label className={labelClass}>Email address</label>
                        <input
                            type="email"
                            name="email"
                            className={inputClass}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3.5">
                        <div className="flex flex-col gap-[7px]">
                            <label className={labelClass}>Country code</label>
                            <input
                                type="text"
                                name="country_code"
                                placeholder="e.g. +1"
                                className={inputClass}
                                value={formData.country_code}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-[7px]">
                            <label className={labelClass}>Mobile number</label>
                            <input
                                type="text"
                                name="mobile_number"
                                placeholder="e.g. 1234567890"
                                className={inputClass}
                                value={formData.mobile_number}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <label className={labelClass}>Password</label>
                        <input
                            type="password"
                            name="password"
                            className={inputClass}
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-[7px]">
                        <label className={labelClass}>Profile picture</label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            className="w-full font-body text-sm text-peerpost-muted file:mr-3 file:py-2 file:px-3 file:rounded-[7px] file:border-0 file:bg-peerpost-ink file:text-peerpost-body file:border file:border-peerpost-borderStrong"
                        />
                        {uploading && <p className="text-sm text-peerpost-gold mt-1 font-body">Uploading...</p>}
                        {formData.profile_picture && (
                            <div className="mt-1 flex items-center gap-2">
                                <span className="text-emerald-400 text-sm font-body">✓ Uploaded</span>
                                <img src={formData.profile_picture} alt="Preview" className="w-10 h-10 rounded-full object-cover border border-peerpost-borderStrong" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-start gap-2.5 mt-1">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="mt-0.5 w-[17px] h-[17px] flex-none rounded border-peerpost-borderStrong bg-peerpost-ink text-peerpost-gold focus:ring-peerpost-gold"
                            required
                        />
                        <label htmlFor="terms" className="font-body text-[12.5px] leading-relaxed text-peerpost-muted">
                            I agree to the <Link to="/terms" className="font-bold text-peerpost-gold hover:text-peerpost-goldHover" target="_blank">Terms of Service</Link>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-1 text-center font-body text-[15px] font-bold text-peerpost-goldInk bg-peerpost-gold hover:bg-peerpost-goldHover transition py-3.5 rounded-[9px]"
                    >
                        Create account
                    </button>
                </form>

                <p className="mt-[22px] text-center font-body text-[13.5px] text-peerpost-muted">
                    Already have an account? <Link to="/login" className="font-bold text-peerpost-gold hover:text-peerpost-goldHover">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
