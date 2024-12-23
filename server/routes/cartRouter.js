import express from 'express'
import { getCart,addToCart,updateFullCart,updateItemCart,removeItemCart, createOrder, getOrderDetails, placeOrder } from '../controllers/productController.js'
import { verifyToken } from '../middlewares/jwtVerify.js'

const cartRouter = express.Router()


cartRouter.get('/',verifyToken,getCart)
cartRouter.post('/add',verifyToken,addToCart)
cartRouter.put('/update-all',verifyToken,updateFullCart)
cartRouter.put('/update',verifyToken,updateItemCart)
cartRouter.delete('/remove/:productId',verifyToken,removeItemCart)
cartRouter.post('/orders',verifyToken,createOrder)
cartRouter.get('/orders/:orderId',verifyToken,getOrderDetails)
cartRouter.post('/payment',verifyToken,placeOrder);


export default cartRouter