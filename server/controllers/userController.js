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
        window: 1,
    });

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your OTP Code',
        html: `<p>Your OTP is: <b>${token}</b></p>`
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

        if(existingUser)
            return res.json({success: false, message: 'User already exists'})

        const hashedPassword = await bcrypt.hash(password, 10)

        // Updated user creation with OTP and verification fields
        const user = await User.create({name, email, password: hashedPassword, hasUsedFirstOrderCoupon: false, isVerified: false})

        // Send OTP immediately after registration
        await sendOTP(user);

        return res.json({success: true, message: 'Registration successful. Please verify your email with the OTP sent to you.'});
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
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
            return res.json({success: false, message: 'Invalid email or password'});
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.json({ success: false, message: 'Please verify your email before logging in.' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch)
            return res.json({success: false, message: 'Invalid email or password'});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.json({success: true, user: {email: user.email, name: user.name, hasUsedFirstOrderCoupon: user.hasUsedFirstOrderCoupon}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
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

        await sendOTP(user);
        res.json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        res.json({ success: false, message: error.message });
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
            window: 1
        });

        if (isTokenValid) {
            user.isVerified = true;
            user.otpSecret = undefined; // Clear the OTP secret after successful verification
            await user.save();
            res.json({ success: true, message: 'Email verified successfully!' });
        } else {
            res.json({ success: false, message: 'Invalid OTP' });
        }
    } catch (error) {
        res.json({ success: false, message: error.message });
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
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}

// --- Wishlist Controllers ---

// Get Wishlist : /api/user/wishlist
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

// Add to Wishlist : /api/user/wishlist/add
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

// Remove from Wishlist : /api/user/wishlist/remove
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