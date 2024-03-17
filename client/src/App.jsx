import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home';
import About from './pages/About.jsx';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile.jsx';
import LocationAccess from './components/LocationAccess.jsx';
import ParkingCard from './components/ParkingCard.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/profile' element={<Profile />} />
        {/* temporary route to show the card */}
        <Route path='/pcard' element={<ParkingCard />} />
      </Routes>
    </BrowserRouter>
  );
}
