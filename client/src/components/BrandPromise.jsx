import React from 'react';
import { assets, features } from '../assets/assets';

const BrandPromise = () => {
  return (
    <section 
      className="brand-promise-moodboard mt-24"
      style={{ backgroundImage: `url(${assets.moodboard_bg})` }}
    >
      <div className="overlay-content">
        
        {/* Left Side: Floating Features Card (No changes here, but it will be affected by the CSS update) */}
        <div className="features-card">
          <h2 className="text-3xl font-bold text-stone-800 font-serif mb-6">Our Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-center gap-4">
                <div className="flex-shrink-0 bg-amber-100/70 rounded-full h-11 w-11 flex items-center justify-center text-amber-800">
                  <img src={feature.icon} alt={`${feature.title} icon`} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-stone-800 font-serif">{feature.title}</h3>
                  <p className="text-stone-600 text-sm">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Newsletter content is now wrapped in its own card for visibility and style consistency. */}
        <div className="newsletter-card">
          <h3 className="text-3xl font-bold text-stone-800 font-serif">Stay Inspired</h3>
          <p className="text-stone-600 mt-2 mb-6">
            Join our design newsletter for new arrivals, styling tips, and members-only offers.
          </p>
          <form className="flex items-center">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 bg-white/80 border border-stone-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-amber-700 transition"
              required
            />
            <button 
              type="submit" 
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-r-md transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;