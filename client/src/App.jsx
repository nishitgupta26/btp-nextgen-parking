import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home/Home.jsx';
import About from './pages/About/About.jsx';
import SignIn from './pages/SignIn-SignUp/SignIn.jsx';
import ParkingCard from './components/ParkingCard.jsx';
import ManagerProfile from './pages/Profile/ManagerProfile.jsx';
import OwnerProfile from './pages/Profile/OwnerProfile.jsx';
import UserProfile from './pages/Profile/UserProfile.jsx';
import AdminProfile from './pages/Profile/AdminProfile.jsx';

export default function App() {
  return (
    <BrowserRouter>
      {/* <Header /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/about' element={<About />} />
        <Route path='/owner-profile' element={<OwnerProfile />} />
        <Route path='/manager-profile' element={<ManagerProfile />} />
        <Route path='/user-profile' element={<UserProfile />} />
        <Route path='/admin-profile' element={<AdminProfile />} />
        {/* temporary route to show the card */}
        <Route path='/pcard' element={<ParkingCard />} />
      </Routes>
    </BrowserRouter>
  );
}
