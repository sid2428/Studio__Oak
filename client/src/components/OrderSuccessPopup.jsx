import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';

// Sparkle Icon for the background animation
const SparkleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 0L61.2 38.8L100 50L61.2 61.2L50 100L38.8 61.2L0 50L38.8 38.8L50 0Z" fill="url(#sparkle-gradient)"/>
        <defs>
            <linearGradient id="sparkle-gradient" x1="50" y1="0" x2="50" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD700"/>
                <stop offset="1" stopColor="#FFA500"/>
            </linearGradient>
        </defs>
    </svg>
);

const OrderSuccessPopup = () => {
    const { showOrderSuccess, setShowOrderSuccess, navigate } = useAppContext();
    const [animationState, setAnimationState] = useState('loading');
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (showOrderSuccess) {
            // 1. Start the success animation (spinner -> tick) after a short delay
            const animationTimer = setTimeout(() => {
                setAnimationState('success');
            }, 1800); // Duration of spinner rotations

            // 2. Show the text content after the tick animation starts
            const contentTimer = setTimeout(() => {
                setShowContent(true);
            }, 2000); // Timed to appear as the tick draws

            // 3. Close the popup and navigate after the full animation completes
            const closeTimer = setTimeout(() => {
                setShowOrderSuccess(false);
                navigate('/my-orders');
            }, 4000); // Increased total duration for better visibility

            return () => {
                clearTimeout(animationTimer);
                clearTimeout(contentTimer);
                clearTimeout(closeTimer);
            };
        }
    }, [showOrderSuccess, setShowOrderSuccess, navigate]);

    if (!showOrderSuccess) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full transform transition-all animate-fade-in-up">
                {/* Sparkle Animations will show with the content */}
                {showContent && (
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl pointer-events-none">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="sparkle" style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`,
                            }}>
                                <SparkleIcon />
                            </div>
                        ))}
                    </div>
                )}

                {/* Dynamic Spinner-to-Tick Animation */}
                <div className="w-20 h-20 mx-auto mb-4">
                    <svg className={`success-animation ${animationState}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle className="success-animation__circle" cx="26" cy="26" r="25" fill="none"/>
                        <path className="success-animation__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                </div>

                {/* Conditionally render text with animation */}
                {showContent && (
                    <div className="animate-content-fade-in">
                        <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Hurray!
                        </h2>
                        <p className="text-gray-600 mt-2">
                            Your order has been placed successfully.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderSuccessPopup;
