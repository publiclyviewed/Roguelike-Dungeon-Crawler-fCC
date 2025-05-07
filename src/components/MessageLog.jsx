import React from 'react';
import './MessageLog.css';

function MessageLog({ messages }) {
  return (
    <div className="message-log">
      <h2>Message Log</h2>
      <div className="log-box">
        {messages.slice(-10).map((msg, i) => (
          <div key={i} className="message">{msg}</div>
        ))}
      </div>
    </div>
  );
}

export default MessageLog;
