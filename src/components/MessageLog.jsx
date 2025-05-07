import React, { useEffect, useRef } from 'react';
import './MessageLog.css';

const MessageLog = ({ messages }) => {
    const messagesEndRef = useRef(null);

    // Auto-scroll to the bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="message-log">
            <h3>Messages</h3>
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <p key={index}>{msg}</p>
                ))}
                <div ref={messagesEndRef} /> {/* Element to scroll to */}
            </div>
        </div>
    );
};

export default MessageLog;