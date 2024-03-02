// src/Chat.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

function Chat({ token, username, selectedUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
      socketRef.current = io('http://localhost:8080');

    socketRef.current.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    axios.get(`http://localhost:8080/api/messages/${username}/${selectedUser}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      setMessages(response.data);
    })
    .catch((error) => {
      console.error('Error fetching messages:', error.response ? error.response.data : error.message);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, );

  const handleSendMessage = () => {
    if (selectedUser && message.trim() !== '') {
      const messageData = {
        sender: username,
        receiver: selectedUser,
        message,
      };

      axios.post('http://localhost:8080/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        socketRef.current.emit('message', messageData);
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
      });
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser}</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px', height: '300px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index}>{`${msg.sender}: ${msg.message}`}</div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} disabled={!selectedUser || !message}>
          Send Message
        </button>
      </div>
    </div>
  );
}

export default Chat;
