import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AddReviewModal = ({ productId, existingReview, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { axios } = useAppContext();

    const isEditing = !!existingReview;

    useEffect(() => {
        if (isEditing) {
            setRating(existingReview.rating);
            setComment(existingReview.comment);
        }
    }, [existingReview, isEditing]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error('Please select a star rating.');
            return;
        }
        
        try {
            let data;
            if (isEditing) {
                // **FIX**: Send a PUT request to the update route
                const response = await axios.put(`/api/reviews/${existingReview._id}`, { rating, comment });
                data = response.data;
            } else {
                // Create new review
                const response = await axios.post('/api/reviews', { productId, rating, comment });
                data = response.data;
            }

            if (data.success) {
                toast.success(data.message);
                onReviewSubmitted();
                onClose();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg w-full max-w-md transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {isEditing ? 'Edit Your Review' : 'Write a Customer Review'}
                </h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Your Rating</label>
                        <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star} className="text-3xl cursor-pointer" onClick={() => setRating(star)}>
                                    <i className={`fas fa-star transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}></i>
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2" htmlFor="comment">Your Comment</label>
                        <textarea
                            id="comment"
                            rows="4"
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your thoughts about the product..."
                            required
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dull transition">
                            {isEditing ? 'Update Review' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReviewModal;
