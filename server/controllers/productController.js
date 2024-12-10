import { Product } from "../models/productModel.js"
import User from "../models/userModel.js";

export const getNewProducts = async(req,res)=>{
    try {
        
        const newProducts = await Product.find()
        .sort('-createdAt')
        .limit(3);

        res.json(newProducts)
    } catch (error) {
        res.status(500).json({message:"Error fetching new products",error:error.message})
    }
}

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
        console.log("hello")
        const allProducts = await Product.find({listed:true}).populate('category', 'name');
        
        res.status(200).json(allProducts);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Unable to send Product information"})
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

export const addToCart = async(req,res)=>{
    try {
        const {productId,quantity} = req.body;
        const user = await User.findById(req.user.userId);
        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({message:"Product Not Found"})
        }
        if(product.stock<quantity){
            return res.status(400).json({message:"Stock Unavailable"})
        }

        const cartItem = user.cart.find(item=>item.product.toString()=== productId);
        
        if(cartItem){
            const newQuantity = cartItem.quantity + quantity;
            if(newQuantity > product.maxQuantity){
                res.status(400).json({message:"Exceeded maximum Quantity"})
            }
            cartItem.quantity = quantity;
        }
        user.cart.push({ product: productId, quantity });
        
        await user.save();
        res.status(201).json(user.cart)
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
}