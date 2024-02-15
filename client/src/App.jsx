import React from 'react';
import Home from './pages/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ManagerSignIn from './pages/manager/ManagerSignIn.jsx';

export default function App() {
  return <BrowserRouter>
  <Routes>
    <Route path = "/" element = {<Home />} />
    <Route path="/manager/sign-in" element={<ManagerSignIn />} />
  </Routes>
  </BrowserRouter>
}
