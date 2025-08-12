import express from 'express';
import { isAuth, login, logout, register, getWishlist, addToWishlist, removeFromWishlist, requestOTP, verifyOTP } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const userRouter = express.Router();

// Auth Routes
userRouter.post('/register', register)
userRouter.post('/login', login)
userRouter.get('/is-auth', authUser, isAuth)
userRouter.get('/logout', authUser, logout)

// Wishlist Routes
userRouter.get('/wishlist', authUser, getWishlist);
userRouter.post('/wishlist/add', authUser, addToWishlist);
userRouter.post('/wishlist/remove', authUser, removeFromWishlist);

// Google OAuth Routes
userRouter.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

userRouter.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate and set the JWT token for the user
    if (req.user) {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.redirect(process.env.CLIENT_URL); // FIXED: Redirect to the client's URL
    } else {
        res.redirect('/login');
    }
});

// OTP Routes
userRouter.post('/request-otp', requestOTP);
userRouter.post('/verify-otp', verifyOTP);


export default userRouter;