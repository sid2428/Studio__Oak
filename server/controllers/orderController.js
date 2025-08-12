import Order from "../models/Order.js";
import Product from "../models/Product.js";
import stripe from "stripe"
import User from "../models/User.js"
import { decreaseProductStock } from "./productController.js"; // New import
import Coupon from "../models/Coupon.js";
import mongoose from "mongoose";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, items, address, couponCode } = req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
        const user = await User.findById(userId).session(session);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // 1. Check stock for all items within the transaction
        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            if (!product || product.stock < item.quantity) {
                throw new Error(`Product "${product.name}" is out of stock.`);
            }
        }

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product).session(session);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        let discountAmount = 0;
        let couponApplied = false;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode }).session(session);
            if (coupon) {
                if (coupon.oneTimeUse && user.hasUsedFirstOrderCoupon) {
                    return res.json({ success: false, message: "Coupon already used." });
                }
                if (amount >= coupon.minPurchase) {
                    discountAmount = amount * (coupon.discount / 100);
                    amount -= discountAmount;
                    couponApplied = true;
                }
            }
        }


        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        // 2. Decrease stock for each item within the transaction
        for (const item of items) {
            await decreaseProductStock(item.product, item.quantity, session);
        }

        // 3. Create the order
        await Order.create([{
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
            couponApplied,
            discountAmount,
        }], { session });

        if (couponApplied) {
            const coupon = await Coupon.findOne({ code: couponCode }).session(session);
            if (coupon.oneTimeUse) {
                user.hasUsedFirstOrderCoupon = true;
                await user.save({ session });
            }
        }

        // Commit the transaction
        await session.commitTransaction();
        session.endSession();

        return res.json({success: true, message: "Order Placed Successfully" })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.json({ success: false, message: error.message });
    }
}

// Place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, items, address, couponCode } = req.body;
        const {origin} = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message: "Invalid data"})
        }
        const user = await User.findById(userId).session(session);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // 1. Check stock for all items within the transaction
        for (const item of items) {
            const product = await Product.findById(item.product).session(session);
            if (!product || product.stock < item.quantity) {
                throw new Error(`Product "${product.name}" is out of stock.`);
            }
        }

        let productData = [];

        // Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item)=>{
            const product = await Product.findById(item.product).session(session);
            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        let discountAmount = 0;
        let couponApplied = false;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode }).session(session);
            if (coupon) {
                if (coupon.oneTimeUse && user.hasUsedFirstOrderCoupon) {
                    return res.json({ success: false, message: "Coupon already used." });
                }
                if (amount >= coupon.minPurchase) {
                    discountAmount = amount * (coupon.discount / 100);
                    amount -= discountAmount;
                    couponApplied = true;
                }
            }
        }

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

       const order =  await Order.create([{
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
            couponApplied,
            discountAmount,
        }], { session });

        if (couponApplied) {
            const coupon = await Coupon.findOne({ code: couponCode }).session(session);
            if (coupon.oneTimeUse) {
                user.hasUsedFirstOrderCoupon = true;
                await user.save({ session });
            }
        }

        // 2. Decrease stock for each item within the transaction
        for (const item of items) {
            await decreaseProductStock(item.product, item.quantity, session);
        }

        // Commit the transaction before proceeding to Stripe
        await session.commitTransaction();
        session.endSession();

    // Stripe Gateway Initialize    
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // create line items for stripe

     const line_items = productData.map((item)=>{
        return {
            price_data: {
                currency: "usd",
                product_data:{
                    name: item.name,
                },
                unit_amount: Math.floor(item.price + item.price * 0.02)  * 100
            },
            quantity: item.quantity,
        }
     })

     if (couponApplied) {
        line_items.push({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: 'Discount',
                },
                unit_amount: -Math.floor(discountAmount * 100),
            },
            quantity: 1,
        });
    }

     // create session
     const stripeSession = await stripeInstance.checkout.sessions.create({
        line_items,
        mode: "payment",
        success_url: `${origin}/loader?next=my-orders`,
        cancel_url: `${origin}/cart`,
        metadata: {
            orderId: order[0]._id.toString(),
            userId,
        }
     })

        return res.json({success: true, url: stripeSession.url });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.json({ success: false, message: error.message });
    }
}
// Stripe Webhooks to Verify Payments Action : /stripe
export const stripeWebhooks = async (request, response)=>{
    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const sig = request.headers["stripe-signature"];
    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        response.status(400).send(`Webhook Error: ${error.message}`)
    }

    // Handle the event
    switch (event.type) {
        case "payment_intent.succeeded":{
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId, userId } = session.data[0].metadata;
            // Mark Payment as Paid
            await Order.findByIdAndUpdate(orderId, {isPaid: true})

            // Clear user cart
            await User.findByIdAndUpdate(userId, {cartItems: {}});
            break;
        }
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;
            const paymentIntentId = paymentIntent.id;

            // Getting Session Metadata
            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntentId,
            });

            const { orderId } = session.data[0].metadata;
            await Order.findByIdAndDelete(orderId);
            break;
        }
            
    
        default:
            console.error(`Unhandled event type ${event.type}`)
            break;
    }
    response.json({received: true});
}


// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res)=>{
    try {
        const { userId } = req.body;
        const orders = await Order.find({
            userId,
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res)=>{
    try {
        const orders = await Order.find({
            $or: [{paymentType: "COD"}, {isPaid: true}]
        }).populate("items.product address").sort({createdAt: -1});
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Update Order Status (for seller / admin) : /api/order/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await Order.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}