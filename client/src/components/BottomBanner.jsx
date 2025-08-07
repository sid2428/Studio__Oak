import React from 'react';
import { assets, features } from '../assets/assets';

const BottomBanner = () => {
  return (
    <section 
      className="bottom-banner-professional mt-24 py-16 sm:py-24"
      style={{ backgroundImage: `url(${assets.subtle_pattern})` }}
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Headline & Description */}
        <div className="text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-stone-800 font-serif leading-tight">
            Designed for Living,<br />Built for Life.
          </h2>
          <p className="text-lg text-stone-600 mt-4 max-w-md mx-auto lg:mx-0">
            We believe furniture should be more than functional. It should be a cornerstone of your home, reflecting your style and standing the test of time.
          </p>
        </div>

        {/* Right Column: Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="feature-card-pro p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-stone-200/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 bg-amber-100 rounded-full h-12 w-12 flex items-center justify-center text-amber-800">
                  <img src={feature.icon} alt={`${feature.title} icon`} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-stone-800 font-serif mb-1">{feature.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BottomBanner;