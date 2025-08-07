import React from 'react';
import { assets, features } from '../assets/assets';

const BrandPromise = () => {
  return (
    <section 
      className="brand-promise-moodboard mt-24"
      style={{ backgroundImage: `url(${assets.moodboard_bg})` }}
    >
      {/* A single container to center our showcase card */}
      <div className="showcase-container">
        
        {/* The unified showcase card with a refined glass effect */}
        <div className="showcase-card">
          
          {/* Internal grid for clear hierarchy */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">

            {/* Left Side (2/3 width): Our Core Principles */}
            <div className="lg:col-span-2">
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

            {/* Right Side (1/3 width): Newsletter CTA with a visual separator */}
            <div className="lg:border-l lg:border-stone-900/10 lg:pl-8">
              <h3 className="text-2xl font-bold text-stone-800 font-serif">Stay Inspired</h3>
              <p className="text-stone-600 mt-1 mb-5 text-sm">
                Join our newsletter for new arrivals and members-only offers.
              </p>
              <form>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-white/80 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 transition mb-2"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-semibold rounded-md transition-colors duration-300"
                >
                  Sign Up
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;