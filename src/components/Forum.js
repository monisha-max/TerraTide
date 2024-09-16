import React, { useState } from 'react';

const Forum = () => {
    const [threads, setThreads] = useState([
        {
            id: 1,
            title: 'How to improve crop yield during a drought?',
            author: 'JohnDoe',
            comments: [
                { author: 'JaneDoe', text: 'Try using drought-resistant crops.' },
                { author: 'FarmerJoe', text: 'Mulching helps retain soil moisture.' }
            ],
            newComment: ''
        }
    ]);

    const [newThread, setNewThread] = useState({ title: '', author: '', comments: [], newComment: '' });

    const handleNewThreadChange = (e) => {
        setNewThread({ ...newThread, [e.target.name]: e.target.value });
    };

    const handlePostThread = () => {
        if (newThread.title && newThread.author) {
            setThreads([...threads, { ...newThread, id: threads.length + 1 }]);
            setNewThread({ title: '', author: '', comments: [], newComment: '' });
        }
    };

    const handleCommentChange = (e, threadId) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === threadId) {
                thread.newComment = e.target.value;
            }
            return thread;
        });
        setThreads(updatedThreads);
    };

    const handlePostComment = (threadId) => {
        const updatedThreads = threads.map(thread => {
            if (thread.id === threadId) {
                if (thread.newComment.trim()) {
                    thread.comments.push({ author: 'Anonymous', text: thread.newComment });
                    thread.newComment = '';
                }
            }
            return thread;
        });
        setThreads(updatedThreads);
    };

    return (
        <div className="community-container">
            <div className="forum-section">
                <h2>Community Forum</h2>
                <div className="new-thread">
                    <h3>Start a New Discussion</h3>
                    <input
                        type="text"
                        name="title"
                        placeholder="Thread title"
                        value={newThread.title}
                        onChange={handleNewThreadChange}
                        required
                    />
                    <input
                        type="text"
                        name="author"
                        placeholder="Your name"
                        value={newThread.author}
                        onChange={handleNewThreadChange}
                        required
                    />
                    <button onClick={handlePostThread}>Post Thread</button>
                </div>
    
                <div className="threads-list">
                    {threads.map(thread => (
                        <div key={thread.id} className="thread">
                            <h3>{thread.title}</h3>
                            <p><strong>Author:</strong> {thread.author}</p>
                            <div className="comments">
                                {thread.comments.map((comment, index) => (
                                    <div key={index} className="comment">
                                        <p><strong>{comment.author}:</strong> {comment.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="new-comment">
                                <input
                                    type="text"
                                    placeholder="Add a comment"
                                    value={thread.newComment}
                                    onChange={(e) => handleCommentChange(e, thread.id)}
                                />
                                <button onClick={() => handlePostComment(thread.id)}>Post Comment</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    
};

export default Forum;
