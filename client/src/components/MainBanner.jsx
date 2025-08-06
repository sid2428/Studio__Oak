import React from 'react';
// Assuming 'assets' and 'Link' are correctly configured in your project
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const MainBanner = () => {
  return (
    // Main container is now full-screen height and takes up the full width.
    // The relative positioning allows the overlay and content to be placed on top.
    <div className="relative w-full min-h-screen">

      {/* Full-screen banner image with object-cover to maintain aspect ratio,
          and rounded corners. */}
      <img
        src={assets.main_banner}
        alt="banner"
        className="w-full h-full object-cover rounded-2xl"
      />

      {/* Dark overlay with higher opacity for better text contrast */}
      <div className="absolute inset-0 bg-black/25 rounded-2xl"></div>

      {/* Centered content container for text and buttons.
          Adjusted padding to move the content higher up. */}
      <div className="absolute inset-0 flex flex-col items-center justify-start text-center text-white p-4 pt-32 md:pt-48">

        {/* Search bar with a frosted glass effect */}
        <div className="relative w-full max-w-lg mb-8 animate-fadeInUp">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full pl-5 pr-12 py-3 sm:py-4 rounded-full bg-white/20 backdrop-blur-md text-sm sm:text-base text-white placeholder-white/80 border border-white/40 focus:outline-none focus:border-white focus:ring-2 focus:ring-white/50 transition-all"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
        </div>

        {/* Headline text - large, bold, and responsive.
            The line break is now always visible. */}
        <h1 className="text-cyan-50 text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold mb-4 animate-fadeInUp">
          Beautiful Furniture <br /> For Your Home
        </h1>


        {/* Subtitle text - provides a clear, supporting message */}
        <p className="text-md sm:text-lg md:text-xl lg:text-2xl font-light mb-8 max-w-2xl animate-fadeInUp delay-200">
          Discover a curated collection of our finest products and exclusive deals.
        </p>

        {/* Button container with flexible layout for responsiveness */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 animate-fadeInUp delay-400">

          {/* "Shop Now" - Primary call-to-action button */}
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

          {/* "Explore deals" - Secondary call-to-action button */}
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
