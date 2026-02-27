import { useState } from 'react';

function AnswerCard({ answer, onUpvote }) {
    const [upvoting, setUpvoting] = useState(false);

    const handleUpvote = async (e) => {
        e.stopPropagation();
        setUpvoting(true);
        try {
            await onUpvote(answer._id);
        } finally {
            setTimeout(() => setUpvoting(false), 600);
        }
    };

    const formattedDate = new Date(answer.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="answer-card">
            <p className="answer-text">{answer.text}</p>
            <div className="answer-footer">
                <button
                    className={`upvote-btn ${upvoting ? 'upvoting' : ''}`}
                    onClick={handleUpvote}
                    disabled={upvoting}
                >
                    👍 {answer.upvotes}
                </button>
                <span className="card-date">{formattedDate}</span>
            </div>
        </div>
    );
}

export default AnswerCard;
