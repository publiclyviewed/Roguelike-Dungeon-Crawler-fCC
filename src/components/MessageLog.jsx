// MessageLog.jsx
import React from 'react';

export default function MessageLog({ messages }) {
  return (
    <div className="message-log" style={styles.logContainer}>
      {messages.map((msg, index) => (
        <div key={index} style={styles.messageLine}>
          {msg}
        </div>
      ))}
    </div>
  );
}

const styles = {
  logContainer: {
    backgroundColor: '#111',
    color: '#0f0',
    fontFamily: 'monospace',
    padding: '10px',
    height: '150px',
    overflowY: 'auto',
    border: '2px solid #333',
    borderRadius: '4px',
    marginTop: '1rem',
  },
  messageLine: {
    padding: '2px 0',
    fontSize: '14px',
    lineHeight: '1.2',
  },
};
