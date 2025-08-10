import React from "react";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  // Determine if product is out of stock or low in stock
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    product && (
      <div
        className={`group border border-border rounded-lg p-3 bg-white w-full transition-shadow duration-300 hover:shadow-xl flex flex-col justify-between ${isOutOfStock ? 'opacity-70' : ''}`}
      >
        {/* Out of Stock and Low Stock Badges */}
        {isOutOfStock && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">Out of Stock</span>
        )}
        {isLowStock && (
            <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">Only {product.stock} left!</span>
        )}

        {/* Clickable area for product details */}
        <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0); }} className="cursor-pointer">
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

        {/* Action area with price and button */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          
          {/* Price section now includes original price */}
          <div className="flex flex-col">
            <p className="md:text-lg text-base font-medium text-[#815a58]">
              {currency}{product.offerPrice}
            </p>
            <p className="text-xs text-text-secondary line-through">
              {currency}{product.price}
            </p>
          </div>
          
          <div onClick={(e) => { e.stopPropagation(); }}>
            {/* Logic to show add/remove buttons or 'Out of Stock' based on status */}
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
                    <button
                    onClick={() => { removeFromCart(product._id); }}
                    className="cursor-pointer text-lg px-2 text-[#815a58]"
                    >
                    -
                    </button>
                    <span className="w-5 text-center text-base text-text-primary">
                    {cartItems[product._id]}
                    </span>
                    <button
                    onClick={() => { addToCart(product._id); }}
                    className="cursor-pointer text-lg px-2 text-[#815a58]"
                    >
                    +
                    </button>
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
