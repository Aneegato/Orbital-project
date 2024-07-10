import React, { useState, useEffect } from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';

function Navbar({ isLoggedIn, handleLogout, userName, userId }) {
  const navigate = useNavigate();
  const [sharedCalendars, setSharedCalendars] = useState([]);
  const [selectedSharedCalendar, setSelectedSharedCalendar] = useState('');

  useEffect(() => {
    if (isLoggedIn && userId) {
      fetchSharedCalendars();
    }
  }, [isLoggedIn, userId]);

  const fetchSharedCalendars = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/calendars/user-calendars/${userId}`);
      const shared = response.data.filter(calendar => calendar.owner._id !== userId);
      setSharedCalendars(shared);
      if (shared.length > 0) {
        setSelectedSharedCalendar(shared[0]._id); // Set the first shared calendar as default
      }
    } catch (error) {
      console.error('Error fetching shared calendars:', error);
    }
  };

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the logout handler
    navigate('/'); // Navigate to the landing page
  };

  const handleManageCalendarsClick = () => {
    navigate('/manage-calendars');
  };

  const handleSharedCalendarChange = (event) => {
    setSelectedSharedCalendar(event.target.value);
    navigate(`/calendar/${event.target.value}`); // Navigate to the selected shared calendar
  };

  return (
    <div className="navbar">
      <div className="navbar-brand">
        <h2>
          <span className="text-blue">time</span>
          <span className="text-orange">NUS</span>
        </h2>
      </div>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <span className="welcome-message">Welcome, {userName}!</span>
            {sharedCalendars.length > 0 && (
              <select 
                value={selectedSharedCalendar} 
                onChange={handleSharedCalendarChange} 
                className="calendar-selector"
                style={{ marginRight: '10px' }}
              >
                {sharedCalendars.map(calendar => (
                  <option key={calendar._id} value={calendar._id}>
                    {calendar.name}
                  </option>
                ))}
              </select>
            )}
            <button onClick={handleManageCalendarsClick} className="btn btn-info" style={{ marginRight: '10px' }}>
              Manage Calendars
            </button>
            <button onClick={handleLogoutClick} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={handleLoginClick} className="btn btn-primary" style={{ marginRight: '10px' }}>
              Login
            </button>
            <button onClick={handleSignupClick} className="btn btn-success">
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
