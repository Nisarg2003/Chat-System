import React, { useState, useEffect, useRef, useMemo } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

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
    <div className="chat-container-2 h-full flex flex-col">
      <header className="bg-gray-800 text-white py-4 px-6">
        <h2 className="text-lg">Chat with {selectedUser}</h2>
      </header>
      <div className="messages-container flex-1 overflow-auto bg-gray-100">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 ${msg.sender === username ? 'bg-blue-200 rounded-br-none' : 'bg-gray-200 rounded-bl-none'}`}>
            <span className={`font-bold ${msg.sender === username ? 'text-right' : 'text-left'}`}>{msg.sender}</span>: {msg.message}
          </div>
        ))}
      </div>
      <div className="input-container bg-gray-100 p-4 flex items-center">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-l p-2 focus:outline-none"
        />
        <button onClick={handleSendMessage} disabled={!selectedUser || !message} className="bg-blue-500 text-white px-4 py-2 rounded-r focus:outline-none ml-2">
          Send
        </button>
      </div>
    </div>

  );
}

export default Chat;