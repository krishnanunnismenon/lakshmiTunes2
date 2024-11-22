import path from "path";
import { cloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { Product } from "../models/productModel.js";

export const addProduct = async(req,res)=>{
    
    try {
        const {name,description,price,stock,category,brand} = req.body;
        console.log(name,description,price,stock,category,brand)
        const imageUrls = []
        console.log(req.files)
       
        for(const file of req.files){
            const result = await cloudinary.uploader.upload(file.path,{
                folder:"LakshmiTunesProuducts-List"
            });
           
            
            imageUrls.push(result.secure_url);
            console.log(imageUrls,"=== ")
            fs.unlinkSync(path.resolve(file.path))

            
            
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            brand,
            images: imageUrls,
            thumbnailImage: imageUrls[0]
        })
        await product.save();
        res.status(201).json({message:"Product added successfully",product})
        
    } catch (error) {
        
    }
}

export const getAllProducts = async(req,res)=>{
    try {
        const allProducts = await Product.find();

        res.status(200).json(allProducts);
    } catch (error) {
        res.status(500).json({message:"Unable to send Product information"})
    }
}

export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { listed } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      { listed },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product status updated successfully", product });
  } catch (error) {
    console.error('Error updating product status:', error);
    res.status(500).json({ message: "Unable to change product status" });
  }
};