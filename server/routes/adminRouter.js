import express from 'express';
import productRouter from './productRouter.js'
import { verifyRole, verifyToken } from '../middlewares/jwtVerify.js';
const adminRouter = express.Router();

//adminRoute

// verifyToken,verifyRole(['admin']),


//subRoute

adminRouter.use('/products',productRouter)

export default adminRouter;