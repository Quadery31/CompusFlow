import { useState } from 'react';

function FilterBar({ activeFilter, onFilterChange }) {
    const filters = ['all', 'lost', 'found'];

    return (
        <div className="filter-bar">
            {filters.map((f) => (
                <button
                    key={f}
                    className={`filter-btn ${activeFilter === f ? 'active' : ''} ${f !== 'all' ? f : ''}`}
                    onClick={() => onFilterChange(f)}
                >
                    {f === 'all' && '📋 '}
                    {f === 'lost' && '🔍 '}
                    {f === 'found' && '✅ '}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default FilterBar;
