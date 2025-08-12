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
import supportRouter from './routes/supportRoute.js';
import { stripeWebhooks } from './controllers/orderController.js';
import couponRouter from './routes/couponRoute.js';
import Coupon from './models/Coupon.js'; // Import Coupon model
import reviewRouter from './routes/reviewRoute.js'; // Import review router

const app = express();
const port = process.env.PORT || 4000;

await connectDB()
await connectCloudinary()

// --- Seed Coupons into the database ---
const seedCoupons = async () => {
    try {
        const count = await Coupon.countDocuments();
        if (count === 0) {
            console.log("No coupons found. Seeding database...");
            const couponsToSeed = [
                { code: 'FIRST15', discount: 15, minPurchase: 0, oneTimeUse: true },
                { code: 'SAVE5', discount: 5, minPurchase: 499, oneTimeUse: false },
                { code: 'SAVE7', discount: 7.5, minPurchase: 1099, oneTimeUse: false },
                { code: 'SAVE10', discount: 10, minPurchase: 2000, oneTimeUse: false }
            ];
            await Coupon.insertMany(couponsToSeed);
            console.log("Coupons seeded successfully.");
        }
    } catch (error) {
        console.error("Error seeding coupons:", error);
    }
};

await seedCoupons(); // Run the seeder after DB connection

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173', '']

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

// Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

// --- PASSPORT SETUP (Add these lines) ---
app.use(session({
    secret: 'YOUR_SESSION_SECRET', // Replace with a strong, random string
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
// ----------------------------------------


app.get('/', (req, res) => res.send("API is Working"));

// Call the passport config function
configurePassport(passport);

app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/support', supportRouter);
app.use('/api/coupon', couponRouter);
app.use('/api/reviews', reviewRouter); // Use review router

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`)
})