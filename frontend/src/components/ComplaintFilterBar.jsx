function ComplaintFilterBar({ selectedCategory, onCategoryChange, selectedSort, onSortChange }) {
    const categories = ['Mess', 'Hostel', 'Academics', 'Infrastructure', 'Other'];

    return (
        <div className="doubt-filter-bar">
            <div className="filter-group">
                <label htmlFor="complaint-category">Category</label>
                <select
                    id="complaint-category"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="complaint-sort">Sort By</label>
                <select
                    id="complaint-sort"
                    value={selectedSort}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="latest">Latest</option>
                    <option value="upvotes">Most Upvoted</option>
                </select>
            </div>
        </div>
    );
}

export default ComplaintFilterBar;
