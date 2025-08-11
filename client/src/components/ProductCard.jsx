import React from "react";
import { useAppContext } from "../context/AppContext";

// Heart Icon for Wishlist
const HeartIcon = ({ isFilled, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" 
         fill={isFilled ? 'currentColor' : 'none'} 
         stroke="currentColor" 
         strokeWidth="2" 
         strokeLinecap="round" 
         strokeLinejoin="round"
         className={isFilled ? 'text-red-500' : 'text-stone-600'}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate, wishlist, addToWishlist, removeFromWishlist } = useAppContext();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isWishlisted = wishlist.includes(product._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };

  return (
    product && (
      <div
        className={`group relative border border-border rounded-lg p-3 bg-white w-full transition-shadow duration-300 hover:shadow-xl flex flex-col justify-between ${isOutOfStock ? 'opacity-70' : ''}`}
      >
        <button 
            onClick={handleWishlistClick} 
            className="absolute top-2 right-2 p-1.5 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white/80 transition-colors z-10"
            aria-label="Toggle Wishlist"
        >
            <HeartIcon isFilled={isWishlisted} />
        </button>

        {isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Out of Stock</span>
        )}
        {isLowStock && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">Only {product.stock} left!</span>
        )}

        <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); window.scrollTo(0, 0); }} className="cursor-pointer">
          <div className="flex items-center justify-center px-2 aspect-square">
            <img
              className="group-hover:scale-105 transition-transform duration-300 max-h-full"
              src={product.image[0]}
              alt={product.name}
            />
          </div>
          <div className="text-sm mt-2">
            <p className="text-text-secondary">{product.category}</p>
            <p className="text-text-primary font-medium text-lg truncate w-full">{product.name}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <div className="flex flex-col">
            <p className="md:text-lg text-base font-medium text-[#815a58]">
              {currency}{product.offerPrice}
            </p>
            <p className="text-xs text-text-secondary line-through">
              {currency}{product.price}
            </p>
          </div>
          
          <div onClick={(e) => e.stopPropagation()}>
            {!isOutOfStock ? (
                !cartItems[product._id] ? (
                <button
                    className="px-4 py-1.5 bg-[#815a58] text-white rounded-md cursor-pointer hover:bg-[#6c4c4a] transition-colors text-sm font-semibold"
                    onClick={() => addToCart(product._id)}
                >
                    Add
                </button>
                ) : (
                <div className="flex items-center justify-center gap-2 w-auto h-8 bg-gray-100 rounded-full select-none px-1">
                    <button onClick={() => removeFromCart(product._id)} className="cursor-pointer text-lg px-2 text-[#815a58]">-</button>
                    <span className="w-5 text-center text-base text-text-primary">{cartItems[product._id]}</span>
                    <button onClick={() => addToCart(product._id)} className="cursor-pointer text-lg px-2 text-[#815a58]">+</button>
                </div>
                )
            ) : (
                <button
                    disabled
                    className="px-4 py-1.5 bg-gray-400 text-white rounded-md cursor-not-allowed text-sm font-semibold"
                >
                    Out of Stock
                </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default ProductCard;
