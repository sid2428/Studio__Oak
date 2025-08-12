import React, { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import AddReviewModal from '../components/AddReviewModal'; // Import the modal
import toast from 'react-hot-toast';

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([]);
    const { currency, axios, user } = useAppContext();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);

    const fetchMyOrders = useCallback(async () => {
        if (user) {
            try {
                const { data } = await axios.get('/api/order/user');
                if (data.success) {
                    const validOrders = data.orders.filter(order => 
                        order.items.every(item => item.product)
                    );
                    setMyOrders(validOrders);
                }
            } catch (error) {
                console.error("Failed to fetch orders:", error);
                toast.error("Could not load your orders.");
            }
        }
    }, [user, axios]);

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    const handleWriteReview = (productId) => {
        setSelectedProductId(productId);
        setShowReviewModal(true);
    };
    
    const onReviewSubmitted = () => {
        // You can optionally refresh orders or just close the modal
        // For now, we'll just show a success message as the review is submitted.
        toast.success("Thank you for your feedback!");
    }

    return (
        <div className='mt-16 pb-16'>
            {showReviewModal && <AddReviewModal productId={selectedProductId} onClose={() => setShowReviewModal(false)} onReviewSubmitted={onReviewSubmitted} />}
            <div className='flex flex-col items-start w-max mb-8'>
                <p className='text-3xl font-bold text-gray-800' style={{ fontFamily: "'Playfair Display', serif" }}>My Orders</p>
                <div className='w-24 h-1 bg-primary rounded-full mt-2'></div>
            </div>
            {myOrders.length > 0 ? (
                myOrders.map((order) => (
                    <div key={order._id} className='border border-gray-200 bg-white rounded-lg mb-10 p-6 shadow-sm max-w-4xl'>
                        <div className='flex justify-between items-center mb-4'>
                            <div>
                                <p className='font-semibold text-lg text-gray-800'>Order #{order._id.slice(-6)}</p>
                                <p className='text-sm text-gray-500'>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className='text-right'>
                                <p className='text-xl font-bold text-primary'>{currency}{order.amount}</p>
                                <p className='text-sm text-gray-500'>Payment: {order.paymentType}</p>
                            </div>
                        </div>

                        {order.items.map((item, index) => (
                            <div key={index}
                                className={`relative flex items-center justify-between p-4 my-2 rounded-lg bg-gray-50 ${order.items.length !== index + 1 && "border-b"} border-gray-200`}>
                                <div className='flex items-center gap-4'>
                                    <div className='w-16 h-16 bg-white p-1 rounded-md border border-gray-200'>
                                        <img src={item.product.image[0]} alt={item.product.name} className='w-full h-full object-cover rounded-md' />
                                    </div>
                                    <div>
                                        <h2 className='text-lg font-semibold text-gray-800'>{item.product.name}</h2>
                                        <p className="text-sm text-gray-500">Category: {item.product.category}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity || "1"}</p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <p className='text-primary text-lg font-medium'>
                                        {currency}{item.product.offerPrice * item.quantity}
                                    </p>
                                    <p className={`text-sm font-semibold ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {order.status}
                                    </p>
                                    {order.status === 'Delivered' && (
                                        <button onClick={() => handleWriteReview(item.product._id)} className="mt-2 text-sm text-primary hover:underline font-semibold">
                                            Write a Review
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <div className='flex justify-center items-center h-[50vh] bg-white rounded-lg shadow-sm'>
                    <p className='text-xl font-medium text-gray-500'>No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
