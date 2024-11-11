import TempUser from "../models/tempUserModel.js";
import User from '../models/userModel.js';
import { generateOtp, sendOTPEmail } from "../utils/generateOTP.js";
import bcrypt from 'bcryptjs';



export const signup = async (req,res)=>{
    try {
        const {name,email,phone,password} = req.body;
        const existTemp = await TempUser.findOne({email});
        if(existTemp){
            return res.status(409).json({message:"Retry after 2 minutes"})
        }

        const existUser = await User.findOne({email});
        if(existUser){
            return res.status(401).json({message:"User already Exist"})
        }

        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 60000);
        const hashedPassword = await bcrypt.hash(password,10);

        const tempUser = new TempUser({
            name,
            email,
            phone,
            password:hashedPassword,
            otp,
            otpExpires
        })
        await tempUser.save();

        await sendOTPEmail(email,otp);
        res.status(200).json({message:`OTP sent to Email ${email}`})

    } catch (error) {
        console.log(error);
        
        res.status(500).json({ message: "Error in Signup", error: error.message });
    }
}

export const verifyOTP = async(req,res)=>{
    try {
        const {email,otpValue} = req.body;

        
        const tempUser = await TempUser.findOne({email});

        if(!tempUser){
            return res.status(400).json({message:"Invalid Email"});
        }
        if(tempUser.otp !== otpValue){
            return res.status(400).json({message:"Invalid OTP"});
        }
        if(tempUser.otpExpires <new Date()){
            return res.status(400).json({message:"OTP Expired"})
        }

        const newUser = new User({
            name: tempUser.name,
            email: tempUser.email,
            phone: tempUser.phone,
            password: tempUser.password
        })

        await newUser.save()
        await tempUser.deleteOne({email});
        res.status(200).json({message:"User Registered Successfully"})
    } catch (error) {
        res.status(500).json({ message: "Error in OTP verification", error: error.message });
    }
}

export const resendOTP = async (req,res)=>{
    try {
        const {email} = req.body;

        let tempUser = await TempUser.findOne({email});

        if(!tempUser){
            return res.status(404).json({message:"User not found please register again"});
        }

        const newOTP = generateOtp();
        const newOTPExpires = new Date(Date.now()+ 60000);
        const newTempUser = new TempUser({
            name: tempUser.name,
            email: tempUser.email,
            phone:tempUser.phone,
            password:tempUser.password,
            otp: newOTP,
            otpExpires: newOTPExpires
        }) 

        const tempUserId = tempUser._id;
        await TempUser.findByIdAndDelete(tempUserId);

        // save the data into the original user model

        await newTempUser.save();

        await sendOTPEmail(email,newOTP);

        res.status(200).json({message:"New OTP sent successfully"})
    } catch (error) {
        res.status(500).json({message:"Error resending OTP",error: error.message})
    }
}