// App.jsx
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signup'; // Adjust the path as necessary
import Login from './components/login'; // Adjust the path as necessary
import Home from './components/Home'; // Adjust the path as necessary
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage'; // Adjust the path as necessary
import ManageCalendars from './components/ManageCalendars';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');

    const handleLogin = (name, id) => {
        console.log("Logging in as: ", name); // Debugging log
        setIsLoggedIn(true);
        setUserName(name);
        setUserId(id);
    };

    const handleLogout = () => {
        console.log("Logging out"); // Debugging log
        setIsLoggedIn(false);
        setUserName('');
        setUserId('');
    };

    return (
        <BrowserRouter>
            <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} userName={userName} />
            <Routes>
                <Route path='/' element={<LandingPage />} />
                <Route path='/register' element={<Signup onSignup={handleLogin} />} />
                <Route path='/login' element={<Login onLogin={handleLogin} />} />
                <Route path='/home' element={isLoggedIn ? <Home userId={userId} /> : <Navigate to="/login" />} />
                <Route path='/manage-calendars' element={isLoggedIn ? <ManageCalendars userId={userId} /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
