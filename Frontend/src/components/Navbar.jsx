import React from 'react';
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleSignupClick = () => {
    navigate('/register');
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
        <BiUserCircle size={40} className="cursor-pointer" />
        <button onClick={handleSignupClick} className="signup-button">
          Register
        </button>
      </div>
    </div>
  );
}

export default Navbar;
