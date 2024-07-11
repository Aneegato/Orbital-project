import React, { useEffect, useState } from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import axios from 'axios';

function Navbar({ isLoggedIn, handleLogout, userName }) {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState([]);

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        const response = await axios.get('http://localhost:5001/calendars');
        setCalendars(response.data);
      } catch (error) {
        console.error('Error fetching calendars:', error);
      }
    };

    if (isLoggedIn) {
      fetchCalendars();
    }
  }, [isLoggedIn]);

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

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <div className="navbar">
      <div className="navbar-brand" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <h2>
          <span className="text-blue">time</span>
          <span className="text-orange">NUS</span>
        </h2>
      </div>
      <div className="navbar-actions">
        {isLoggedIn ? (
          <>
            <span className="welcome-message">Welcome, {userName}!</span>
            <div className="dropdown">
              <button className="btn btn-info dropdown-toggle" type="button" id="calendarsDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                Calendars
              </button>
              <ul className="dropdown-menu" aria-labelledby="calendarsDropdown">
                {calendars.map(calendar => (
                  <li key={calendar._id}>
                    <button className="dropdown-item" onClick={() => navigate(`/calendars/${calendar._id}`)}>
                      {calendar.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleManageCalendarsClick} className="btn btn-info" style={{ marginLeft: '10px' }}>
              Manage Calendars
            </button>
            <button onClick={handleLogoutClick} className="btn btn-danger" style={{ marginLeft: '10px' }}>
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

