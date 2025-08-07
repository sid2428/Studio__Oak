import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const SellerLogin = () => {
    const { isSeller, setIsSeller, navigate, axios } = useAppContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post('/api/seller/login', { email, password });
            if (data.success) {
                setIsSeller(true);
                navigate('/admin');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (isSeller) {
            navigate("/admin");
        }
    }, [isSeller]);

    return !isSeller && (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Admin Login</h2>
                <form onSubmit={onSubmitHandler} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}
                            type="email" 
                            placeholder="admin@example.com" 
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password}
                            type="password" 
                            placeholder="••••••••"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" 
                            required
                        />
                    </div>
                    <div>
                        <button 
                            type="submit" 
                            className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <button 
                        type="button" 
                        onClick={() => navigate("/")} 
                        className="text-sm text-primary hover:underline"
                    >
                        Return to Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerLogin;