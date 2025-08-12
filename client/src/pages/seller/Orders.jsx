import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

// --- ICONS ---
const ChevronDownIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

// --- STATUS INDICATOR ---
const StatusIndicator = ({ status }) => {
    const statusConfig = {
        'Order Placed': { icon: '📦', color: 'bg-blue-100 text-blue-800' },
        'Processing': { icon: '⚙️', color: 'bg-yellow-100 text-yellow-800' },
        'Shipped': { icon: '🚚', color: 'bg-indigo-100 text-indigo-800' },
        'Delivered': { icon: '✅', color: 'bg-green-100 text-green-800' },
        'Cancelled': { icon: '❌', color: 'bg-red-100 text-red-800' },
    };
    const { icon, color } = statusConfig[status] || { icon: '📦', color: 'bg-gray-100 text-gray-800' };

    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full inline-flex items-center gap-1.5 ${color}`}>
            <span>{icon}</span>
            {status}
        </span>
    );
};


const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/seller');
            if (data.success) {
                const validOrders = data.orders.filter(order =>
                    order.items.every(item => item.product)
                );
                setOrders(validOrders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            toast.error("Failed to fetch orders. Please try again later.");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { data } = await axios.post('/api/order/status', { orderId, status: newStatus });
            if (data.success) {
                toast.success(data.message);
                fetchOrders(); // Re-fetch orders to show the updated status
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update order status.");
        }
    };

    const getPaymentStatus = (order) => {
        if (order.isPaid) {
            return { text: 'Paid', className: 'bg-green-100 text-green-800' };
        }
        if (order.paymentType === 'COD' && order.status === 'Delivered') {
            return { text: 'Paid', className: 'bg-green-100 text-green-800' };
        }
        return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
    };


    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md min-h-screen">
            <h2 className="text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Customer Orders
            </h2>
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => {
                        const paymentStatus = getPaymentStatus(order);
                        const isFinalStatus = order.status === 'Delivered' || order.status === 'Cancelled';

                        return (
                            <div key={order._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                <div className="p-4 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleOrderDetails(order._id)}>
                                    <div className="flex flex-wrap justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <UserIcon />
                                                <span className="font-semibold text-lg">{order.address.firstName} {order.address.lastName}</span>
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                <p><strong>Order ID:</strong> #{order._id.slice(-6)}</p>
                                                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-4">
                                            <div className="flex flex-col items-end">
                                                <p className="text-xl font-bold text-primary">{currency}{order.amount}</p>
                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${paymentStatus.className}`}>
                                                    {paymentStatus.text}
                                                </span>
                                            </div>
                                            <ChevronDownIcon className={`w-6 h-6 text-gray-500 transition-transform duration-300 ${expandedOrderId === order._id ? 'transform rotate-180' : ''}`} />
                                        </div>
                                    </div>
                                    {/* Display Current Status in Header */}
                                    <div className="mt-2">
                                       <StatusIndicator status={order.status} />
                                    </div>
                                </div>

                                {expandedOrderId === order._id && (
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Order Items</h4>
                                                <ul className="space-y-3">
                                                    {order.items.map((item) => (
                                                        <li key={item.product._id} className="flex items-center gap-4">
                                                            <img src={item.product.image[0]} alt={item.product.name} className="w-14 h-14 rounded-md object-cover border border-gray-200" />
                                                            <div>
                                                                <p className="font-medium text-gray-900">{item.product.name}</p>
                                                                <p className="text-sm text-gray-500">Qty: {item.quantity || "1"} · Price: {currency}{item.product.offerPrice}</p>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Shipping Address</h4>
                                                <div className="text-sm text-gray-700 leading-relaxed">
                                                    <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                                    <p>{order.address.street}, {order.address.city}</p>
                                                    <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                                    <p className="mt-2"><strong>Phone:</strong> {order.address.phone}</p>
                                                </div>
                                                <div className="mt-4">
                                                    <label htmlFor={`status-${order._id}`} className="block text-sm font-medium text-gray-700">Update Status</label>
                                                    <select
                                                        id={`status-${order._id}`}
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                        disabled={isFinalStatus}
                                                        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${isFinalStatus ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                                    >
                                                        <option>Order Placed</option>
                                                        <option>Processing</option>
                                                        <option>Shipped</option>
                                                        <option>Delivered</option>
                                                        <option>Cancelled</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md border border-gray-200">
                    <p className="text-gray-500 text-lg">No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default Orders;