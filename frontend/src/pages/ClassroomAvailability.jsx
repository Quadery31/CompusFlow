import React, { useState } from 'react';
import AvailabilityForm from '../components/AvailabilityForm';
import ClassroomCard from '../components/ClassroomCard';
import API from '../api';
import './ClassroomAvailability.css';

const ClassroomAvailability = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const fetchAvailability = async (filters) => {
        setLoading(true);
        setError('');
        setHasSearched(true);

        try {
            const response = await API.get('/classrooms/available', {
                params: {
                    day: filters.day,
                    startTime: filters.startTime,
                    endTime: filters.endTime,
                },
            });

            if (response.data && response.data.success) {
                setClassrooms(response.data.data || []);
            } else {
                setError('Failed to fetch available classrooms. Please try again.');
            }
        } catch (err) {
            console.error('Error fetching classrooms:', err);
            // Fallback robust error message
            setError('Unable to fetch availability. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="classrooms-page app">
            <div className="classrooms-header">
                <div className="classrooms-title-wrapper">
                    <svg className="classrooms-title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <h1 className="page-header h1">Classroom Availability</h1>
                </div>
                <p>Find completely empty classrooms for your study sessions.</p>
            </div>

            <AvailabilityForm onSubmit={fetchAvailability} loading={loading} />

            <div className="results-container">
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Checking availability...</p>
                    </div>
                )}

                {error && !loading && (
                    <div className="error-banner">
                        {error}
                    </div>
                )}

                {!loading && !error && hasSearched && classrooms.length === 0 && (
                    <div className="empty-state">
                        <span className="empty-icon">🏫</span>
                        <h3>No classrooms available</h3>
                        <p>No empty classrooms found for the selected time slot.</p>
                    </div>
                )}

                {!loading && !error && classrooms.length > 0 && (
                    <div>
                        <div className="results-header">
                            <h2 className="results-title">
                                Matching Classrooms
                            </h2>
                            <span className="results-count-badge">
                                {classrooms.length} Available
                            </span>
                        </div>
                        <div className="classrooms-grid">
                            {classrooms.map((room) => (
                                <ClassroomCard key={room._id || room.roomNumber} room={room} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClassroomAvailability;
