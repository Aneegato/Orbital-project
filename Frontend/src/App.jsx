import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/signup'; // Adjust the path as necessary
import Login from './components/login'; // Adjust the path as necessary
import Home from './components/Home'; // Adjust the path as necessary
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; // Adjust the path as necessary

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleLogin = (name) => {
    console.log("Logging in as: ", name); // Debugging log
    setIsLoggedIn(true);
    setUserName(name);
  };

  const handleLogout = () => {
    console.log("Logging out"); // Debugging log
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} userName={userName} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Signup onSignup={handleLogin} />} />
        <Route path='/login' element={<Login onLogin={handleLogin} />} />
        <Route path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
