import { Product } from "../models/productModel.js";
import TempUser from "../models/tempUserModel.js";
import User from "../models/userModel.js";
import { generateOtp, sendOTPEmail } from "../utils/generateOTP.js";

export const userHome = async (req, res) => {
  try {
    const products = await Product.find({})
      .limit(5)
      .select("name, description, price, thumbnailImage, images")
      .sort({ createdAt: -1 });
    console.log(products);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const userProfile = async(req,res)=>{
  
  try {
    
    const user = await User.findById(req.user.userId);
  
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    res.json(user)
  } catch (error) {
    console.error("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export const updateProfile = async(req,res)=>{
  try {
    const {name,email,phone} = req.body
    
    
    const user = await User.findById(req.user.userId);

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    if(name) user.name = name;
    if(phone) user.phone = phone;
    if(email && email !== user.email){
      const otp = generateOtp();
      const tempUser = new TempUser({
        name: user.name,
        email: email,
        phone: user.phone,
        password: user.password,
        otp: otp,
        otpExpires: Date.now() + 300000
      });
      await tempUser.save();

      await sendOTPEmail({
        email: email,
        otp: otp
      })

      return res.status(200).json({ 
        message: 'OTP sent to new email for verification',
        tempUserId: tempUser._id
      });
    }

    await user.save()

    res.status(200).json({ 
      message: 'Profile updated successfully', 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
}

export const sendOTP = async(req,res)=>{
  try {
    const { email } = req.body.email;
   
    const otp = generateOtp();
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tempUser = new TempUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: user.password,
      otp: otp,
      otpExpires: Date.now() + 300000 // 5 minutes
    });
    await tempUser.save();

    
    await sendOTPEmail(email,otp)

    res.status(200).json({ message: 'OTP sent successfully', tempUserId: tempUser._id });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ message: 'Failed to send OTP', error: error.message });
  }
}

export const verifyOtp = async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
}