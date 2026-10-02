import API_BASE from '../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from '../context/SnackbarContext';
import { Mic } from 'lucide-react';

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
        <div className="max-w-md mx-auto my-10 card p-6 sm:p-8">
            <h1 className="page-title mb-6 text-center">Add travel plan</h1>

            <button
                type="button"
                onClick={handleVoiceInput}
                className={`btn btn-lg w-full mb-6 ${isListening ? 'btn-danger' : 'btn-secondary'}`}
            >
                <Mic size={18} aria-hidden="true" />
                {isListening ? 'Listening...' : 'Speak your trip'}
            </button>
            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-6 italic">
                Try saying: "Dubai to London on 25th Dec 2025"
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">Origin</label>
                    <select
                        name="origin"
                        className="field"
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
                    <label className="label">Destination</label>
                    <select
                        name="destination"
                        className="field"
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
                    <label className="label">Travel Start Date</label>
                    <input type="date" name="start_date" className="field" value={formData.start_date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">Travel End Date (Arrival)</label>
                    <input type="date" name="end_date" className="field" value={formData.end_date} onChange={handleChange} required />
                </div>
                <div>
                    <label className="label">Available Baggage (kg)</label>
                    <input type="number" step="0.1" min="0" name="available_baggage_kg" placeholder="e.g. 5.0" className="field" value={formData.available_baggage_kg} onChange={handleChange} required />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Shipments heavier than this won't be shown to you as matches.</p>
                </div>
                <div className="flex justify-end space-x-4">
                    <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary btn-lg">Cancel</button>
                    <button type="submit" className="btn btn-primary btn-lg">Add plan</button>
                </div>
            </form>
        </div>
    );
};

export default CreateTravelPlan;
