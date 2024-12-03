import express from 'express';
import { upload } from '../middlewares/multer.js';
import {
    addProduct,
    getAllProducts,
    updateStatus,
    editProduct,
    getProductById
} from '../controllers/adminProductController.js';

const productRouter = express.Router();

productRouter.post("/add-product",upload.array("images",5),addProduct);
productRouter.get("/all-products",getAllProducts)
productRouter.patch("/update-status/:id",updateStatus)
productRouter.get('/edit-product/:id',getProductById)
productRouter.put('/edit-product/:id',editProduct)
export default productRouter;