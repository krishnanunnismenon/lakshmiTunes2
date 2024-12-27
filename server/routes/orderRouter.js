import express from 'express';
import { verifyToken } from '../middlewares/jwtVerify.js';
import { getIndividualUserOrder, getUserOrder,cancelUserOrder, cancelIndividualUserOrder } from '../controllers/orderController.js';


const orderRouter = express.Router();

orderRouter.get('/',verifyToken,getUserOrder)
orderRouter.get('/:orderId',verifyToken,getIndividualUserOrder)
orderRouter.post('/:orderId/cancel',verifyToken,cancelUserOrder)
orderRouter.post('/:orderId/items/:itemId/cancel',verifyToken,cancelIndividualUserOrder)


export default orderRouter;