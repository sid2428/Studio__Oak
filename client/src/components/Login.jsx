import React, { useState, useEffect } from 'react';
import { useAppContext } from "../context/AppContext";
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, navigate, axios, initialLoginMode } = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        setIsLogin(initialLoginMode === 'login');
    }, [initialLoginMode]);


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/api/user/login' : '/api/user/register';
        try {
            const { data } = await axios.post(endpoint, formData);

            if (data.success) {
                if (isLogin) {
                    toast.success('Login Successful');
                    setUser(data.user);
                    setShowUserLogin(false);
                    navigate('/');
                } else {
                    toast.success(data.message);
                    setShowOtpInput(true);
                }
            } else {
                 if (data.isNotVerified) {
                    toast.error(data.message);
                    setShowOtpInput(true);
                    setIsLogin(false);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/user/verify-otp', { email: formData.email, token: otp });
            if (data.success) {
                toast.success('Email verified successfully! You can now log in.');
                setShowOtpInput(false);
                setIsLogin(true);
                setOtp('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred during OTP verification');
        }
    };

    const handleGoogleSignIn = () => {
        window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/google`;
    };

    const resendOtp = async () => {
        try {
            const { data } = await axios.post('/api/user/request-otp', { email: formData.email });
            if (data.success) {
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
             toast.error(error.response?.data?.message || 'Failed to resend OTP');
        }
    }

    // --- The change is in the className of this div below ---
    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-up" onClick={() => setShowUserLogin(false)}>
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {showOtpInput ? 'Verify Your Email' : (isLogin ? 'Welcome Back' : 'Create an Account')}
                </h2>

                {showOtpInput ? (
                    <form onSubmit={handleOtpSubmit}>
                        <p className="text-center text-gray-600 mb-4">An OTP has been sent to <strong>{formData.email}</strong>. Please enter it below.</p>
                        <div className="mb-4">
                            <label htmlFor="otp" className="block text-gray-700 font-medium">OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-dull transition duration-200 font-semibold"
                        >
                            Verify OTP
                        </button>
                        <div className="text-center mt-4">
                           <button type="button" onClick={resendOtp} className="text-sm text-primary hover:underline">Resend OTP</button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label htmlFor="name" className="block text-gray-700 font-medium">Name</label>
                                <input
                                    type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium">Email</label>
                            <input
                                type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                            <input
                                type="password" id="password" name="password" value={formData.password} onChange={handleChange} required
                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-primary text-white py-2.5 rounded-md hover:bg-primary-dull transition duration-200 font-semibold"
                        >
                            {isLogin ? 'Login' : 'Sign Up'}
                        </button>
                    </form>
                )}

                {!showOtpInput && (
                    <>
                        <div className="mt-4 text-center text-sm">
                            <p className="text-gray-600">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                                <span
                                    className="text-primary font-semibold cursor-pointer ml-1 hover:underline"
                                    onClick={() => setIsLogin(!isLogin)}
                                >
                                    {isLogin ? 'Sign Up' : 'Login'}
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
                            className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition duration-200 font-semibold"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 48 48">
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.53-4.18 7.09-10.36 7.09-17.65z"></path><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.82l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path><path fill="none" d="M0 0h48v48H0z"></path>
                            </svg>
                            Continue with Google
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Login;