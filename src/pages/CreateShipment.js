import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const CreateShipment = () => {
    const snackbar = useSnackbar();
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        item_description: '',
        photo_url: '',
        weight: '',
        dimension_length: '',
        dimension_width: '',
        dimension_height: '',
        max_budget: '',
        shipment_arrangement: 'self_handover',
        collection_point: '',
        delivery_recipient_name: '',
        delivery_address: '',
        delivery_arrangement: 'self_collect',
        details: '',
        escrow_amount: '',
        escrow_currency: 'USD'
    });

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch cities
        const fetchCities = async () => {
            try {
                const res = await axios.get(API_BASE + '/api/cities');
                setCities(res.data);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };
        fetchCities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            await axios.post(API_BASE + '/api/shipments', formData, config);
            snackbar.success('Shipment created');
            navigate('/dashboard');
        } catch (error) {
            console.error('Error creating shipment:', error);
            snackbar.error('Failed to create shipment: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="max-w-4xl mx-auto card p-6 sm:p-8 my-10">
            <h1 className="page-title mb-8">Create shipment</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Route Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="label">Origin</label>
                        <select
                            name="origin"
                            className="field"
                            value={formData.origin}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Origin City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.name}>{city.name} ({city.code})</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Destination</label>
                        <select
                            name="destination"
                            className="field"
                            value={formData.destination}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Destination City</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.name}>{city.name} ({city.code})</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Item Details */}
                <div>
                    <label className="label">Description of Item</label>
                    <textarea name="item_description" rows="3" className="field" value={formData.item_description} onChange={handleChange} required placeholder="What are you shipping?"></textarea>
                </div>

                <div>
                    <label className="label">Photo</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-3 file:rounded-lg file:border file:border-gray-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gray-800 hover:file:bg-gray-50 dark:file:border-gray-600 dark:file:bg-gray-800 dark:file:text-gray-100"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;

                                const uploadData = new FormData();
                                uploadData.append('photo', file);

                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await axios.post(API_BASE + '/api/upload', uploadData, {
                                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
                                    });
                                    const url = res.data.url.startsWith('http') ? res.data.url : API_BASE + res.data.url;
                                    setFormData({ ...formData, photo_url: url });
                                } catch (error) {
                                    console.error('Upload failed', error);
                                    snackbar.error('Image upload failed');
                                }
                            }}
                        />
                        <span className="text-sm text-gray-500">OR</span>
                        <input
                            type="url"
                            name="photo_url"
                            className="field"
                            value={formData.photo_url}
                            onChange={handleChange}
                            placeholder="http://localhost:3000/photos/..."
                        />
                    </div>
                    {formData.photo_url && (
                        <img src={formData.photo_url} alt="Preview" className="h-32 mt-4 rounded object-cover" />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="label">Weight (kg)</label>
                        <input type="number" step="0.1" name="weight" className="field" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="label">Max budget (USD)</label>
                        <input type="number" step="0.01" name="max_budget" className="field" value={formData.max_budget} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <label className="label">Dimensions (CM)</label>
                    <div className="grid grid-cols-3 gap-4">
                        <input type="number" name="dimension_length" placeholder="Length" className="field" value={formData.dimension_length} onChange={handleChange} required />
                        <input type="number" name="dimension_width" placeholder="Width" className="field" value={formData.dimension_width} onChange={handleChange} required />
                        <input type="number" name="dimension_height" placeholder="Height" className="field" value={formData.dimension_height} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <label className="label">Reach Latest By</label>
                    <input type="date" name="reach_latest_by" className="field" value={formData.reach_latest_by} onChange={handleChange} required />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40">
                    <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Security & Escrow</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Set an escrow amount that the traveler must deposit. This provides security for your shipment.
                        The amount will be released back to the traveler upon successful delivery.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="label">Escrow Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="escrow_amount"
                                placeholder="0.00"
                                className="field"
                                value={formData.escrow_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="label">Currency</label>
                            <select
                                name="escrow_currency"
                                className="field"
                                value={formData.escrow_currency}
                                onChange={handleChange}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="SGD">SGD (S$)</option>
                                <option value="GBP">GBP (£)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logistics */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Logistics</h3>

                    <div className="mb-4">
                        <label className="label">Shipment Arrangement</label>
                        <select name="shipment_arrangement" className="field" value={formData.shipment_arrangement} onChange={handleChange}>
                            <option value="self_handover">Self Handover</option>
                            <option value="need_collection">Need Collection</option>
                        </select>
                    </div>

                    {formData.shipment_arrangement === 'need_collection' && (
                        <div className="mb-4">
                            <label className="label">Collection Point</label>
                            <input type="text" name="collection_point" className="field" value={formData.collection_point} onChange={handleChange} required />
                        </div>
                    )}
                    {formData.shipment_arrangement === 'self_handover' && (
                        <div className="mb-4">
                            <label className="label">Collection Point (Where you will handover)</label>
                            <input type="text" name="collection_point" className="field" value={formData.collection_point} onChange={handleChange} required />
                        </div>
                    )}
                </div>

                {/* Delivery Details */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-display text-lg font-semibold text-gray-900 dark:text-white mb-4">Delivery Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="label">Recipient Name</label>
                            <input type="text" name="delivery_recipient_name" className="field" value={formData.delivery_recipient_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="label">Delivery Address</label>
                            <input type="text" name="delivery_address" className="field" value={formData.delivery_address} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="label">Delivery Arrangement</label>
                        <select name="delivery_arrangement" className="field" value={formData.delivery_arrangement} onChange={handleChange}>
                            <option value="self_collect">Recipient will Self Collect</option>
                            <option value="deliver">traveler Deliver to Address</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-lg">Cancel</button>
                    <button type="submit" className="btn btn-primary btn-lg">Create shipment</button>
                </div>
            </form>
        </div>
    );
};

export default CreateShipment;
