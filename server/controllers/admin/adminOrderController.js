import Order from "../../models/orderModel.js"

export const getGroupedOrders = async (req, res) => {
    try {
      const groupedOrders = await Order.aggregate([
        {
          $group: {
            _id: '$user',
            orderCount: { $sum: 1 },
            totalAmount: { $sum: '$total' },
            latestOrder: { $max: '$createdAt' },
            orders: { $push: '$$ROOT' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $project: {
            userId: '$_id',
            userName: '$userDetails.name',
            orderCount: 1,
            totalAmount: 1,
            latestOrder: 1,
            latestOrderId: { $arrayElemAt: ['$orders._id', -1] }
          }
        },
        {
          $sort: { latestOrder: -1 }
        }
      ]);
  
      res.json(groupedOrders);
    } catch (error) {
      console.error('Error fetching grouped orders:', error);
      res.status(500).json({ message: 'Error fetching grouped orders', error: error.message });
    }
  };

export const updateOrderStatus = async(req,res)=>{
    try {
        const {status} = req.body;
        const {individualOrder} = req.params;
        if(!status){
            res.status(404).json({message:"Unable to fetch status"});
        }
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
        }

        const orderToChange = await Order.findByIdAndUpdate(
            individualOrder,
            {status},
            {new:true})

        if(!orderToChange){
            return res.status(404).json({message:"Unable to fetch Order"});
        }
        res.status(200).json({message:`Order Statused Changed to ${status} successfully`})
    } catch (error) {
        res.status(500).json({ message: 'Error updating Order Status', error: error.message });
    }
}

export const getIndividualOrderDetail = async(req,res)=>{
    
    try {
        const {individualOrder} = req.params;
        
        const order = await Order.findById(individualOrder)
            .populate('user', 'name email')
            .populate('items.product')
        
        if(!order){
            return res.staus(404).json({message:"Order Not found"})
        }
        console.log(order)
        res.json(order)
        
    } catch (error) {
        res.status(500).json({message:"Interrnal server Error"})
    }
}

