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
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md my-10">
            <h1 className="text-3xl font-bold mb-8 dark:text-white">Create New Shipment</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Route Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Origin</label>
                        <select
                            name="origin"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Destination</label>
                        <select
                            name="destination"
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Description of Item</label>
                    <textarea name="item_description" rows="3" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.item_description} onChange={handleChange} required placeholder="What are you shipping?"></textarea>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Photo</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full text-gray-500 dark:text-gray-300"
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
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Weight (kg)</label>
                        <input type="number" step="0.1" name="weight" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.weight} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Max Budget ($)</label>
                        <input type="number" step="0.01" name="max_budget" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.max_budget} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Dimensions (CM)</label>
                    <div className="grid grid-cols-3 gap-4">
                        <input type="number" name="dimension_length" placeholder="Length" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.dimension_length} onChange={handleChange} required />
                        <input type="number" name="dimension_width" placeholder="Width" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.dimension_width} onChange={handleChange} required />
                        <input type="number" name="dimension_height" placeholder="Height" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.dimension_height} onChange={handleChange} required />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Reach Latest By</label>
                    <input type="date" name="reach_latest_by" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.reach_latest_by} onChange={handleChange} required />
                </div>

                <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Security & Escrow</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Set an escrow amount that the traveler must deposit. This provides security for your shipment.
                        The amount will be released back to the traveler upon successful delivery.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Escrow Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                name="escrow_amount"
                                placeholder="0.00"
                                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                                value={formData.escrow_amount}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Currency</label>
                            <select
                                name="escrow_currency"
                                className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white"
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
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Logistics</h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Shipment Arrangement</label>
                        <select name="shipment_arrangement" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.shipment_arrangement} onChange={handleChange}>
                            <option value="self_handover">Self Handover</option>
                            <option value="need_collection">Need Collection</option>
                        </select>
                    </div>

                    {formData.shipment_arrangement === 'need_collection' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Collection Point</label>
                            <input type="text" name="collection_point" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.collection_point} onChange={handleChange} required />
                        </div>
                    )}
                    {formData.shipment_arrangement === 'self_handover' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Collection Point (Where you will handover)</label>
                            <input type="text" name="collection_point" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.collection_point} onChange={handleChange} required />
                        </div>
                    )}
                </div>

                {/* Delivery Details */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-4 dark:text-white">Delivery Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Recipient Name</label>
                            <input type="text" name="delivery_recipient_name" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.delivery_recipient_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label className="block text-gray-700 dark:text-gray-300 mb-2">Delivery Address</label>
                            <input type="text" name="delivery_address" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.delivery_address} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-300 mb-2">Delivery Arrangement</label>
                        <select name="delivery_arrangement" className="w-full p-2 border rounded dark:bg-gray-600 dark:border-gray-500 dark:text-white" value={formData.delivery_arrangement} onChange={handleChange}>
                            <option value="self_collect">Recipient will Self Collect</option>
                            <option value="deliver">traveler Deliver to Address</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Create Shipment</button>
                </div>
            </form>
        </div>
    );
};

export default CreateShipment;
