import express from 'express';
import { isAuth, login, logout, register, getWishlist, addToWishlist, removeFromWishlist } from '../controllers/userController.js';
import authUser from '../middlewares/authUser.js';

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


export default userRouter;
