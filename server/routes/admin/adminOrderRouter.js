import express from 'express'
import {  getGroupedOrders, getIndividualOrderDetail, updateOrderStatus } from '../../controllers/admin/adminOrderController.js';

const adminOrderRouter = express.Router();

adminOrderRouter.get('/',getGroupedOrders)
adminOrderRouter.get('/:individualOrder',getIndividualOrderDetail)
adminOrderRouter.put('/:individualOrder/status',updateOrderStatus)


export default adminOrderRouter