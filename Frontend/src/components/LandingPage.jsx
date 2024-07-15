import React from 'react';
import { useNavigate } from 'react-router-dom';
import landingImage from "../assets/images/landingimage.png";
import './LandingPage.css'; // Ensure CSS file is imported

function LandingPage({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleManageCalendarsClick = () => {
    navigate('/manage-calendars');
  };

  return (
    <div className="landing-page">
      <div className="image-container">
        <img src={landingImage} alt="landing" className="cover-image" />
      </div>
      <div className="text-container">
        <h2 className="italic">
          <span className="blue-text">time</span>
          <span className="orange-text">NUS</span>
        </h2>
        <p>an all-in-one scheduler</p>
        {isLoggedIn && (
          <div className="loggedin-actions">
            <button onClick={handleManageCalendarsClick} className="btn btn-info">
              Manage Calendars
            </button>
            {/* Add more buttons here if needed */}
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingPage;

  