import { Product } from "../models/productModel.js"

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
