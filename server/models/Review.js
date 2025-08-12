import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'product' },
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
}, { timestamps: true });

const Review = mongoose.models.review || mongoose.model('review', reviewSchema);

export default Review;
