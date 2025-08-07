import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import toast from 'react-hot-toast';

const Orders = () => {
    const { currency, axios } = useAppContext();
    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/seller');
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Customer Orders</h2>
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Order #{order._id.slice(-6)}</h3>
                                    <p className="text-sm text-gray-500">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">{currency}{order.amount}</p>
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.isPaid ? "Paid" : "Pending"}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="font-semibold mb-2">Items</h4>
                                    <ul className="space-y-2">
                                        {order.items.map((item) => (
                                            <li key={item.product._id} className="flex items-center gap-4">
                                                <img src={item.product.image[0]} alt={item.product.name} className="w-12 h-12 rounded object-cover" />
                                                <div>
                                                    <p className="font-medium">{item.product.name}</p>
                                                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                                    <div className="text-sm text-gray-600">
                                        <p className="font-medium">{order.address.firstName} {order.address.lastName}</p>
                                        <p>{order.address.street}, {order.address.city}</p>
                                        <p>{order.address.state}, {order.address.zipcode}, {order.address.country}</p>
                                        <p>Phone: {order.address.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default Orders;