import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BrandPromise from '../components/BrandPromise';

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BrandPromise />
    </div>
  )
}

export default Home
