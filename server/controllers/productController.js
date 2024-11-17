import path from "path";
import { cloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { Product } from "../models/productModel.js";

export const addProduct = async(req,res)=>{
    try {
        const {name,description,price,stock} = req.body;
        const imageUrls = []
        for(const file of req.files){
            const result = await cloudinary.uploader.upload(file.path,{
                folder:"LakshmiTunes-Products"
            });
            imageUrls.push(result.secure_url);
            fs.unlinkSync(path.resolve(file.path))
            
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            //
            images: imageUrls,
            thumbnailImage: imageUrls[0]
        })
        await product.save();
        res.status(201).json({message:"Product added successfully",product})
        
    } catch (error) {
        
    }
}