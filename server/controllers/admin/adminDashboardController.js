import Order from "../../models/orderModel.js";
import User from "../../models/userModel.js";


const getDateRange = (option, startDate, endDate) => {
    const now = new Date();
    let start, end;
  
    switch (option) {
      case 'currentMonth':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case 'currentYear':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31);
        break;
      case 'currentDate':
        start = new Date(now.setHours(0, 0, 0, 0));
        end = new Date(now.setHours(23, 59, 59, 999));
        break;
      case 'custom':
        start = new Date(startDate);
        end = new Date(endDate);
        break;
      default:
        throw new Error('Invalid date range option');
    }
  
    return { start, end };
  };
  export const getSalesReportData = async(req,res)=>{
      try {
        const { option, startDate, endDate } = req.query;
        
        const { start, end } = getDateRange(option, startDate, endDate);

        const totalSales = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$total' } } }
          ]);

          const totalCustomers = await User.countDocuments({ 
            role: 'user',
            createdAt: { $gte: start, $lte: end }
          });
          
          const totalOrders = await Order.countDocuments({ 
            createdAt: { $gte: start, $lte: end },
            status: { $ne: 'cancelled' }
          });

          const salesOverview = await Order.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
            { $group: { 
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              total: { $sum: '$total' }
            } },
            { $sort: { _id: 1 } }
          ]);

        

    const categorySales = await Order.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: 'cancelled' } } },
        { $unwind: '$items' },
        { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
        { $unwind: '$product' },
        { $group: { _id: '$product.category', total: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
        { $sort: { total: -1 } }
      ]);


        const latestOrders = await Order.find({ 
         createdAt: { $gte: start, $lte: end },
        status: { $ne: 'cancelled' }
        })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email')
      .lean();
      
      res.json({
        totalSales: totalSales[0]?.total || 0,
        totalCustomers,
        totalOrders,
        salesOverview,
        categorySales,
        latestOrders,
        dateRange: { start, end }
      });

    } catch (error) {
        res.status(500).json({ message: "Error fetching sales report data", error: error.message });        
    }
}