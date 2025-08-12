import React from 'react';

const Rating = ({ value, text }) => {
    return (
        <div className="flex items-center my-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={value >= star ? 'text-yellow-400' : 'text-gray-300'}>
                    <i className="fas fa-star"></i>
                </span>
            ))}
            {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
        </div>
    );
};

export default Rating;
