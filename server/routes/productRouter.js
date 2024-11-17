import express from 'express';
import { upload } from '../middlewares/multer.js';
import {
    addProduct
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/add-products",upload.array("images",5),addProduct);

export default productRouter;