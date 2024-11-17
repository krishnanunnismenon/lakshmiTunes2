import React from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserSignup from './pages/auth/UserSignup';
import OtpPage from './pages/auth/OtpPage';
import LoginPage from './pages/auth/LoginPage';
import HomePage from './pages/user/HomePage';
import AdminLogin from './pages/admin/AdminLogin';
import { GoogleOAuthProvider } from '@react-oauth/google';



const App = () => {
  const GoogleAuthWrapper = ()=>{
    return(
      <GoogleOAuthProvider clientId='454637848560-g4tf2ef2rmvg567087t9e0dboc2earpr.apps.googleusercontent.com'>
        <LoginPage></LoginPage>
      </GoogleOAuthProvider>
    )
  }
  return (
    <BrowserRouter>
      <Routes>

        //auth Routes
        <Route path='/sign-up' element={<UserSignup/>}/>
        <Route path='/verify-otp' element={<OtpPage/>}/>
        <Route path='/login' element={<GoogleAuthWrapper/>}/>
        
        <Route path='/admin/sign-in' element={<AdminLogin/>}/>
        //user Routes
        <Route path='/user/home' element={<HomePage/>}/> 
        //admin Routes
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
