import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true }, // Discount percentage
    minPurchase: { type: Number, required: true }, // Minimum purchase amount
    oneTimeUse: { type: Boolean, default: false } // For coupons like FIRST15
}, { timestamps: true });

const Coupon = mongoose.models.coupon || mongoose.model('coupon', couponSchema);

export default Coupon;