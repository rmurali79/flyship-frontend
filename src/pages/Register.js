import API_BASE from '../config/api';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Register</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Country Code</label>
                    <input
                        type="text"
                        name="country_code"
                        placeholder="e.g. +1"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.country_code}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                    <input
                        type="text"
                        name="mobile_number"
                        placeholder="e.g. 1234567890"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.mobile_number}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Password</label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
                    <select
                        name="role"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="shipper">Shipper (I want to send packages)</option>
                        <option value="traveler">Traveler (I can carry packages)</option>
                        <option value="both">Both (I want to do both)</option>
                    </select>
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">Profile Picture</label>
                    <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                    {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
                    {formData.profile_picture && (
                        <div className="mt-2">
                            <span className="text-green-600 text-sm">✓ Uploaded</span>
                            <img src={formData.profile_picture} alt="Preview" className="w-16 h-16 rounded-full object-cover mt-1 border" />
                        </div>
                    )}
                </div>
                <div className="mb-6 flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                            required
                        />
                    </div>
                    <label htmlFor="terms" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                        I agree to the <Link to="/terms" className="text-blue-600 hover:underline dark:text-blue-500" target="_blank">Terms of Service</Link>
                    </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
                    Register
                </button>
            </form>
            <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
                Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
        </div>
    );
};

export default Register;
