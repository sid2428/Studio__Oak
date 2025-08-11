import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true },
    cartItems: {type: Object, default: {} },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'product' }], // Added wishlist
    hasUsedFirstOrderCoupon: { type: Boolean, default: false } // To track first order coupon
}, {minimize: false})

const User = mongoose.models.user || mongoose.model('user', userSchema)

export default User;