import Category from "../models/categoriesModel.js"

export const listCategories = async(req,res)=>{
    try {
        const allCategories = await Category.find().sort({createdAt:-1});
        res.status(200).json(allCategories)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
}

export const addCategory = async(req,res)=>{
    try {
        
        const {name,description} = req.body;
        const newCategory = new Category({name,description});
        await newCategory.save();
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ message: 'Category name already exists' });
          }
          res.status(500).json({ message: 'Error creating category', error: error.message });
    }
}


export const toggleListing = async(req,res)=>{
    try {
        const {categoryId} = req.params
        const {isListed} = req.body;

        const category = await  Category.findByIdAndUpdate(
            categoryId,
            {isListed},
            {new:true}
        )
        if (!category) {
            return res.status(404).json({ message: "Product not found" });
          }

          res.status(200).json({message:"Category status updated Successfully",category})
    } catch (error) {
        res.status(500).json({ message: 'Error changing category', error: error.message });
    }
}

export const editCategory = async(req,res)=>{
    try {
        const {categoryId } = req.params;
        const {name,description} = req.body;
        const updateCategory = await Category.findByIdAndUpdate(
            categoryId,
            {name,description},
            {new:true,runValidators:true}
        )
        if(!updateCategory){
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully', category: updateCategory });
    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({ message: 'Category name already exists' });
          }
          res.status(500).json({ message: 'Error updating category', error: error.message });
    }

}

export const deleteCategory = async(req,res)=>{
    try {
        const {categoryId} = req.params;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);
        if(!deletedCategory){
            return res.status(404).json({message:'Category not found'});
        }
        res.status(200).json({message:'Category deleted successfully',category:deletedCategory})
    } catch (error) {
        res.status(500).json({message:'Error deleting category', error:error.message})
    }
}