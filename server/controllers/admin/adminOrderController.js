import Order from "../../models/orderModel.js"


export const getGroupedOrders = async (req, res) => {
  try {
    const groupedOrders = await Order.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $unwind: '$userDetails'
      },
      {
        $project: {
          _id: 1,
          userId: '$user',
          userName: '$userDetails.name',
          orderDate: '$createdAt',
          status: 1,
          total: 1,
          orderCount: { $size: '$items' }
        }
      },
      {
        $sort: { orderDate: -1 }
      }
    ]);
    console.log(groupedOrders)
    res.json(groupedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
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

export const updateIndividualOrderStatus = async(req,res)=>{
    try {
        const { orderId, itemId } = req.params;
        const { status } = req.body;
    
        const order = await Order.findById(orderId);
    
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
    
        const item = order.items.id(itemId);
    
        if (!item) {
          return res.status(404).json({ message: 'Order item not found' });
        }
    
        item.status = status;
        
        const allItemStatuses = order.items.map(item => item.status);
        if (allItemStatuses.every(s => s === 'delivered')) {
          order.status = 'delivered';
        } else if (allItemStatuses.every(s => s === 'cancelled')) {
          order.status = 'cancelled';
        } else if (allItemStatuses.some(s => s === 'shipped')) {
            order.status = 'shipped';
        } else if (allItemStatuses.some(s => s === 'processing')) {
          order.status = 'processing';
        } else {
            order.status = 'pending';
        }
        console.log(allItemStatuses.every(s => s === 'delivered'))
        await order.save();
        
        res.json({ message: 'Order item status updated successfully', order });
      } catch (error) {
        res.status(500).json({ message: 'Error updating order item status', error: error.message });
      }
}