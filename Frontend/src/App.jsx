import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signup';
import Login from './components/login';
import Home from './components/Home';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ManageCalendars from './components/ManageCalendars';
import CalendarPage from './components/CalendarPage';
import EventPage from './components/EventPage';
import ModulesList from './components/ModulesList';
import ModuleDetails from './components/ModulesDetails';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [calendars, setCalendars] = useState([]);

    const handleLogin = (name, id) => {
        console.log("Logging in as: ", name, " ,id:", id); // Debugging log
        setIsLoggedIn(true);
        setUserName(name);
        setUserId(id);
    };

    const handleLogout = () => {
        console.log("Logging out"); // Debugging log
        setIsLoggedIn(false);
        setUserName('');
        setUserId('');
        setCalendars([]);
    };

    const setCalendarsForNavbar = (calendars) => {
        setCalendars(calendars);
    };

    return (
        <BrowserRouter>
            <Navbar
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
                userName={userName}
                calendars={calendars}
            />
            <Routes>
                <Route path='/' element={<LandingPage isLoggedIn={isLoggedIn} />} />
                <Route path='/register' element={<Signup onSignup={handleLogin} />} />
                <Route path='/login' element={<Login onLogin={handleLogin} />} />
                <Route path='/home' element={isLoggedIn ? <Home userId={userId} /> : <Navigate to="/login" />} />
                <Route path='/calendars/:calendarId' element={isLoggedIn ? <CalendarPage userId={userId} /> : <Navigate to="/login" />} />
                <Route path='/manage-calendars' element={isLoggedIn ? <ManageCalendars userId={userId} setCalendarsForNavbar={setCalendarsForNavbar} /> : <Navigate to="/login" />} />
                <Route path='/events/:eventId' element={isLoggedIn ? <EventPage userId={userId} /> : <Navigate to="/login" />} />
                <Route path='/modules' element={<ModulesList />} />
                <Route path='/modules/:moduleCode' element={<ModuleDetails />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;




