import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true,'Category name is required'],
            trim:true,
            unique:true
        },
        description:{
            type: String,
            trim:true
        },
        isListed:{
            type: Boolean,
            default: true
        },
        createdAt:{
            type: Date,
            default: Date.now
        },
        updatedAt:{
            type: Date,
            default:Date.now
        }
    }
)

// for updatedAt
categorySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
  });

const Category = mongoose.model('Category',categorySchema);
export default Category
