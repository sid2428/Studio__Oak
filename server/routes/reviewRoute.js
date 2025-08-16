import express from 'express';
import { createReview, getProductReviews, updateReview, checkReviewEligibility } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js';

const reviewRouter = express.Router();

reviewRouter.post('/', authUser, createReview);
reviewRouter.get('/:productId', getProductReviews);
reviewRouter.put('/:id', authUser, updateReview);
reviewRouter.get('/can-review/:productId', authUser, checkReviewEligibility);


export {reviewRouter};
