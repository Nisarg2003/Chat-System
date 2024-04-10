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
      axios.get('https://chat-system-vb2d.onrender.com/api/other-users', {
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
      const response = await axios.post('https://chat-system-vb2d.onrender.com/api/login', {
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
        await axios.post('https://chat-system-vb2d.onrender.com/api/register', {
          username,
          password,
        });
        
        handleLogin(); 
      } catch (error) {
        console.error('Registration error:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Please enter both username and password for registration.');
    }
  };
  
  return (
    <div className="app-container">
  

  <main className='h-screen'>
    {token ? (
      <div className='flex flex-col lg:flex-row lg:h-full '>

        <section className="lg:hidden w-full">
          <section className="w-full border-2px rounded-lg shadow-md p-4 h-full relative overflow-hidden ">
  
            <div className="absolute inset-0 bg-center bg-cover rounded-lg" style={{ backgroundImage: "url('https://i.gifer.com/8v6w.gif')" }}></div>

            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>

            <div className="relative z-10">
              <h3 className="bg-gray-400 text-gray-800 font-semibold py-2 px-4 mb-2 rounded-t-lg">All Available Users</h3>
              <ul className="overflow-y-auto">
                {otherUsers.map((user) => (
                  <li key={user} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-gray-400 active:bg-gray-600 py-2 px-4 rounded flex items-center text-white">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        <section className="hidden lg:block w-[25%]">
          <section className="w-full border-2px rounded-lg shadow-md p-4 h-full relative overflow-hidden">
            {/* Background GIF */}
            <div className="absolute inset-0 bg-center bg-cover rounded-lg" style={{ backgroundImage: "url('https://i.gifer.com/8v6w.gif')" }}></div>

            <div className="absolute inset-0 bg-black opacity-50 rounded-lg"></div>

            <div className="relative z-10">
              <h3 className="bg-gray-400 text-gray-800 font-semibold py-2 px-4 mb-2 rounded-t-lg">All Available Users</h3>
              <ul className="overflow-y-auto">
                {otherUsers.map((user) => (
                  <li key={user} onClick={() => setSelectedUser(user)} className="cursor-pointer hover:bg-gray-400 active:bg-gray-600 py-2 px-4 rounded flex items-center text-white">
                    <span className="mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </span>
                    <span>{user}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </section>

        <section className="flex-1 bg-gray-100">
          {selectedUser && <Chat token={token} username={username} selectedUser={selectedUser} />}
        </section>
      </div>
  
      ) : (
        <>
        <header className="flex w-full p-[20px] bg-black border-5 justify-center items-center">
    <h1 className="text-white text-3xl">Chat App</h1>
  </header>
  <div className="flex justify-center items-center h-screen">
    
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
  </div>
      </>
      )}
    </main>
  </div>
  );
}

export default App;
