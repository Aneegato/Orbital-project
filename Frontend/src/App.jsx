import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/signup'; // Adjust the path as necessary
import Login from './components/login'; // Adjust the path as necessary
import Home from './components/Home'; // Adjust the path as necessary

function App() {
  return (
    <div>
      <header>Welcome to timeNUS</header>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/home' element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
