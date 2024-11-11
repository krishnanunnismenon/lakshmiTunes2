import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserSignup from './pages/auth/UserSignup';
import OtpPage from './pages/auth/OtpPage';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/sign-up' element={<UserSignup/>}/>
        <Route path='/verify-otp' element={<OtpPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
