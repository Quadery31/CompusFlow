function EventFilterBar({ activeFilter, onFilterChange }) {
    const filters = ['all', 'upcoming', 'past'];

    return (
        <div className="filter-bar">
            {filters.map((f) => (
                <button
                    key={f}
                    className={`filter-btn ${activeFilter === f ? 'active' : ''} ${f === 'upcoming' ? 'lost' : ''} ${f === 'past' ? 'found' : ''}`}
                    onClick={() => onFilterChange(f)}
                >
                    {f === 'all' && '📋 '}
                    {f === 'upcoming' && '🔜 '}
                    {f === 'past' && '✅ '}
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
            ))}
        </div>
    );
}

export default EventFilterBar;
