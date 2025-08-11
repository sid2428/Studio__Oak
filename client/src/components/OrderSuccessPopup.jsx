import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

// Sparkle Icon for the animation
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

    useEffect(() => {
        if (showOrderSuccess) {
            const timer = setTimeout(() => {
                setShowOrderSuccess(false);
                navigate('/my-orders');
            }, 3000); // Popup will be visible for 3 seconds

            return () => clearTimeout(timer);
        }
    }, [showOrderSuccess, setShowOrderSuccess, navigate]);

    if (!showOrderSuccess) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 text-center max-w-sm w-full transform transition-all animate-fade-in-up">
                {/* Sparkle Animations */}
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

                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                     <svg className="w-10 h-10 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Hurray!
                </h2>
                <p className="text-gray-600 mt-2">
                    Your order has been placed successfully.
                </p>
            </div>
        </div>
    );
};

export default OrderSuccessPopup;
