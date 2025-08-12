import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAppContext } from "../context/AppContext";

const Login = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { loginUser } = useAppContext();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const response = await axios.post('/api/user/login', formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success('Login Successful');
                    loginUser(response.data.user);
                    navigate('/');
                } else {
                    toast.error(response.data.message);
                }
            } else {
                const response = await axios.post('/api/user/register', formData, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                });
                if (response.data.success) {
                    toast.success(response.data.message);
                    setShowOtpInput(true);
                } else {
                    toast.error(response.data.message);
                }
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/user/verify-otp', { email: formData.email, token: otp }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            if (response.data.success) {
                toast.success('Email verified successfully! You can now log in.');
                setShowOtpInput(false);
                setIsLogin(true); // Switch to login form
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred during OTP verification');
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = `${process.env.VITE_BACKEND_URL}/api/user/auth/google`;
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {showOtpInput ? (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700">OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
                        >
                            Verify OTP
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        {!isLogin && (
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-gray-700">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                                />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-700">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
                        >
                            {isLogin ? 'Login' : 'Register'}
                        </button>
                    </form>
                )}

                <div className="mt-4 text-center">
                    <p>
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                        <span
                            className="text-indigo-500 cursor-pointer ml-1"
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setShowOtpInput(false);
                            }}
                        >
                            {isLogin ? 'Register' : 'Login'}
                        </span>
                    </p>
                </div>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">OR</span>
                    </div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-red-500 text-white py-2 rounded-md flex items-center justify-center hover:bg-red-600 transition duration-200"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 48 48"
                        width="24px"
                        height="24px"
                        className="mr-2"
                    >
                        <path
                            fill="#FFC107"
                            d="M43.611 20.083H42V20H24v8h11.303c-1.614 3.018-4.856 5.372-8.52 5.372-5.187 0-9.404-4.14-9.404-9.25C17.382 17.159 21.579 13 26.69 13c3.084 0 5.86 1.745 7.37 4.303l5.88-5.71C35.253 6.945 30.222 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.34-0.138-2.65-0.389-3.917z"
                        />
                        <path
                            fill="#FF3D00"
                            d="M6.306 14.691L14.69 20.083l5.88-5.71c-1.51-2.558-4.286-4.303-7.37-4.303C12.955 4 4 12.955 4 24c0 1.34 0.138 2.65 0.389 3.917L4.793 28.5H42V20h-1.389c-0.25-1.267-0.389-2.577-0.389-3.917 0-4.664 2.876-8.681 6.98-10.985L43.611 20.083H42V20H24v8h11.303c-1.614 3.018-4.856 5.372-8.52 5.372-5.187 0-9.404-4.14-9.404-9.25C17.382 17.159 21.579 13 26.69 13c3.084 0 5.86 1.745 7.37 4.303l5.88-5.71C35.253 6.945 30.222 4 24 4z"
                        />
                        <path
                            fill="#000000"
                            d="M24 4C12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.34-0.138-2.65-0.389-3.917L43.611 20.083H42V20H24v8h11.303c-1.614 3.018-4.856 5.372-8.52 5.372-5.187 0-9.404-4.14-9.404-9.25C17.382 17.159 21.579 13 26.69 13c3.084 0 5.86 1.745 7.37 4.303l5.88-5.71C35.253 6.945 30.222 4 24 4z"
                        />
                    </svg>
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;