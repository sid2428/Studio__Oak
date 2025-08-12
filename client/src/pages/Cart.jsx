import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";
import CouponModal from "../components/CouponModal"; // Import the new modal

const Cart = () => {
    const {products, currency, cartItems, removeFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems, coupons, setShowOrderSuccess} = useAppContext()
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")
    const [discount, setDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

    const getCart = ()=>{
        let tempArray = []
        for(const key in cartItems){
            const product = products.find((item)=>item._id === key)
            if (product) {
                product.quantity = cartItems[key]
                tempArray.push(product)
            }
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async ()=>{
        try {
            const {data} = await axios.get('/api/address/get');
            if (data.success){
                setAddresses(data.addresses)
                if(data.addresses.length > 0){
                    setSelectedAddress(data.addresses[0])
                }
            }else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
        }
    }

    const applyCoupon = async (code) => {
        const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
        if (coupon) {
            if (coupon.oneTimeUse && user && user.hasUsedFirstOrderCoupon) {
                toast.error("This coupon has already been used.");
                return;
            }
            const cartAmount = getCartAmount();
            if (cartAmount >= coupon.minPurchase) {
                const discountAmount = cartAmount * (coupon.discount / 100);
                setDiscount(discountAmount);
                setAppliedCoupon(coupon);
                toast.success("Coupon applied!");
            } else {
                toast.error(`Minimum purchase of ${currency}${coupon.minPurchase} required.`);
            }
        } else {
            toast.error("Invalid coupon code.");
        }
    };

    const removeCoupon = () => {
        setDiscount(0);
        setAppliedCoupon(null);
        toast.success("Coupon removed.");
    };

    const placeOrder = async ()=>{
        try {
            if(!selectedAddress){
                return toast.error("Please select an address")
            }

            // Place Order with COD
            if(paymentOption === "COD"){
                const {data} = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id,
                    couponCode: appliedCoupon ? appliedCoupon.code : ""
                })

                if(data.success){
                    toast.success(data.message)
                    setCartItems({})
                    setShowOrderSuccess(true);
                }else{
                    toast.error(data.message)
                }
            }else{
                // Place Order with Stripe
                const {data} = await axios.post('/api/order/stripe', {
                    userId: user._id,
                    items: cartArray.map(item=> ({product: item._id, quantity: item.quantity})),
                    address: selectedAddress._id,
                    couponCode: appliedCoupon ? appliedCoupon.code : ""
                })

                if(data.success){
                    window.location.replace(data.url)
                }else{
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        if(products.length > 0 && cartItems){
            getCart()
        }
    },[products, cartItems])


    useEffect(()=>{
        if(user){
            getUserAddress()
        }
    },[user])

    const isAnyItemOutOfStock = cartArray.some(product => product.stock < product.quantity);
    
    return products.length > 0 && cartItems ? (
        <>
            <CouponModal 
                isOpen={isCouponModalOpen}
                onClose={() => setIsCouponModalOpen(false)}
                coupons={coupons}
                applyCoupon={applyCoupon}
                user={user}
                cartAmount={getCartAmount()}
                currency={currency}
            />
            <div className="flex flex-col md:flex-row mt-16">
                <div className='flex-1 max-w-4xl'>
                    <h1 className="text-3xl font-medium mb-6">
                        Shopping Cart <span className="text-sm text-primary">{getCartCount()} Items</span>
                    </h1>

                    <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                        <p className="text-left">Product Details</p>
                        <p className="text-center">Subtotal</p>
                        <p className="text-center">Action</p>
                    </div>

                    {cartArray.map((product, index) => {
                        const isOutOfStock = product.stock < product.quantity;
                        return (
                            <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                                <div className="flex items-center md:gap-6 gap-3">
                                    <div onClick={()=>{
                                        navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0,0)
                                    }} className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                        <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                                    </div>
                                    <div>
                                        <p className="hidden md:block font-semibold">{product.name}</p>
                                        {isOutOfStock && <p className="text-red-500 text-xs font-semibold mt-1">Out of Stock</p>}
                                        <div className="font-normal text-gray-500/70">
                                            <p>Weight: <span>{product.weight || "N/A"}</span></p>
                                            <div className='flex items-center'>
                                                <p>Qty:</p>
                                                <select
                                                    onChange={e => updateCartItem(product._id, Number(e.target.value))}
                                                    value={cartItems[product._id]}
                                                    className='outline-none bg-transparent disabled:bg-gray-100 disabled:cursor-not-allowed'
                                                    disabled={isOutOfStock}
                                                >
                                                    {Array(cartItems[product._id] > 9 ? cartItems[product._id] : 9).fill('').map((_, index) => (
                                                        <option key={index} value={index + 1}>{index + 1}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-center">{currency}{product.offerPrice * product.quantity}</p>
                                <button onClick={()=> removeFromCart(product._id)} className="cursor-pointer mx-auto">
                                    <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6" />
                                </button>
                            </div>
                        )
                    })}

                    <button onClick={()=> {navigate("/products"); scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                        <img className="group-hover:-translate-x-1 transition" src={assets.arrow_right_icon_colored} alt="arrow" />
                        Continue Shopping
                    </button>

                </div>

                <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                    <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                    <hr className="border-gray-300 my-5" />

                    <div className="mb-6">
                        <p className="text-sm font-medium uppercase">Delivery Address</p>
                        <div className="relative flex justify-between items-start mt-2">
                            <p className="text-gray-500">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                            <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                                Change
                            </button>
                            {showAddress && (
                                <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address, index)=>(
                                    <p key={index} onClick={() => {setSelectedAddress(address); setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                )) }
                                    <p onClick={() => navigate("/add-address")} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                        Add address
                                    </p>
                                </div>
                            )}
                        </div>

                        <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                        <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                            <option value="COD">Cash On Delivery</option>
                            <option value="Online">Online Payment</option>
                        </select>
                    
                        <div className="mt-6">
                            {!appliedCoupon ? (
                                <button onClick={() => setIsCouponModalOpen(true)} className="w-full border-2 border-dashed border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/10 transition">
                                    Apply Coupon
                                </button>
                            ) : (
                                    <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg transition-all animate-fade-in-up">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-bold flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="font-mono bg-white px-2 py-1 rounded-md text-green-900">{appliedCoupon.code}</span>
                                                    <span className="ml-1">applied!</span>
                                                </p>
                                                <p className="text-sm mt-1 ml-1">You're saving {currency}{discount.toFixed(2)} on this order.</p>
                                            </div>
                                            <button onClick={removeCoupon} className="text-sm font-semibold text-red-600 hover:text-red-800 transition-transform hover:scale-110">
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                            )}
                        </div>

                    </div>

                    <hr className="border-gray-300" />

                    <div className="text-gray-500 mt-4 space-y-2">
                        <p className="flex justify-between">
                            <span>Price</span><span>{currency}{getCartAmount()}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Discount</span><span className="text-green-600">-{currency}{discount.toFixed(2)}</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Shipping Fee</span><span className="text-green-600">Free</span>
                        </p>
                        <p className="flex justify-between">
                            <span>Tax (2%)</span><span>{currency}{(getCartAmount() - discount) * 2 / 100}</span>
                        </p>
                        <p className="flex justify-between text-lg font-medium mt-3">
                            <span>Total Amount:</span><span>
                                {currency}{(getCartAmount() - discount) + (getCartAmount() - discount) * 2 / 100}</span>
                        </p>
                    </div>

                    <button 
                        onClick={placeOrder} 
                        disabled={isAnyItemOutOfStock}
                        className="w-full py-3 mt-6 cursor-pointer bg-primary text-white font-medium hover:bg-primary-dull transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                    </button>
                    {isAnyItemOutOfStock && (
                        <p className="text-red-500 text-xs text-center mt-2">
                            Please remove out-of-stock items to proceed.
                        </p>
                    )}
                </div>
            </div>
        </>
    ) : null
}

export default Cart;