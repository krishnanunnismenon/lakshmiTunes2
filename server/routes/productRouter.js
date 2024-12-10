import express from 'express';
import { addToCart, getAllUserProducts, getCart, getIndividualProduct, getNewProducts } from '../controllers/productController.js';
import { verifyToken } from '../middlewares/jwtVerify.js';

const productRouter = express.Router();

productRouter.get('/new',getNewProducts)
productRouter.get('/all-products',getAllUserProducts)
productRouter.get('/individual/:id',getIndividualProduct)
productRouter.get('/cart',verifyToken,getCart)
productRouter.post('/cart/add',verifyToken,addToCart)

export default productRouter;