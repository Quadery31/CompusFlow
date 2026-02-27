function CommentCard({ comment }) {
    const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="answer-card">
            <p className="answer-text">{comment.text}</p>
            <div className="answer-footer">
                <span className="card-date">{formattedDate}</span>
            </div>
        </div>
    );
}

export default CommentCard;
