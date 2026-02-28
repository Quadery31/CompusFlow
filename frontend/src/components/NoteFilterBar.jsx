const SUBJECTS = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Biology',
    'English',
    'Economics',
    'Other',
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

function NoteFilterBar({
    selectedSubject,
    onSubjectChange,
    selectedSemester,
    onSemesterChange,
    selectedSort,
    onSortChange,
}) {
    return (
        <div className="doubt-filter-bar">
            <div className="filter-group">
                <label htmlFor="note-subject">Subject</label>
                <select
                    id="note-subject"
                    value={selectedSubject}
                    onChange={(e) => onSubjectChange(e.target.value)}
                >
                    <option value="">All Subjects</option>
                    {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="note-semester">Semester</label>
                <select
                    id="note-semester"
                    value={selectedSemester}
                    onChange={(e) => onSemesterChange(e.target.value)}
                >
                    <option value="">All Semesters</option>
                    {SEMESTERS.map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                </select>
            </div>

            <div className="filter-group">
                <label htmlFor="note-sort">Sort By</label>
                <select
                    id="note-sort"
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

export default NoteFilterBar;
