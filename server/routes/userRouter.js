import express from 'express'
import { userHome } from '../controllers/userController.js'


const userRouter = express.Router()

userRouter.use('/home',userHome)

export default userRouter