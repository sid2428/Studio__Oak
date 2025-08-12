import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String }, // Make password optional for Google sign-in
    googleID:{type: String},
    // --- ADDED ---
    otpSecret: { type: String }, 
    isVerified: { type: Boolean, default: false }, 
    // --- END ADDED ---
    cartItems: {type: Object, default: {} },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }],
    hasUsedFirstOrderCoupon: { type: Boolean, default: false }
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User;