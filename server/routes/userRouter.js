import express from 'express'
import { userHome,userProfile,updateProfile,sendOTP,getUserAddress,addNewUserAddress,updateAddressPrimaryStatus,editAddress, deleteAddress, changePassword } from '../controllers/userController.js'
import productRouter from './productRouter.js'
import { verifyToken } from '../middlewares/jwtVerify.js'
import cartRouter from './cartRouter.js'
import orderRouter from './orderRouter.js'


const userRouter = express.Router()

userRouter.get('/profileDetails',verifyToken,userProfile)
userRouter.get('/home',userHome)
userRouter.put('/update-profile',verifyToken,updateProfile);
userRouter.post('/send-otp',sendOTP);

userRouter.put('/change-password',verifyToken,changePassword)

userRouter.get('/addresses',verifyToken,getUserAddress)
userRouter.post('/addresses',verifyToken,addNewUserAddress)
userRouter.put('/addresses/:id',verifyToken,editAddress)
userRouter.delete('/addresses/:id',verifyToken,deleteAddress)
userRouter.put('/addresses/:id/primary',verifyToken,updateAddressPrimaryStatus)

userRouter.use('/products',productRouter);
userRouter.use('/cart',cartRouter);
userRouter.use('/orders',orderRouter);

export default userRouter