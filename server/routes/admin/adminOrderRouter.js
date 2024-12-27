import express from 'express'
import {  getGroupedOrders, getIndividualOrderDetail,updateIndividualOrderStatus, updateOrderStatus } from '../../controllers/admin/adminOrderController.js';

const adminOrderRouter = express.Router();

adminOrderRouter.get('/',getGroupedOrders)
adminOrderRouter.get('/:individualOrder',getIndividualOrderDetail)
adminOrderRouter.put('/:individualOrder/status',updateOrderStatus)
adminOrderRouter.patch('/:orderId/status/:itemId',updateIndividualOrderStatus)


export default adminOrderRouter