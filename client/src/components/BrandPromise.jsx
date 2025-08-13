import React from 'react';
import { assets, features } from '../assets/assets';
import toast from 'react-hot-toast'; // Import the toast library

const BrandPromise = () => {

  // Function to handle form submission
  const handleNewsletterSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    // You can add logic here to actually subscribe the user to a service
    toast.success("Thanks for subscribing to our newsletter!"); // Show a success message
    e.target.reset(); // Clear the input field
  };

  return (
    <section 
      className="brand-promise-moodboard mt-24"
      style={{ backgroundImage: `url(${assets.moodboard_bg})` }}
    >
      <div className="showcase-container">
        <div className="showcase-card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
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

            <div className="lg:border-l lg:border-stone-900/10 lg:pl-8">
              <h3 className="text-2xl font-bold text-stone-800 font-serif">Stay Inspired</h3>
              <p className="text-stone-600 mt-1 mb-5 text-sm">
                Join our newsletter for new arrivals and members-only offers.
              </p>
              {/* --- MODIFICATION START --- */}
              <form onSubmit={handleNewsletterSubmit}> 
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
                  Join Us
                </button>
              </form>
              {/* --- MODIFICATION END --- */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandPromise;