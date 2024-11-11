import express from 'express';
import { resendOTP, signup, verifyOTP } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/signup',signup)
authRouter.post('/verify-otp',verifyOTP)
authRouter.post('/resend-otp',resendOTP)

export default authRouter;