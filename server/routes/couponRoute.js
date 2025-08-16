import express from 'express';
import { getAllCoupons, createCoupon } from '../controllers/couponController.js';
import authSeller from '../middlewares/authSeller.js';

const couponRouter = express.Router();

couponRouter.get('/list', getAllCoupons);
couponRouter.post('/create', authSeller, createCoupon);

export {couponRouter};
