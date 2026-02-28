import React, { useState } from 'react';

const AvailabilityForm = ({ onSubmit, loading }) => {
    const [day, setDay] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!day) {
            setError('Please select a day.');
            return;
        }
        if (!startTime) {
            setError('Please select a start time.');
            return;
        }
        if (!endTime) {
            setError('Please select an end time.');
            return;
        }
        if (startTime >= endTime) {
            setError('Start time must be before end time.');
            return;
        }

        onSubmit({ day, startTime, endTime });
    };

    return (
        <div className="availability-form-container">
            <form onSubmit={handleSubmit} className="availability-form">
                <div className="form-group-date">
                    <label>Day</label>
                    <select
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                        disabled={loading}
                    >
                        <option value="">Select a day</option>
                        {days.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group-date">
                    <label>Start Time</label>
                    <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="form-group-date">
                    <label>End Time</label>
                    <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <div className="form-group-button">
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? 'Checking...' : 'Check Availability'}
                    </button>
                </div>
            </form>
            {error && <p className="form-error-inline">{error}</p>}
        </div>
    );
};

export default AvailabilityForm;
