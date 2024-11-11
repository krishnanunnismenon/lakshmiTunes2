import nodemailer from 'nodemailer';

export const generateOtp = ()=> Math.floor(10000+ Math.random()*900000);

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTPEmail = async(email,otp)=>{
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject:"OTP for Registration in Lakshmi Tunes",
        html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
            <h2>Welcome!</h2>
            <p>Your One-Time Password (OTP) for registration is:</p>
            <div style="font-size: 32px; font-weight: bold; color: #0066cc; margin: 20px 0;">
            ${otp}
            </div>
            <p>This OTP will expire in <b>1 minute</b>.</p>
            <p style="color: #666; font-size: 14px;">For security reasons, please don't share this OTP with anyone.</p>
        </div>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Otp email sent to ${email}`)
    } catch (error) {
        console.error(`Failed to send OTP email to ${email}:`, error);
    }
}