// src/components/LandingPage.jsx

import React from 'react';
import landingImage from "../assets/images/landingimage.png";
import './LandingPage.css'; // Ensure CSS file is imported

function LandingPage() {
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
        </div>
      </div>
    );
  }
  
  export default LandingPage;
  