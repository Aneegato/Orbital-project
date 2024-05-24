import React from 'react';
import './App.css';
import Component from './Component/MyComponent';
import Image1 from './Images/Image1.png';

function App() {
  return (
    <div className="App">
      <h1>
        <span style={{ color: 'red' }}>Time</span>
        <span style={{ color: 'Blue' }}>NUS</span>
        </h1>
        <img src={Image1} alt="Image 1" />
      <Component />
    </div>
  );
}

export default App;
