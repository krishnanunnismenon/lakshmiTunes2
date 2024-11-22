import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserSignup from "./pages/auth/UserSignup";
import OtpPage from "./pages/auth/OtpPage";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/user/HomePage";
import AdminLogin from "./pages/admin/AdminLogin";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductPage from "./pages/admin/ProductPage";
import ForgotPassPage from "./pages/auth/ForgotPassPage";
import { AdminProtectedRoute } from "./utils/AdminProtectRoute";
import AddNewProduct from "./pages/admin/AddNewProduct";
import ForgotPassOtpPage from "./pages/auth/ForgotPassOtpPage";

const App = () => {
  const GoogleAuthSignWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="454637848560-g4tf2ef2rmvg567087t9e0dboc2earpr.apps.googleusercontent.com">
        <LoginPage></LoginPage>
      </GoogleOAuthProvider>
    );
  };
  const GoogleAuthRegWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="454637848560-g4tf2ef2rmvg567087t9e0dboc2earpr.apps.googleusercontent.com">
        <UserSignup></UserSignup>
      </GoogleOAuthProvider>
    );
  };
  return (
    <BrowserRouter future={{
      v7_relativeSplatPath: true,
      v7_startTransition: true,
    }}>
      <Routes>
        //auth Routes

        <Route path="sign-up" element={<GoogleAuthRegWrapper />} />
        <Route path="verify-otp" element={<OtpPage />} />
        <Route path="login" element={<GoogleAuthSignWrapper />} />
        <Route path="admin/sign-in" element={<AdminLogin />} />
        <Route path="forgot-password" element={<ForgotPassPage/>}/>
        <Route path="forgotOtp-verification" element={<ForgotPassOtpPage/>}/>
        //user Routes
        <Route path="user/home" element={<HomePage />} />
        //admin Routes
        <Route element={<AdminProtectedRoute allowedRoute={"admin"}/>}>
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="admin/products" element={<ProductPage/>}/>
        <Route path="admin/products/add-product" element={<AddNewProduct/>}/>
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
