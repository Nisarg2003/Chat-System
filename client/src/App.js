// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chat from './chat';
import './App.css'


function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [otherUsers, setOtherUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
   
  
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
    if (username.trim() !== '' && password.trim() !== '') {
      try {
        await axios.post('http://localhost:8080/api/register', {
          username,
          password,
        });
        
        handleLogin(); // Automatically login after successful registration
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Please enter both username and password for registration.');
    }
  };
  
  return (
    <div className="app-container">
  <header>
    <h1>Chat App</h1>
  </header>
  <main>
    {token ? (
      <div className="chat-container">
        <section className="user-list">
          <h3>Other Users</h3>
          <ul>
            {otherUsers.map((user) => (
              <li key={user} onClick={() => setSelectedUser(user)}>
                {user}
              </li>
            ))}
          </ul>
        </section>
        {selectedUser && (
          <section className="chat-section">
            <Chat token={token} username={username} selectedUser={selectedUser} />
          </section>
        )}
      </div>
      ) : (
        <section className="auth-section">
          <h2>Login or Register</h2>
          <label>Username:</label>
          <input type="text" value={username} required onChange={(e) => setUsername(e.target.value)} />
          <br />
          <label>Password:</label>
          <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />
          <br />
          <button onClick={handleLogin}>Login</button>
          <button onClick={handleRegister}>Register</button>
        </section>
      )}
    </main>
  </div>
  );
}

export default App;
