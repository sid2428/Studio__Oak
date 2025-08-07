import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';

const CategoryCard = ({ category }) => {
  const { navigate } = useAppContext();

  return (
    <div
      className="category-showroom-card group"
      onClick={() => {
        navigate(`/products/${category.path}`);
        window.scrollTo(0, 0);
      }}
    >
      <img src={category.image} alt={category.text} className="card-image" />
      <div className="card-overlay-permanent"></div>
      <div className="card-content">
        <h3 className="card-title">{category.text}</h3>
        <p className="arrow-link">View Collection &rarr;</p>
      </div>
    </div>
  );
};

const Categories = () => {
  return (
    <div className='mt-24'>
      <div className='text-center mb-12'> {/* Increased bottom margin for better spacing */}
        <h2 className='text-3xl md:text-4xl font-bold text-stone-800 font-serif'>Design for Every Corner</h2>
        <p className='text-lg text-stone-500 mt-2'>Discover collections curated for your unique space.</p>
      </div>

      {/* The grid now directly displays all categories without any filters */}
      <div className="showroom-grid">
        {categories.map((category) => (
          <CategoryCard key={category.path} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Categories;