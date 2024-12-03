import express from 'express'
import authRouter from './authRouter.js'
import userRouter from './userRouter.js'
import adminRouter from './adminRouter.js'

const router = express.Router();

router.use('/auth',authRouter);
router.use('/admin',adminRouter);
router.use('/user',userRouter);

export default router;