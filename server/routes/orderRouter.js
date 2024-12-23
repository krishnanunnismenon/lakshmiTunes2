import express from 'express';
import { verifyToken } from '../middlewares/jwtVerify.js';
import { getIndividualUserOrder, getUserOrder } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.get('/',verifyToken,getUserOrder)
orderRouter.get('/:orderId',verifyToken,getIndividualUserOrder)
orderRouter.post('/:orderId/cancel')

export default orderRouter;