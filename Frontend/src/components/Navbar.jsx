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
        <h2>timeNUS</h2>
      </div>
      <div className="navbar-actions">
        <BiUserCircle className="h-10 w-10 cursor-pointer" />
        <button onClick={handleSignupClick} className="signup-button">
          Signup
        </button>
      </div>
    </div>
  );
}

export default Navbar;
