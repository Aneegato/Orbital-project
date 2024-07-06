import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ isLoggedIn, handleLogout, userName }) {
  const navigate = useNavigate();

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
