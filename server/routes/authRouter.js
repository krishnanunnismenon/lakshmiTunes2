import express from 'express';
import { adminSignIn, googleLogin, refreshToken, resendOTP, signIn, signup, verifyEmail, verifyEmailOTP, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();


//user

authRouter.post('/signup',signup)
authRouter.post('/verify-otp',verifyOTP)
authRouter.post('/resend-otp',resendOTP)
authRouter.post('/signin',signIn)
authRouter.post('/googleLogin',googleLogin)
authRouter.get('/refresh-token', refreshToken)
authRouter.post('/verify-email',verifyEmail)
authRouter.post('/veify-emailOTP',verifyEmailOTP)
authRouter.post('/resend-forgotPass-otp',verifyEmail)

//admin

authRouter.post('/admin/signin',adminSignIn)

export default authRouter;