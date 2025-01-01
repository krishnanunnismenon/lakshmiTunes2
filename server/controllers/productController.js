import Order from "../models/orderModel.js";
import { Product } from "../models/productModel.js"
import User from "../models/userModel.js";
import Razorpay from 'razorpay'
import crypto from 'crypto'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

export const getNewProducts = async (req, res) => {
    try {
      const { exclude } = req.query;
      const limit = 3; 
  
      let query = {};
      if (exclude) {
        query._id = { $ne: exclude };
      }
  
      const newProducts = await Product.find(query)
        .sort({ createdAt: -1 })
        .limit(limit);

      
      
      res.json(newProducts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching new products', error: error.message });
    }
  };

export const getIndividualProduct = async(req,res)=>{
    try {
        const product = await Product.findById(req.params.id)
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
          }

          const response = {
            ...product.toObject()
          }

          res.json(response)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
}

export const getAllUserProducts = async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';
        const search = req.query.search || '';
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

        // Sort options
        const sortOptions = {
            'price-asc': { price: 1 },
            'price-desc': { price: -1 },
            'name-asc': { name: 1 },
            'name-desc': { name: -1 },
            'rating-desc': { averageRating: -1 },
            'createdAt-desc': { createdAt: -1 },
        };
        const sortQuery = sortOptions[`${sort}-${order}`] || sortOptions['createdAt-desc'];

        // Base query with name and price filters
        const query = {
            name: { $regex: search, $options: 'i' },
            price: { $gte: minPrice, $lte: maxPrice },
            listed:true
        };

        // Find all matching products and populate categories
        const allProducts = await Product.find(query)
            .populate({
                path: 'category',
                match: { isListed: true }, // Only include products whose categories have isListed: true
            })
            .sort(sortQuery);

        // Filter out products without a valid category
        const filteredProducts = allProducts.filter(product => product.category);

        // Pagination
        const paginatedProducts = filteredProducts.slice((page - 1) * limit, page * limit);

        // Send response
        res.json({
            products: paginatedProducts,
            currentPage: page,
            totalPages: Math.ceil(filteredProducts.length / limit),
            total: filteredProducts.length,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }

}

export const getCart = async(req,res)=>{
    try {
        
        const user = await User.findById(req.user.userId).populate('cart.product');
        
        res.json(user.cart)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const addToCart = async (req, res) => {
    try {
       
      const { productId, quantity } = req.body;
      const user = await User.findById(req.user.userId);
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product Not Found" });
      }
  
      const cartItem = user.cart.find(item => item.product.toString() === productId);
  
      if (cartItem) {
        // Item already exists in cart
        const newQuantity = cartItem.quantity + quantity;
        if (newQuantity > product.maxQuantity) {
          return res.status(400).json({ message: "Exceeded maximum quantity per item" });
        }
        if (newQuantity > product.stock) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
        cartItem.quantity = newQuantity;
      } else {
        // New item in cart
        if (quantity > product.maxQuantity) {
          return res.status(400).json({ message: "Exceeded maximum quantity per item" });
        }
        if (quantity > product.stock) {
          return res.status(400).json({ message: "Not enough stock available" });
        }
        user.cart.push({ product: productId, quantity });
      }
  
      await user.save();
      res.status(201).json(user.cart);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };
  

export const updateFullCart = async(req,res)=>{
    const user = await User.findById(req.user.id);
}

export const updateItemCart = async(req,res)=>{
    
    try {
        const {productId,quantity} = req.body;
        const user = await User.findById(req.user.userId);
        const product = await Product.findById(productId);
        
        
        if(!product){
            return res.status(404).json({ message: 'Product not found' });
        }
        
        
        if (quantity > product.stock) {
            return res.status(400).json({ message: 'Not enough stock available' });
        }
        const cartItemIndex = user.cart.findIndex(item=>item.product.toString() === productId);
    
        if(cartItemIndex>-1){
            user.cart[cartItemIndex].quantity= quantity;
        }else{
            user.cart.push({product:productId,quantity});
        }
    
        await user.save();
        res.json(user.cart)
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart item', error: error.message });
    }
   
}

export const removeItemCart = async(req,res)=>{
    try {
        
        const {productId} = req.params;
        const user = await User.findById(req.user.userId);
        user.cart = user.cart.filter(item=>item.product.toString() !== productId);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        res.status(500).json({message:'Error removing item from cart',error:error.message})
    }
}

export const createOrder = async(req,res)=>{
    try {
        const {addressId,items} = req.body;
        const userId = req.user.userId;
       

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message:"User not found"});

        }
        const address = user.addresses.id(addressId);
        if(!address){
            return res.status(404).json({message:"Address Not found"});
        }

        let total = 0;
        const orderItems = []
        
        for(let item of items){
            const product = await Product.findById(item.product);
            if(!product){
                return res.status(404).json({message:`Product ${item.product} not found`})
            }
            if(product.stock<item.quantity){
                return res.status(400).json({message:`Insufficient Stock for the product ${product.name}`})
            }
            total += product.price * item.quantity;

            orderItems.push({
                product:item.product,
                quantity:item.quantity,
                price:product.price
            })

            
            
        }
       
        const order = new Order({
          user:userId,
          items:orderItems,
          address:{
              name:address.name,
              house: address.house,
              city: address.city,
              state: address.state,
              pincode: address.pincode,
              country: address.country,
              phone: address.phone
          },
          total,
          status:'created'
        });
        
        await order.save()

        res.status(201).json(order);
    } catch (error) {
        console.error('Error in createOrder:', error);
         res.status(500).json({ message: 'Error creating order', error: error.message });
    }
} 

export const getOrderDetails = async(req,res)=>{
    try {
        const {orderId} = req.params;
        const userId = req.user.userId;
        
      
        const order = await Order.findById(orderId)
            .populate('items.product')
            .lean().exec();
        
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }

        if (order.user.toString() !== userId) {
            
            return res.status(403).json({ message: 'Not authorized' });
          }
        
        res.json(order)
    } catch (error) {
        res.json(500).json({message:"Error fetching order details"})
    }
}

export const placeOrder = async(req,res)=>{
    try {
        
        const {orderId,paymentMethod} = req.body;
        
        const userId = req.user.userId;
        
        
        const order = await Order.findById(orderId)
            

        
        if(!order){
            return res.status(404).json({message:"order not found"})
        }

        if(order.user.toString()!==userId){
            return res.status(403).json({message:"Not authorized"})
        }
        
        if(paymentMethod =='cod'){
            order.paymentMethod = 'cod'
            order.status = 'pending';
            
            await order.save()
            
        }
        //stock quantity - 1
        
        for (let item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
              })
          }

        const user = await User.findById(userId);
        user.cart = [];
        
        // user.save()

        res.json({message:"Order placed Successfully",order});
    } catch (error) {

    }
}

export const createRazorpayOrder = async(req,res)=>{
    try {
       const {orderId} = req.body;
       const order = await Order.findById(orderId);
       
       if(!order){
        res.status(404).json({message:"Order not found"});
       }
       
       const razorpayOrder = await razorpay.orders.create({
        amount:order?.total * 100 || 1000,
        currency:"INR",
        receipt:orderId
       })
       

       order.razorpayOrderId = razorpayOrder.id;
       await order.save();

       
       res.json({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      });
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Error creating Razorpay order' });
    }
}

export const verifyRazorpayOrder = async(req,res)=>{
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
        
        if (generatedSignature === razorpay_signature) {
            const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            
            order.paymentStatus = 'paid';
            order.razorpayPaymentId = razorpay_payment_id;
            await order.save();
      
            res.json({ message: 'Payment successful' });
        }else{
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
         res.status(500).json({ message: 'Error verifying payment' });
    }
}