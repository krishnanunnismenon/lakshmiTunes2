import express from 'express';
import { addToCart, getAllUserProducts, getCart, removeItemCart,getIndividualProduct, getNewProducts, updateFullCart, updateItemCart } from '../controllers/productController.js';
import { verifyToken } from '../middlewares/jwtVerify.js';

const productRouter = express.Router();

productRouter.get('/new',getNewProducts)
productRouter.get('/all-products',getAllUserProducts)
productRouter.get('/individual/:id',getIndividualProduct)


export default productRouter;