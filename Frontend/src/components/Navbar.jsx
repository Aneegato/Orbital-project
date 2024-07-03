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
            <button onClick={handleLogoutClick} className="btn btn-primary rounded-0 logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <BiUserCircle size={40} className="cursor-pointer" onClick={handleLoginClick} />
            <button onClick={handleSignupClick} className="signup-button">
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Navbar;
