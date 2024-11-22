import TempUser from "../models/tempUserModel.js";
import User from '../models/userModel.js';
import { generateOtp, sendOTPEmail } from "../utils/generateOTP.js";
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from "../utils/jwtToken.js";
import oAuth2client from "../utils/googleConfig.js";
import jwt from 'jsonwebtoken'
import {google} from 'googleapis'


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

export const signIn = async (req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User does not Exist"})
        }

        const validPassword = await bcrypt.compare(password,user.password)

        if(!validPassword){
            return res.status(401).json({message:"Invalid Password"});
        }

        const refreshToken = createRefreshToken(user)
        const accessToken = createAccessToken(user)

        res
        .status(200)
        .cookie("refreshToken",refreshToken,{
            path:"/",
            httpOnly:true,
            sameSite: "none",
            secure:true,
            maxAge: 60 * 60 * 24 * 1000
        })
        .json({
            success:true,
            message: "You are Logged In",
            accessToken,
            data:{
                user:{id:user._id,email:user.email,role:user.role},
            }
        })
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

export const googleLogin = async (req, res) => {
    try {
        
        const { authCode:code } = req.body;
        if (!code) {
            return res.status(400).json({ message: 'Authorization code not provided' });
        }

  
        const { tokens } = await oAuth2client.getToken(code);
        oAuth2client.setCredentials(tokens);
console.log(tokens)
     
        const oauth2 = google.oauth2('v2');
        const { data: userInfo } = await oauth2.userinfo.get({ auth: oAuth2client });

        if (!userInfo) {
            return res.status(400).json({ message: 'Failed to fetch user information' });
        }
        

        
        const { email, name, picture } = userInfo;

        let user = await User.findOne({ email });
        if (!user) {
           
            user = await User.create({
                email,
                name,
                avatar: picture,
                provider: 'google', 
            });
        }

       
        const accessToken = createAccessToken(user);
        const refreshToken = createRefreshToken(user)
       
        return res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
            },
        });
    } catch (error) {
        console.error('Google Login Error:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const refreshToken = async(req,res)=>{
    const refreshToken = req.cookies?.refreshToken;
    
    if(!refreshToken){
        return res.status(401).json({message:"Refresh Token not found"});
    }

    try {
        const decoded =await jwt.verify(refreshToken,process.env.REFRESH_TOKEN);
        const user  = await User.findById(decoded.userId);
        const accessToken = createAccessToken(user)

        res.json({accessToken})

        
    } catch (error) {
        res
      .status(403)
      .json({ message: "Invalid refresh token", error: error.message });
        
    }
}

export const adminSignIn = async (req,res)=>{
    const{email,password} = req.body;

    try {
        const admin = await User.findOne({email,role:"admin"});
        console.log(admin)
        if(!admin){
            return res.status(401).json({message:"Unauthorized admin"})
        }
        const validPassword = await bcrypt.compare(password,admin.password);

        if(!validPassword){
            return res.status(401).json({message:"Invalid Password"})
        }

        const refreshToken = createRefreshToken(admin)
        const accessToken = createAccessToken(admin);

        res.status(200)
        .cookie("refreshToken",refreshToken,{
            path:"/",
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge: 60 * 60 * 24 * 1000
        })
        .json({
            success: true,
            message:"Login successfull",
            accessToken,
            data:{
                admin:{adminId: admin._id,email: admin.email,role: admin.role}
            }
        })
    } catch (error) {
        
    }
}

export const verifyEmail = async(req,res)=>{
    try {
        const {email} = req.body;
        
        
        
        const user = await User.findOne({email});
        

        if(user){
            const otp = generateOtp()
            console.log(otp)
            await sendOTPEmail(email,otp)
            res.status(200).json({message:"OTP sent to email"})
        }else{
            res.status(404).json({message:"Email Not found"})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}

export const verifyEmailOTP = async(req,res)=>{
    try {
        const {email,otp} = req.body;
        const user = await User.findOne({email})
        

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }
      
        if (user.resetOTP !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
          }
      
        await user.save();
        res.status(200).json({message:"OTP verified successfully"})
      
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}