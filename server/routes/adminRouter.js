import express from 'express';
import productRouter from './productRouter.js'
import { verifyRole, verifyToken } from '../middlewares/jwtVerify.js';
const adminRouter = express.Router();

adminRouter.use('/products',verifyToken,verifyRole(['admin']),productRouter)

export default adminRouter;