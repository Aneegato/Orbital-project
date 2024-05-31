import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './components/signup'; // Adjust the path as necessary
import Login from './components/login'; // Adjust the path as necessary
import Home from './components/Home'; // Adjust the path as necessary
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-red-500"> Hello world!</h1>
      <Navbar/>
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
