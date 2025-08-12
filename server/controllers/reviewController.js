import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.body.userId;

        if (!productId || !rating || !comment) {
            return res.status(400).json({ success: false, message: 'Missing required fields.' });
        }

        const product = await Product.findById(productId);

        if (product) {
            const hasPurchased = await Order.findOne({ 
                userId, 
                'items.product': productId, 
                status: 'Delivered' 
            });

            if (!hasPurchased) {
                return res.status(403).json({ success: false, message: 'You can only review products you have purchased and that have been delivered.' });
            }

            const alreadyReviewed = await Review.findOne({ product: productId, user: userId });
            if (alreadyReviewed) {
                return res.status(400).json({ success: false, message: 'You have already reviewed this product.' });
            }

            const review = await Review.create({
                product: productId,
                user: userId,
                rating: Number(rating),
                comment,
            });

            const reviews = await Review.find({ product: productId });
            product.reviews.push(review._id);
            product.numReviews = reviews.length;
            product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

            await product.save();
            res.status(201).json({ success: true, message: 'Review added successfully!' });
        } else {
            res.status(404).json({ success: false, message: 'Product not found.' });
        }
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (review) {
            // Check if the user owns the review
            if (review.user.toString() !== req.body.userId) {
                return res.status(401).json({ success: false, message: 'Not authorized' });
            }

            review.rating = rating || review.rating;
            review.comment = comment || review.comment;

            await review.save();

            // Recalculate product rating
            const product = await Product.findById(review.product);
            const reviews = await Review.find({ product: review.product });
            product.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
            await product.save();

            res.json({ success: true, message: 'Review updated' });
        } else {
            res.status(404).json({ success: false, message: 'Review not found' });
        }
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
};


// @desc    Get reviews for a product
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId }).populate('user', 'name').sort({ createdAt: -1 });
        res.json({ success: true, reviews });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later.' });
    }
};

// @desc    Check if a user can review a product
// @route   GET /api/reviews/can-review/:productId
// @access  Private
export const checkReviewEligibility = async (req, res) => {
    try {
        const userId = req.body.userId;
        const productId = req.params.productId;

        const hasPurchased = await Order.findOne({
            userId,
            'items.product': productId,
            status: 'Delivered',
        });

        if (!hasPurchased) {
            return res.json({ success: true, canReview: false, hasReviewed: false, review: null });
        }

        const existingReview = await Review.findOne({ user: userId, product: productId });

        res.json({
            success: true,
            canReview: true,
            hasReviewed: !!existingReview,
            review: existingReview || null,
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
