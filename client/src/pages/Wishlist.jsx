import React from 'react';
import { useAppContext } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

// Funky SVG for the empty state
const SparkleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-stone-400">
        <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
    </svg>
);

const Wishlist = () => {
    const { wishlist, products, user } = useAppContext();

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-[70vh]">
                 <h2 className="text-3xl font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Login to see your wishlist
                </h2>
                <p className="text-stone-500 mt-2 max-w-sm">
                    Create an account or log in to save your favorite items for later.
                </p>
            </div>
        )
    }

    const wishlistedProducts = products.filter(product => wishlist.includes(product._id));

    if (wishlistedProducts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-[70vh]">
                <SparkleIcon />
                <h2 className="text-3xl font-bold text-stone-800 mt-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Your Wishlist is Empty RN
                </h2>
                <p className="text-stone-500 mt-2 max-w-sm">
                    Looks like you haven't added anything yet. Let's change that! Your next favorite piece is waiting for you.
                </p>
                <Link 
                    to="/products"
                    className="mt-6 px-8 py-3 bg-stone-800 text-white font-semibold rounded-full shadow-lg hover:bg-stone-700 transition-transform transform hover:scale-105"
                >
                    Explore Now
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-16 pb-16">
            <div className='flex flex-col items-start w-max mb-8'>
                <p className='text-3xl font-bold text-gray-800' style={{ fontFamily: "'Playfair Display', serif" }}>My Wishlist</p>
                <div className='w-24 h-1 bg-primary rounded-full mt-2'></div>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6'>
                {wishlistedProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
