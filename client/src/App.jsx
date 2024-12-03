import React from "react";
import { BrowserRouter, Routes, Route,Navigate } from "react-router-dom";
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
import ListUsersPage from "./pages/admin/ListUsersPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import AddNewCategory from "./pages/admin/AddNewCategory";
import UserProductPage from "./pages/user/UserProductPage";
import EditProductPage from "./pages/admin/EditProductPage";
import ShopPage from "./pages/user/ShopPage";
import { UserProtectRoute } from "./utils/UserProtectRoute";
import UserProfilePage from "./pages/user/UserProfilePage";
import { UserExistRoute } from "./utils/UserExistRoute";

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
        <Route element={<UserProtectRoute />}>
        <Route path="login" element={<GoogleAuthSignWrapper />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="forgot-password" element={<ForgotPassPage/>}/>
        <Route path="forgotOtp-verification" element={<ForgotPassOtpPage/>}/>
        </Route>

        <Route path="sign-up" element={<GoogleAuthRegWrapper />} />
        <Route path="verify-otp" element={<OtpPage />} />
        <Route path="admin/sign-in" element={<AdminLogin />} />
        
        //user Routes
        <Route element={<UserExistRoute/>}>
        <Route path="profile" element={<UserProfilePage/>}/>
        </Route>
        <Route path="home" element={<HomePage />} />
        <Route path="product/:productId" element={<UserProductPage/>}/>

        <Route path="shop" element={<ShopPage/>}/>
        //admin Routes
        <Route element={<AdminProtectedRoute allowedRoute={"admin"}/>}>
        <Route path="admin/login" element={<AdminLogin />} />

        <Route path="admin/dashboard" element={<AdminDashboardPage />} />

        <Route path="admin/products" element={<ProductPage/>}/>
        <Route path="admin/products/add-product" element={<AddNewProduct/>}/>
        <Route path="admin/products/edit-product/:id" element={<EditProductPage/>}/>

        <Route path="admin/users" element={<ListUsersPage/>}/>

        <Route path="admin/categories" element={<CategoriesPage/>}/>
        <Route path="admin/categories/add-category" element={<AddNewCategory/>}/>
        
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
