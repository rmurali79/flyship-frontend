import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from '../context/SnackbarContext';

const ALLOWED_PICTURE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const MAX_PICTURE_SIZE_BYTES = 5 * 1024 * 1024;

const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
};

const Profile = () => {
    const { updateUser } = useAuth();
    const snackbar = useSnackbar();
    const [formData, setFormData] = useState({
        name: '',
        country_code: '',
        mobile_number: '',
        role: 'shipper',
        profile_picture: '',
    });
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(API_BASE + '/api/users/profile')
            .then((res) => {
                setFormData({
                    name: res.data.name || '',
                    country_code: res.data.country_code || '',
                    mobile_number: res.data.mobile_number || '',
                    role: res.data.role || 'shipper',
                    profile_picture: res.data.profile_picture || '',
                });
                setEmail(res.data.email || '');
            })
            .catch(() => setError('Failed to load profile'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        e.target.value = '';
        if (!file) return;

        if (!ALLOWED_PICTURE_TYPES.includes(file.type)) {
            setError('Profile picture must be a JPEG, PNG, GIF, or WEBP image');
            return;
        }
        if (file.size > MAX_PICTURE_SIZE_BYTES) {
            setError('Profile picture must be smaller than 5MB');
            return;
        }

        setError('');
        const uploadData = new FormData();
        uploadData.append('profile_picture', file);

        setUploading(true);
        try {
            const res = await axios.post(API_BASE + '/api/upload', uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData((current) => ({ ...current, profile_picture: res.data.profile_url }));
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to upload profile picture');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.name.trim()) {
            setError('Name cannot be empty');
            return;
        }
        setSaving(true);
        try {
            const res = await axios.put(API_BASE + '/api/users/profile', formData);
            updateUser({
                name: res.data.name,
                role: res.data.role,
                profile_picture: res.data.profile_picture,
            });
            snackbar.success('Profile updated');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center dark:text-white">Loading...</div>;
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Edit Profile</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-6 flex flex-col items-center">
                    <span className="w-20 h-20 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xl border-2 border-blue-700 overflow-hidden">
                        {formData.profile_picture ? (
                            <img src={formData.profile_picture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            getInitials(formData.name)
                        )}
                    </span>
                    <label htmlFor="profile-picture-input" className="mt-3 text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">
                        {uploading ? 'Uploading...' : 'Change photo'}
                    </label>
                    <input
                        id="profile-picture-input"
                        type="file"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profile-name" className="block text-gray-700 dark:text-gray-300 mb-2">Name</label>
                    <input
                        id="profile-name"
                        type="text"
                        name="name"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profile-email" className="block text-gray-700 dark:text-gray-300 mb-2">Email</label>
                    <input
                        id="profile-email"
                        type="email"
                        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-400"
                        value={email}
                        disabled
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profile-country-code" className="block text-gray-700 dark:text-gray-300 mb-2">Country Code</label>
                    <input
                        id="profile-country-code"
                        type="text"
                        name="country_code"
                        placeholder="e.g. +1"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.country_code}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profile-mobile-number" className="block text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                    <input
                        id="profile-mobile-number"
                        type="text"
                        name="mobile_number"
                        placeholder="e.g. 1234567890"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.mobile_number}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="profile-role" className="block text-gray-700 dark:text-gray-300 mb-2">I am a...</label>
                    <select
                        id="profile-role"
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
                <button
                    type="submit"
                    disabled={saving}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </form>
        </div>
    );
};

export default Profile;
