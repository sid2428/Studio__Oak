import React, { useState, useEffect, useRef } from 'react'; // NEW: Import useEffect and useRef
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const MainBanner = () => {
  // NEW: Get products list from context
  const { setSearchQuery, navigate, products } = useAppContext();
  const [query, setQuery] = useState('');
  // NEW: State to hold the list of suggestions
  const [suggestions, setSuggestions] = useState([]);
  // NEW: Ref to detect clicks outside the search component
  const searchContainerRef = useRef(null);

  const searchHandler = (e) => {
    e.preventDefault();
    setSearchQuery(query);
    setSuggestions([]); // Clear suggestions on search
    navigate('/products');
  };

  // NEW: This function runs every time the user types in the search bar
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      // Filter products based on the input
      const filteredSuggestions = products.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      // Clear suggestions if the input is empty
      setSuggestions([]);
    }
  };

  // NEW: This function runs when a user clicks on a suggestion
  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setSuggestions([]); // Hide suggestions list
    // Navigate directly to the product's detail page
    navigate(`/products/${product.category.toLowerCase()}/${product._id}`);
  };

  // NEW: This effect handles closing the suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  return (
    <div className="relative w-full min-h-screen">
      <img
        src={assets.main_banner}
        alt="banner"
        className="w-full h-full object-cover rounded-2xl"
      />
      <div className="absolute inset-0 bg-black/25 rounded-2xl"></div>
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center text-white p-4 pt-32 md:pt-48">

        {/* NEW: Added a ref to the form's parent div */}
        <div ref={searchContainerRef} className="relative w-full max-w-lg mb-8 animate-fadeInUp">
          <form onSubmit={searchHandler}>
            <input
              type="text"
              placeholder="Search for products..."
              value={query}
              onChange={handleInputChange} // NEW: Changed to our new handler
              autoComplete="off" // NEW: Prevents browser's default suggestions
              className="w-full pl-5 pr-12 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-md text-sm sm:text-base text-white placeholder-white/80 border border-white/40 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-all"
            />
            <button type="submit" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </button>
          </form>

          {/* NEW: This block displays the suggestions dropdown */}
          {suggestions.length > 0 && (
            <ul className="absolute top-full mt-2 w-full bg-white/20 backdrop-blur-md text-left rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <h1 className="text-cyan-50 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 animate-fadeInUp">
          Beautiful Furniture <br /> For Your Home
        </h1>
        <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-light mb-8 max-w-2xl animate-fadeInUp delay-200">
          Discover a curated collection of our finest products and exclusive deals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fadeInUp delay-400">
          <Link
            to="/products"
            className="
              inline-flex items-center justify-center gap-3
              px-8 py-3 text-sm
              sm:px-10 sm:py-4 sm:text-base
              font-semibold rounded-full
              bg-amber-700 hover:bg-amber-800
              text-white shadow-lg
              transition transform hover:scale-105 duration-300
              w-full sm:w-auto
            "
          >
            Shop Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
          <Link
            to="/products"
            className="
              inline-flex items-center justify-center gap-3
              px-8 py-3 text-sm
              sm:px-10 sm:py-4 sm:text-base
              font-semibold rounded-full
              bg-transparent
              border-2 border-white/40 hover:border-white
              text-white hover:bg-white/10
              transition transform hover:scale-105 duration-300
              w-full sm:w-auto
            "
          >
            Explore Deals
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MainBanner;