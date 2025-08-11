import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

        const user = await User.create({name, email, password: hashedPassword})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

        res.cookie('token', token, {
            httpOnly: true, // Prevent JavaScript to access cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
        })

        return res.json({success: true, user: {email: user.email, name: user.name}})
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

        return res.json({success: true, user: {email: user.email, name: user.name}})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


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
