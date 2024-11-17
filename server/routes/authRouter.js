import express from 'express';
import { googleLogin, refreshToken, resendOTP, signIn, signup, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup',signup)
authRouter.post('/verify-otp',verifyOTP)
authRouter.post('/resend-otp',resendOTP)
authRouter.post('/signin',signIn)
authRouter.post('/googleLogin',googleLogin)
authRouter.get('/refresh-token', refreshToken)

export default authRouter;