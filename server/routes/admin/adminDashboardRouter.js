import express from 'express'
import { getSalesReportData } from '../../controllers/admin/adminDashboardController.js'


const adminDashboardRouter = express.Router()

adminDashboardRouter.get('/sales-report',getSalesReportData)

export default adminDashboardRouter