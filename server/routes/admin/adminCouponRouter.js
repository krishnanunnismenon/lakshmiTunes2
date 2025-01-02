import express from 'express'
import { getAllCoupons } from '../../controllers/admin/adminCouponController.js'

const adminCouponRouter = express.Router()

adminCouponRouter.get('/',getAllCoupons)

export default adminCouponRouter