import express from 'express';
import productRouter from './adminProductRouter.js'
import { verifyRole, verifyToken } from '../middlewares/jwtVerify.js';
import { blockUser, userList } from '../controllers/userListController.js';
import { addCategory, deleteCategory, editCategory, listCategories, toggleListing } from '../controllers/categoriesController.js';
import adminOrderRouter from './admin/adminOrderRouter.js';
import adminOfferRouter from './admin/adminOfferRouter.js';

const adminRouter = express.Router();

//adminRoute




//subRoute

adminRouter.get('/users',userList)
adminRouter.post('/users/:userId/block',blockUser)

adminRouter.get('/categories',listCategories)
adminRouter.post('/categories/add-category',addCategory)
adminRouter.post('/categories/:categoryId/toggle-listing',toggleListing)
adminRouter.put('/categories/:categoryId',editCategory)
adminRouter.delete('/categories/:categoryId',deleteCategory)
adminRouter.use('/products',verifyToken,verifyRole(['admin']),productRouter)
adminRouter.use('/orders',verifyToken,verifyRole(['admin']),adminOrderRouter)
adminRouter.use('/offers',verifyToken,verifyRole(['admin']),adminOfferRouter)

export default adminRouter;