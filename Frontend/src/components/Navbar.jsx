import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import axios from '../axiosConfig';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function Navbar({ isLoggedIn, handleLogout, userName, propUserId }) {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = propUserId || location.state?.userId;

  const [userCalendars, setUserCalendars] = useState([]);

  useEffect(() => {
    const fetchUserCalendars = async () => {
      try {
        if (!userId) {
          throw new Error('userId is not defined');
        }
        const response = await axios.get('/calendars/user-calendars/${userId}');
        setUserCalendars(response.data);
      } catch (error) {
        console.error('Error fetching user calendars:', error);
        setUserCalendars([]);
      }
    };

    if (isLoggedIn && userId) {
      fetchUserCalendars();
    }
  }, [isLoggedIn, userId]);

  const handleSignupClick = () => {
    navigate('/register');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate('/');
  };

  const handleNewCalendarsClick = () => {
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
                {userCalendars.map(calendar => (
                  <li key={calendar._id}>
                    <button className="dropdown-item" onClick={() => navigate('/calendars/${calendar._id}')}>
                      {calendar.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={handleNewCalendarsClick} className="btn btn-info" style={{ marginLeft: '10px' }}>
              Create New Calendar
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