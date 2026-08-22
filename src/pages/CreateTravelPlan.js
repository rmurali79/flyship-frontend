import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';

const CreateTravelPlan = () => {
    const snackbar = useSnackbar();
    const [cities, setCities] = useState([]);
    const [formData, setFormData] = useState({
        origin: '',
        destination: '',
        start_date: '',
        end_date: '',
        available_baggage_kg: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
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

    const [isListening, setIsListening] = useState(false);

    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            snackbar.warn("Your browser does not support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            console.log("Voice Input:", transcript);

            // Regex patterns
            // 1. "Dubai to London on 25th Dec 2025" or "Dubai to London on 2025-12-25"
            const pattern = /(.*?) to (.*?) on (.*)/i;
            const match = transcript.match(pattern);

            if (match) {
                const origin = match[1].trim();
                const destination = match[2].trim();
                let dateStr = match[3].trim();

                // Remove ordinal suffixes (st, nd, rd, th) to help Date.parse
                // e.g. "25th Jan 2025" -> "25 Jan 2025"
                dateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, '$1');

                // Simple date parsing (using Date.parse)
                const dateObj = new Date(dateStr);
                if (!isNaN(dateObj)) {
                    // Adjust for timezone offset to prevent date shifting
                    // Create date as UTC then get ISO string part
                    const offsetDate = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000));
                    const isoDate = offsetDate.toISOString().split('T')[0];

                    setFormData({
                        ...formData,
                        origin,
                        destination,
                        start_date: isoDate,
                        end_date: isoDate // Defaulting end date to start date for simple voice input
                    });
                } else {
                    snackbar.warn(`Could not parse date: ${match[3]}`);
                }
            } else {
                snackbar.warn("Could not understand the phrase. Try 'Dubai to London on 25th Dec 2025'.");
            }
        };

        recognition.start();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(API_BASE + '/api/travel-plans', formData, config);
            snackbar.success('Travel plan created');
            navigate('/dashboard');
        } catch (error) {
            snackbar.error('Failed to create travel plan');
        }
    };

    return (
        <div className="max-w-md mx-auto my-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Create Travel Plan</h2>

            <button
                type="button"
                onClick={handleVoiceInput}
                className={`w-full mb-6 py-3 rounded font-bold text-white transition-colors ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                    }`}
            >
                {isListening ? 'Listening...' : '🎤 Tap to Speak'}
            </button>
            <p className="text-center text-gray-500 text-sm mb-6 italic">
                Try saying: "Dubai to London on 25th Dec 2025"
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Origin</label>
                    <select
                        name="origin"
                        className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={formData.origin}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Origin</option>
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
                        <option value="">Select Destination</option>
                        {cities.map(city => (
                            <option key={city.id} value={city.name}>{city.name} ({city.code})</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Travel Start Date</label>
                    <input type="date" name="start_date" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.start_date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Travel End Date (Arrival)</label>
                    <input type="date" name="end_date" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.end_date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-gray-700 dark:text-gray-300 mb-2 font-bold">Available Baggage (kg)</label>
                    <input type="number" step="0.1" min="0" name="available_baggage_kg" placeholder="e.g. 5.0" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" value={formData.available_baggage_kg} onChange={handleChange} required />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shipments heavier than this won't be shown to you as matches.</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3 border rounded text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">Cancel</button>
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">Add Plan</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTravelPlan;
