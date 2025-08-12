import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import { Toaster } from "react-hot-toast";
import Footer from './components/Footer';
import { useAppContext } from './context/AppContext';
import Login from './components/Login';
import AllProducts from './pages/AllProducts';
import ProductCategory from './pages/ProductCategory';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import AddAddress from './pages/AddAddress';
import MyOrders from './pages/MyOrders';
import SellerLogin from './components/seller/SellerLogin';
import SellerLayout from './pages/seller/SellerLayout';
import AddProduct from './pages/seller/AddProduct';
import ProductList from './pages/seller/ProductList';
import Orders from './pages/seller/Orders';
import Loading from './components/Loading';
import Chatbot from './components/Chatbot';
import SupportRequests from './pages/seller/SupportRequests';
import Wishlist from './pages/Wishlist'; // Import the new Wishlist page
import FAQ from './pages/FAQ';
import OrderSuccessPopup from './components/OrderSuccessPopup';

const App = () => {

  const isAdminPath = useLocation().pathname.includes("admin");
  const {showUserLogin, isSeller, showOrderSuccess} = useAppContext()

  return (
    <div className='text-default min-h-screen text-gray-700 bg-background'>

     {isAdminPath ? null : <Navbar/>}
     {(!isAdminPath && showUserLogin) && <Login/>}
     {showOrderSuccess && <OrderSuccessPopup />}
     <Toaster />

      <div className={`${isAdminPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/products' element={<AllProducts/>} />
          <Route path='/products/:category' element={<ProductCategory/>} />
          <Route path='/products/:category/:id' element={<ProductDetails/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/wishlist' element={<Wishlist/>} /> {/* Added Wishlist Route */}
          <Route path='/add-address' element={<AddAddress/>} />
          <Route path='/my-orders' element={<MyOrders/>} />
          <Route path='/loader' element={<Loading/>} />
          <Route path='/faq' element={<FAQ/>} />
          <Route path='/admin' element={isSeller ? <SellerLayout/> : <SellerLogin/>}>
            <Route index element={isSeller ? <AddProduct/> : null} />
            <Route path='product-list' element={<ProductList/>} />
            <Route path='orders' element={<Orders/>} />
            <Route path='support-requests' element={<SupportRequests />} />
          </Route>
        </Routes>
      </div>
      {!isAdminPath && <Footer/>}
      {!isAdminPath && <Chatbot />}
    </div>
  )
}

export default App;