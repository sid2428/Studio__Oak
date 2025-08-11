import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";

// Heart Icon for Wishlist
const HeartIcon = ({ isFilled, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24"
         fill={isFilled ? 'currentColor' : 'none'}
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className={isFilled ? 'text-red-500' : 'text-stone-600'}>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
);


const ProductDetails = () => {
  const { products, navigate, currency, addToCart, cartItems, removeFromCart, wishlist, addToWishlist, removeFromWishlist } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const product = products.find((item) => item._id === id);

  const isOutOfStock = product?.stock <= 0;
  const isLowStock = product?.stock > 0 && product?.stock <= 5;
  const isWishlisted = wishlist.includes(product?._id);

  const handleWishlistClick = (e) => {
    e.stopPropagation(); // Prevents any parent onClick events from firing
    if (isWishlisted) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product._id);
    }
  };


  useEffect(() => {
    if (products.length > 0 && product) {
      let productsCopy = [...products];
      productsCopy = productsCopy.filter(
        (item) => product.category === item.category && item._id !== product._id
      );
      setRelatedProducts(productsCopy);
    }
  }, [products, product]);

  useEffect(() => {
    setThumbnail(product?.image[0] ? product.image[0] : null);
  }, [product]);

  return (
    product && (
      <div className="mt-12">
        <p className="text-sm text-gray-500">
          <Link to={"/"} className="hover:text-primary">Home</Link> /
          <Link to={"/products"} className="hover:text-primary"> Products</Link> /
          <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary"> {product.category}</Link> /
          <span className="text-gray-800 font-medium"> {product.name}</span>
        </p>

        <div className="flex flex-col md:flex-row gap-16 mt-6">
          {/* Image Section */}
          <div className="flex gap-4 flex-1">
            <div className="flex flex-col gap-3">
              {product.image.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setThumbnail(image)}
                  className={`border max-w-24 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${thumbnail === image ? 'border-primary shadow-md' : 'border-gray-300'}`}
                >
                  <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="relative border border-gray-300 rounded-lg overflow-hidden flex-grow">
              <img src={thumbnail} alt="Selected product" className="w-full h-full object-cover" />
               <button
                  onClick={handleWishlistClick}
                  className="absolute top-3 right-3 p-2 bg-white/60 backdrop-blur-sm rounded-full hover:bg-white/90 transition-colors z-10"
                  aria-label="Toggle Wishlist"
              >
                  <HeartIcon isFilled={isWishlisted} />
              </button>
            </div>
          </div>

          {/* Product Details Section */}
          <div className="w-full md:w-1/2 flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

            {isOutOfStock && (
                <span className="mt-4 text-xl font-bold text-red-500">Out of Stock</span>
            )}
            {isLowStock && (
                <span className="mt-4 text-lg font-bold text-yellow-600">Only {product.stock} left in stock!</span>
            )}

            <div className="mt-6">
              <p className="text-gray-500 line-through text-lg">
                MRP: {currency}{product.price}
              </p>
              <p className="text-3xl font-semibold text-primary">
                {currency}{product.offerPrice}
              </p>
              <span className="text-gray-500 text-sm">(inclusive of all taxes)</span>
            </div>

            <div className="mt-6">
              <p className="text-lg font-semibold text-gray-800">About This Product</p>
              <ul className="list-disc ml-5 text-gray-600 space-y-1 mt-2">
                {product.description.map((desc, index) => (
                  <li key={index}>{desc}</li>
                ))}
              </ul>
            </div>

            {/* MODIFIED: Added a disabled state for out-of-stock items */}
            <div className="flex items-center mt-10 gap-4 text-base">
              {!isOutOfStock ? (
                <>
                  {!cartItems[product._id] ? (
                    <button
                      onClick={() => addToCart(product._id)}
                      className="w-full py-3.5 font-semibold bg-primary text-white rounded-lg hover:bg-primary-dull transition-transform transform hover:scale-105"
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 border border-gray-300 rounded-lg p-2">
                      <button
                        onClick={() => removeFromCart(product._id)}
                        className="w-10 h-10 flex items-center justify-center text-xl bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="text-xl font-medium w-8 text-center">
                        {cartItems[product._id]}
                      </span>
                      <button
                        onClick={() => addToCart(product._id)}
                        className="w-10 h-10 flex items-center justify-center text-xl bg-gray-200 rounded-md hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      if (!cartItems[product._id]) {
                        addToCart(product._id);
                      }
                      navigate("/cart");
                    }}
                    className="w-full py-3.5 font-semibold bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-transform transform hover:scale-105"
                  >
                    Buy Now
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 font-semibold bg-gray-400 text-white rounded-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="flex flex-col items-center mt-20">
          <div className="flex flex-col items-center w-max">
            <p className="text-3xl font-medium">Related Products</p>
            <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:grid-cols-5 mt-8 w-full">
            {/* MODIFIED: Removed the filter to show related products regardless of stock */}
            {relatedProducts.map((product, index) => (
                <ProductCard key={index} product={product} />
            ))}
          </div>
          <button
            onClick={() => {
              navigate("/products");
              scrollTo(0, 0);
            }}
            className="mx-auto cursor-pointer px-12 my-16 py-3 border border-primary rounded-lg text-primary font-semibold hover:bg-primary/10 transition"
          >
            See More
          </button>
        </div>
      </div>
    )
  );
};

export default ProductDetails;