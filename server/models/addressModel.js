import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
    name: String,
    house:String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    phone:Number,
    isPrimary: {
      type: Boolean,
      default: false
    }
  });