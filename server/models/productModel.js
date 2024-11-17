import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type:String,
            required: true
        },
        price:{
            type:Number,
            required: true
        },
        thumbnailImage:{
            type:[String],
            required: true
        },
        stock:{
            type:Number,
            required:true
        },
        
    },
    {
        timestamps:true
    }
);

productSchema.index({name:'text'});
export const Product = mongoose.model("Product",productSchema);