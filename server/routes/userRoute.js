import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Speakeasy from 'speakeasy';
import nodemailer from 'nodemailer';

// New function to send OTP email
const sendOTP = async (user) => {
    const secret = Speakeasy.generateSecret({ length: 20 });
    user.otpSecret = secret.base32;
    await user.save();

    const token = Speakeasy.totp({
        secret: secret.base32,
        encoding: 'base32',
        window: 10, // OTP is valid for 5 minutes (10 * 30-second windows)
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: `"Studio Oak" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Studio Oak Verification Code',
        html: `<div style="font-family: sans-serif; text-align: center; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 400px; margin: auto;">
                 <h2 style="color: #333;">Email Verification</h2>
                 <p style="color: #555;">Thank you for registering. Please use the following One-Time Password (OTP) to verify your email address.</p>
                 <p style="font-size: 28px; font-weight: bold; letter-spacing: 3px; margin: 25px; padding: 12px; background-color: #f1f1f1; border-radius: 5px; color: #815a58;">${token}</p>
                 <p style="color: #777; font-size: 14px;">This OTP is valid for 5 minutes.</p>
               </div>`
    };
    
    await transporter.sendMail(mailOptions);
};

// Register User : /api/user/register
export const register = async (req, res)=>{
    try {
        const { name, email, password } = req.body;

        if(!name || !email || !password){
            return res.json({success: false, message: 'Missing Details'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser) {
            if (!existingUser.isVerified) {
                await sendOTP(existingUser);
                return res.json({success: true, message: 'Account exists but is not verified. A new OTP has been sent.'});
            }
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword, isVerified: false})
        await sendOTP(user);

        return res.json({success: true, message: 'Registration successful. Please check your email for the OTP.'});
    } catch (error) {
        // --- MODIFIED FOR BETTER LOGGING ---
        console.error("REGISTER_CONTROLLER_ERROR:", error); 
        res.status(500).json({ success: false, message: "A server error occurred during registration." });
        // --- END MODIFICATION ---
    }
}

// Login User : /api/user/login
export const login = async (req, res)=>{
    try {
        const { email, password } = req.body;

        if(!email || !password)
            return res.json({success: false, message: 'Email and password are required'});
        
        const user = await User.findOne({email});

        if(!user){
            return res.json({success: false, message: 'User not found. Please sign up first.'});
        }

        if (!user.isVerified) {
            await sendOTP(user);
            return res.json({ success: false, isNotVerified: true, message: 'Your email is not verified. A new OTP has been sent.' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch)
            return res.json({success: false, message: 'Invalid password.'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, user: {email: user.email, name: user.name, hasUsedFirstOrderCoupon: user.hasUsedFirstOrderCoupon}})
    } catch (error) {
        // --- MODIFIED FOR BETTER LOGGING ---
        console.error("LOGIN_CONTROLLER_ERROR:", error); 
        res.status(500).json({ success: false, message: "An unexpected error occurred during login." });
        // --- END MODIFICATION ---
    }
}

// New route for requesting OTP
export const requestOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }
        if (user.isVerified) {
            return res.json({ success: false, message: 'This account is already verified.' });
        }
        await sendOTP(user);
        res.json({ success: true, message: 'A new OTP has been sent to your email' });
    } catch (error) {
        console.error("REQUEST_OTP_ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
};

// New route for verifying OTP
export const verifyOTP = async (req, res) => {
    try {
        const { email, token } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const isTokenValid = Speakeasy.totp.verify({
            secret: user.otpSecret,
            encoding: 'base32',
            token: token,
            window: 10
        });

        if (isTokenValid) {
            user.isVerified = true;
            user.otpSecret = undefined;
            await user.save();
            res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
        } else {
            res.json({ success: false, message: 'Invalid or expired OTP. Please try again.' });
        }
    } catch (error) {
        console.error("VERIFY_OTP_ERROR:", error);
        res.status(500).json({ success: false, message: "Failed to verify OTP." });
    }
};

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res)=>{
    try {
        const { userId } = req.body;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// Logout User : /api/user/logout
export const logout = async (req, res)=>{
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// --- Wishlist Controllers (no changes needed here) ---
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.body.userId).populate('wishlist');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error("Error fetching wishlist:", error.message);
        res.status(500).json({ success: false, message: "Server error while fetching wishlist" });
    }
};

export const addToWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });
        res.json({ success: true, message: "Added to Wishlist" });
    } catch (error) {
        console.error("Error adding to wishlist:", error.message);
        res.status(500).json({ success: false, message: "Server error while adding to wishlist" });
    }
};

export const removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.body;
        await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
        res.json({ success: true, message: "Removed from Wishlist" });
    } catch (error) {
        console.error("Error removing from wishlist:", error.message);
        res.status(500).json({ success: false, message: "Server error while removing from wishlist" });
    }
};
