import express from 'express';
import { upload } from '../middlewares/multer.js';
import {
    addProduct,
    getAllProducts,
    updateStatus
} from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post("/add-product",upload.array("images",5),addProduct);
productRouter.get("/all-products",getAllProducts)
productRouter.patch("/update-status/:id",updateStatus)
export default productRouter;