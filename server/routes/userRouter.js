import express from 'express'
import { userHome,userProfile,updateProfile,sendOTP } from '../controllers/userController.js'
import productRouter from './productRouter.js'
import { verifyToken } from '../middlewares/jwtVerify.js'


const userRouter = express.Router()

userRouter.get('/profileDetails',verifyToken,userProfile)
userRouter.get('/home',userHome)
userRouter.put('/update-profile',verifyToken,updateProfile);
userRouter.post('/send-otp',sendOTP);
userRouter.use('/products',productRouter)

export default userRouter