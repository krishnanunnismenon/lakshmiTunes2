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
            type:String,
            required: true
        },
        images:{
            type:[String],
            required:true
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required:true
        },
        brand:{
            type:String,
            required:true
        },
        stock:{
            type:Number,
            required:true
        },
        maxQuantity:{
            type:Number,
            min:1,
            default:5
        },
        listed:{
            type:Boolean,
            default:true,
            required:true
        },
        rating:{
            type:Number,
            required:true,
            default:0
        },
        discountedPrice:{
            type:Number,
            default:null
        },
        bestOffer:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Offer',
            default:null
        }
        
        
    },
    {
        timestamps:true
    }
);

productSchema.index({name:'text'});
export const Product = mongoose.model("Product",productSchema);