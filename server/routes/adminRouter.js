import express from 'express';
import productRouter from './adminProductRouter.js'
import { verifyRole, verifyToken } from '../middlewares/jwtVerify.js';
import { blockUser, userList } from '../controllers/userListController.js';
import { addCategory, deleteCategory, editCategory, listCategories, toggleListing } from '../controllers/categoriesController.js';

const adminRouter = express.Router();

//adminRoute




//subRoute

adminRouter.use('/products',verifyToken,verifyRole(['admin']),productRouter)
adminRouter.get('/users',userList)
adminRouter.post('/users/:userId/block',blockUser)

adminRouter.get('/categories',listCategories)
adminRouter.post('/categories/add-category',addCategory)
adminRouter.post('/categories/:categoryId/toggle-listing',toggleListing)
adminRouter.put('/categories/:categoryId',editCategory)
adminRouter.delete('/categories/:categoryId',deleteCategory)

export default adminRouter;