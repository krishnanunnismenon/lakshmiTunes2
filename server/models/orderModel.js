import mongoose from "mongoose";
import {addressSchema} from "./addressModel.js";


const orderItemSchema = new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    quantity:{
        type:Number,
        required:true,
        min:[1,"Quantity can not be less than 1"]
    },
    price:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['created','pending','processing','shipped','delivered','cancelled'],
        default:'pending'
    },
})


const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    items:[orderItemSchema],
    address:[addressSchema],
    total:{
        type:Number,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['created','pending','processing','shipped','delivered','cancelled'],
        default:'pending'
    },
},{timestamps:true})

const Order = mongoose.model('Order',orderSchema);

export default Order;