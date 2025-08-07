import React from "react";
import { useAppContext } from "../context/AppContext";

// An SVG component for the star icon to allow for color changes
const StarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd"/>
  </svg>
);

const ProductCard = ({ product }) => {
  const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext();

  return (
    product && (
      <div
        className="group border border-border rounded-lg p-3 bg-white w-full transition-shadow duration-300 hover:shadow-xl flex flex-col justify-between"
      >
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
            <div className="flex items-center gap-0.5">
              {Array(5).fill("").map((_, i) => (
                  <StarIcon key={i} className={`md:w-4 w-3.5 ${i < 4 ? 'text-amber-500' : 'text-gray-300'}`} />
              ))}
              <p className="text-text-secondary ml-1">(4)</p>
            </div>
          </div>
        </div>

        {/* Action area with price and button */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          
          {/* FIXED: Price section now includes original price */}
          <div className="flex flex-col">
            <p className="md:text-lg text-base font-medium text-amber-800">
              {currency}{product.offerPrice}
            </p>
            <p className="text-xs text-text-secondary line-through">
              {currency}{product.price}
            </p>
          </div>
          
          <div onClick={(e) => { e.stopPropagation(); }}>
            {!cartItems[product._id] ? (
              <button
                className="px-4 py-1.5 bg-amber-700 text-white rounded-md cursor-pointer hover:bg-amber-800 transition-colors text-sm font-semibold"
                onClick={() => addToCart(product._id)}
              >
                Add
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-auto h-8 bg-gray-100 rounded-full select-none px-1">
                <button
                  onClick={() => { removeFromCart(product._id); }}
                  className="cursor-pointer text-lg px-2 text-amber-800"
                >
                  -
                </button>
                <span className="w-5 text-center text-base text-text-primary">
                  {cartItems[product._id]}
                </span>
                <button
                  onClick={() => { addToCart(product._id); }}
                  className="cursor-pointer text-lg px-2 text-amber-800"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    )
  );
};

export default ProductCard;