import Coupon from "../models/Coupon.js";

// Get all coupons
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({});
        res.json({ success: true, coupons });
    } catch (error) {
        console.error("Error fetching coupons:", error);
        res.json({ success: false, message: "Server error." });
    }
};

// Create a new coupon (for admin)
export const createCoupon = async (req, res) => {
    try {
        const { code, discount, minPurchase, oneTimeUse } = req.body;
        const newCoupon = new Coupon({ code, discount, minPurchase, oneTimeUse });
        await newCoupon.save();
        res.json({ success: true, message: "Coupon created successfully." });
    } catch (error) {
        console.error("Error creating coupon:", error);
        res.json({ success: false, message: "Failed to create coupon." });
    }
};