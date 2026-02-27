function DoubtFilterBar({ selectedSubject, onSubjectChange, selectedSort, onSortChange }) {
    const subjects = ['DSA', 'DBMS', 'OS', 'CN', 'OOPs', 'Web Dev', 'ML', 'Math', 'Other'];

    return (
        <div className="doubt-filter-bar">
            <div className="filter-group">
                <label htmlFor="subject-filter">Subject</label>
                <select
                    id="subject-filter"
                    value={selectedSubject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="sort-filter">Sort By</label>
                <select
                    id="sort-filter"
                    value={selectedSort}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    <option value="latest">Latest</option>
                    <option value="answers">Most Answers</option>
                    <option value="upvotes">Most Upvotes</option>
                </select>
            </div>
        </div>
    );
}

export default DoubtFilterBar;
