import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [initialLoginMode, setInitialLoginMode] = useState('login'); // New state
    const [products, setProducts] = useState([])
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [showOrderSuccess, setShowOrderSuccess] = useState(false);


    const [cartItems, setCartItems] = useState({})
    const [searchQuery, setSearchQuery] = useState('')
    const [wishlist, setWishlist] = useState([]);

    // --- AUTH & DATA FETCHING ---

    const fetchSeller = async () => {
        try {
            const { data } = await axios.get('/api/seller/is-auth');
            setIsSeller(data.success);
        } catch (error) {
            setIsSeller(false);
        }
    };

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('api/user/is-auth');
            if (data.success) {
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/product/list');
            if (data.success) {
                setProducts(data.products);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/coupon/list');
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
        }
    };

    const fetchWishlist = async () => {
        if (!user) return;
        try {
            const { data } = await axios.get('/api/user/wishlist');
            if (data.success) {
                setWishlist(data.wishlist.map(item => item._id));
            }
        } catch (error) {
            // Silently fail as it's not critical for app function
        }
    };

    useEffect(() => {
        fetchUser();
        fetchSeller();
        fetchProducts();
        fetchCoupons();
    }, []);

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist([]); // Clear wishlist on logout
        }
    }, [user]);


    // --- CART MANAGEMENT ---

    const addToCart = async (itemId) => {
        const product = products.find((p) => p._id === itemId);
        const currentQuantityInCart = cartItems[itemId] || 0;

        if (product && currentQuantityInCart + 1 > product.stock) {
            toast.error(`We have only ${product.stock} items in stock right now!`);
            return;
        }

        const prevCartItems = { ...cartItems };
        setCartItems(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        toast.success("Added to Cart");

        try {
            await axios.post('/api/product/increment-cart-count', { id: itemId });
            if (user) {
                await axios.post('/api/cart/update', { cartItems: { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 } });
            }
        } catch (error) {
            toast.error("Failed to update cart. Please try again.");
            setCartItems(prevCartItems);
        }
    };

    const removeFromCart = async (itemId) => {
        const prevCartItems = { ...cartItems };
        setCartItems(prev => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
        toast.success("Removed from Cart");

        try {
            const newCart = { ...cartItems };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1;
            } else {
                delete newCart[itemId];
            }
            if (user) {
                await axios.post('/api/cart/update', { cartItems: newCart });
            }
        } catch (error) {
            toast.error("Failed to update cart. Please try again.");
            setCartItems(prevCartItems);
        }
    };

    const updateCartItem = (itemId, quantity) => {
        const product = products.find((p) => p._id === itemId);
        const oldQuantity = cartItems[itemId] || 0;

        if (product && quantity > product.stock + oldQuantity) {
            toast.error(`We have only ${product.stock} items in stock right now!`);
            return;
        }
        setCartItems(prev => ({...prev, [itemId]: quantity}));
        toast.success("Cart Updated");
    };

    const getCartCount = () => Object.values(cartItems).reduce((acc, count) => acc + count, 0);

    const getCartAmount = () => {
        return products.reduce((total, product) => {
            if (cartItems[product._id]) {
                return total + product.offerPrice * cartItems[product._id];
            }
            return total;
        }, 0);
    };

    useEffect(() => {
        if (user) {
            axios.post('/api/cart/update', { cartItems });
        }
    }, [cartItems, user]);


    // --- WISHLIST MANAGEMENT ---

    const addToWishlist = async (productId) => {
        if (!user) {
            toast.error("Please login to add items to your wishlist.");
            setShowUserLogin(true);
            return;
        }
        const prevWishlist = [...wishlist];
        setWishlist(prev => [...prev, productId]);
        toast.success("Added to your wishlist!");
        try {
            await axios.post('/api/user/wishlist/add', { productId });
        } catch (error) {
            toast.error("Something went wrong");
            setWishlist(prevWishlist);
        }
    };

    const removeFromWishlist = async (productId) => {
        const prevWishlist = [...wishlist];
        setWishlist(prev => prev.filter(id => id !== productId));
        toast.success("Removed from your wishlist!");
        try {
            await axios.post('/api/user/wishlist/remove', { productId });
        } catch (error) {
            toast.error("Something went wrong");
            setWishlist(prevWishlist);
        }
    };

    // --- ADMIN/SELLER ---
    const increaseStock = async (itemId, quantity) => {
        try {
            await axios.post('/api/product/increase-stock', { id: itemId, quantity });
            fetchProducts();
            toast.success("Stock Increased");
        } catch (error) {
            toast.error("Failed to increase stock");
        }
    };


    const value = {
        navigate, user, setUser, setIsSeller, isSeller,
        showUserLogin, setShowUserLogin, initialLoginMode, setInitialLoginMode, products, currency, addToCart, updateCartItem, removeFromCart, cartItems, searchQuery, setSearchQuery, getCartAmount, getCartCount, axios, fetchProducts, setCartItems, increaseStock,
        wishlist, addToWishlist, removeFromWishlist, isChatbotOpen, setIsChatbotOpen, coupons, showOrderSuccess, setShowOrderSuccess, fetchUser
    }

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

export const useAppContext = () => {
    return useContext(AppContext);
}