import React, { useState, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Chat.css'

function Chat({ token, username, selectedUser }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  const socket = useMemo(() => io("https://chat-system-vb2d.onrender.com/"), []);

  useEffect(() => {

    socket.on('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    axios.get(`https://chat-system-vb2d.onrender.com/api/messages/${username}/${selectedUser}`, {
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
      socket.disconnect();
    };
  },);

  const handleSendMessage = () => {
    if (selectedUser && message.trim() !== '') {
      const messageData = {
        sender: username,
        receiver: selectedUser,
        message,
      };

      axios.post('https://chat-system-vb2d.onrender.com/api/messages', messageData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        socket.emit('message', messageData);
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
      });
    }
  };

  return (
    <div className="chat-container-2">
    <header>
      <h2>Chat with {selectedUser}</h2>
    </header>
    <div className="messages-container">
      {messages.map((msg, index) => (
        <div key={index} className={msg.sender === username ? 'sent-message' : 'received-message'}>
          <span className="message-sender">{msg.sender}</span>: {msg.message}
        </div>
      ))}
    </div>
    <div className="input-container">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={handleSendMessage} disabled={!selectedUser || !message}>
        Send
      </button>
    </div>
  </div>
  );
}

export default Chat;