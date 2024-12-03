import express from 'express';
import { getAllUserProducts, getIndividualProduct, getNewProducts } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.get('/new',getNewProducts)
productRouter.get('/all-products',getAllUserProducts)
productRouter.get('/:id',getIndividualProduct)

export default productRouter;