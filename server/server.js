import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';

// New Imports for Authentication
import passport from 'passport';
import session from 'express-session';
import configurePassport from './configs/passport.js';

import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
import couponRouter from './routes/couponRoute.js';
import Coupon from './models/Coupon.js';
import reviewRouter from './routes/reviewRoute.js';
import geminiRouter from './routes/geminiRoute.js'; 

const app = express();
const port = process.env.PORT || 4000;

// CORS setup
const allowedOrigins = [process.env.CLIENT_URL, 'http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

// Stripe webhook BEFORE express.json()
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// Middleware
app.use(express.json());
app.use(cookieParser());

// Passport & session
app.use(session({
    secret: process.env.SESSION_SECRET || 'a_super_secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send("API is Working"));
configurePassport(passport);

app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/support', supportRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/gemini', geminiRouter);

// Start server AFTER DB & Cloudinary connect
const startServer = async () => {
    try {
        await connectDB();
        await connectCloudinary();

        // Seed coupons
        const count = await Coupon.countDocuments();
        if (count === 0) {
            console.log("Seeding coupons...");
            await Coupon.insertMany([
                { code: 'FIRST15', discount: 15, minPurchase: 0, oneTimeUse: true },
                { code: 'SAVE5', discount: 5, minPurchase: 499, oneTimeUse: false },
                { code: 'SAVE7', discount: 7.5, minPurchase: 1099, oneTimeUse: false },
                { code: 'SAVE10', discount: 10, minPurchase: 2000, oneTimeUse: false }
            ]);
        }

        app.listen(port, () => {
            console.log(`✅ Server is running on port ${port}`);
        });

    } catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
};

startServer();
