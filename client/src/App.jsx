import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import SignIn from './pages/SignIn-SignUp/SignIn.jsx';
import SignUp from './pages/SignIn-SignUp/SignUp.jsx';
import Profile from './pages/Profile.jsx';
import LocationAccess from './components/LocationAccess.jsx';
import ParkingCard from './components/ParkingCard.jsx';
import Manager from './pages/Manager/Manager.jsx';

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
        <Route path='/manager' element={<Manager />} />
        {/* temporary route to show the card */}
        <Route path='/pcard' element={<ParkingCard />} />
      </Routes>
    </BrowserRouter>
  );
}
