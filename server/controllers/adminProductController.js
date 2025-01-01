import path from "path";
import { cloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import { Product } from "../models/productModel.js";

export const addProduct = async(req,res)=>{
    
    try {
        const {name,description,price,stock,category,brand} = req.body;
        console.log(name,description,price,stock,category,brand)
        const imageUrls = []
        
        for(const file of req.files){
          const result = await cloudinary.uploader.upload(file.path,{
            folder:"LakshmiTunesProuducts-List"
          });
          
          
          imageUrls.push(result.secure_url);
          
          fs.unlinkSync(path.resolve(file.path))
          console.log(req.files)

            
            
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
      console.log(error)
        res.status(500).json({message:'unable to add product',error})
    }
}

export const getProductById = async(req,res)=>{
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
}

export const getAllProducts = async(req,res)=>{
    try {
        const allProducts = await Product.find().populate('category', 'name');

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


export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const files = req.files;
    console.log('Update Data:', updateData);
    console.log('Files:', files);

    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update only the fields that are provided
    Object.keys(updateData).forEach(key => {
      if (updateData[key] !== undefined) {
        product[key] = updateData[key];
      }
    });

    // Handle image updates
    if (files && files.length > 0) {
      // Delete old images from Cloudinary
      for (let imageUrl of product.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new images to Cloudinary
      const uploadPromises = files.map(file => 
        cloudinary.uploader.upload(file.path, { folder: 'products' })
      );
      const uploadResults = await Promise.all(uploadPromises);

      // Update product with new image URLs
      product.images = uploadResults.map(result => result.secure_url);

      // Clean up temporary files
      files.forEach(file => fs.unlinkSync(file.path));
    }

    // Handle existing images
    if (updateData.existingImages) {
      const existingImages = Array.isArray(updateData.existingImages) 
        ? updateData.existingImages 
        : [updateData.existingImages];
      product.images = [...product.images, ...existingImages];
    }

    // Validate the product before saving
    const validationError = product.validateSync();
    if (validationError) {
      const errorMessages = Object.values(validationError.errors).map(error => error.message);
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errorMessages 
      });
    }

    await product.save();

    res.status(200).json({ 
      message: 'Product updated successfully', 
      product: product 
    });
  } catch (error) {
    console.error('Error in editProduct:', error);
    res.status(500).json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
};