import React from 'react';

const CouponModal = ({ isOpen, onClose, coupons, applyCoupon, user, cartAmount, currency }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" 
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all animate-fade-in-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Apply Coupon
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
                    {coupons.length > 0 ? coupons.map(coupon => {
                        const isEligible = cartAmount >= coupon.minPurchase;
                        const isUsed = coupon.oneTimeUse && user?.hasUsedFirstOrderCoupon;
                        const isDisabled = !isEligible || isUsed;

                        return (
                            <div key={coupon.code} className={`p-4 border rounded-lg transition-all ${isDisabled ? 'bg-gray-100 opacity-60' : 'bg-green-50'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-mono font-bold text-primary border-2 border-dashed border-primary/50 px-2 py-1 rounded">
                                                {coupon.code}
                                            </span>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-800 mt-2">
                                            Get {coupon.discount}% OFF on orders above {currency}{coupon.minPurchase}
                                        </p>
                                        {isUsed && <p className="text-xs text-red-500 mt-1">You have already used this coupon.</p>}
                                        {!isEligible && !isUsed && <p className="text-xs text-red-500 mt-1">Add items worth {currency}{coupon.minPurchase - cartAmount} more to apply.</p>}
                                    </div>
                                    <button 
                                        onClick={() => {
                                            applyCoupon(coupon.code);
                                            onClose();
                                        }}
                                        disabled={isDisabled}
                                        className="text-sm font-bold text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                                    >
                                        APPLY
                                    </button>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No coupons available at the moment.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouponModal;