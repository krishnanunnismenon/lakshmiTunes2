import Order from "../models/orderModel.js"
import { Product } from "../models/productModel.js"

export const getUserOrder = async(req,res)=>{
    try {
        const orders = await Order.find({user:req.user.userId})
            .sort({createdAt:-1})
            .populate('items.product','name')

            res.json(orders)

    } catch (error) {   
        res.status(500).json({message:"Unable to send Order Details- Internal Sever Error"})
    }
}

export const getIndividualUserOrder = async(req,res)=>{
    try {
        
        const order = await Order.findOne({_id:req.params.orderId,user:req.user.userId})
            .populate('items.product','name')
            .populate('items.product','thumbnailImage')
            .populate('address')

        
        if(!order){
            return res.status(404).json({message:"Order Not Found"})
        }

        res.json(order)
    } catch (error) {
        res.status(500).json({message:"Unable to Send Individual Orders"})
    }
}

export const cancelUserOrder = async(req,res)=>{
    try {
        const order = await Order.findOne({_id:req.params.orderId,user:req.user.userId});
        
        if(!order){
            return res.status(404).json({message:"Order Not found"})
        }

        // update stock quantity by of all items 

        for(const item of order.items){
            const product = await Product.findById(item.product);
            if(product){
                product.stock += item.quantity;
                await product.save()
            }
        }
        
        order.status = 'cancelled';
        order.items = order.items.map(item => ({
            ...item,
            status: 'cancelled'
        }));
        
        await order.save()
        
        res.json({message:"Order Cancelled Successfully"})
    } catch (error) {
        res.status(500).json({message:"Unable to cancel Group Order"})
    }
}

export const cancelIndividualUserOrder = async(req,res)=>{
    try {
        
        const order = await Order.findOne({_id:req.params.orderId,user:req.user.userId});
        

        if(!order){
            res.status(404).json({message:"Order Not Found"})
        }
        
        if(order.status !== 'pending'){
            return res.status(400).json({message:"Order items not cancelled"})
        }

        const itemIndex = order.items.findIndex(item=>item._id.toString() === req.params.itemId);
        
        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        const cancelledItem = order.items[itemIndex];

        const product = await Product.findById(cancelledItem.product);
        if(product){
            product.stock += cancelledItem.quantity;
            await product.save()
        }

        cancelledItem.status = 'cancelled';
        order.total -= cancelledItem.price * cancelledItem.quantity;
        
        
        if (order.items.every(item => item.status === 'cancelled')) {
            order.status = 'cancelled';
        }
        
        await order.save()
        

        res.json({ message: 'Order item cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling order item', error: error.message });
    }
}