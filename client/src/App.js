// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import Chat from './chat';


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [otherUsers, setOtherUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  
  
  
  useEffect(() => {
   
    if (token) {
      axios.get('http://localhost:8080/api/other-users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => setOtherUsers(response.data))
      .catch(error => console.error('Error fetching other users:', error));
    }

  }, [token, username, selectedUser]);

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/login', {
        username,
        password,
      });
      
      const { token } = response.data;
      setToken(token);
    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/api/register', {
        username,
        password,
      });
      
      handleLogin();
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
    }
  };
  




  return (
    <div>
      <h1>Chat App</h1>
      {token ? (
         <>
         <h2>Welcome, {username}!</h2>
         <div>
           <h3>Other Users</h3>
           <ul>
             {otherUsers.map((user) => (
               <li key={user} onClick={() => setSelectedUser(user)}>
                 {user}
               </li>
             ))}
           </ul>
         </div>
         {selectedUser && (
           <Chat token={token} username={username} selectedUser={selectedUser} />
         )}
       </>
      ) : (
        <>
          <h2>Login or Register</h2>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </>
      )}
    </div>
  );
}

export default App;
