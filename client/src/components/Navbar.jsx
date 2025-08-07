import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Custom SVG icons for a cleaner, more consistent visual style
const Icons = {
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  ),
  X: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
      <circle cx="12" cy="7" r="4"></circle>
    </svg>
  ),
  ShoppingCart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"></circle>
      <circle cx="20" cy="21" r="1"></circle>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 1.95 1.61h9.73a2 2 0 0 0 1.95-1.61L23 6H6"></path>
    </svg>
  )
};

const Navbar = () => {
  // State to manage the open/close state of the mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  // State to manage the open/close state of the user profile dropdown
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  // Destructure values from the AppContext
  const { user, setUser, setShowUserLogin, navigate, searchQuery, getCartCount, axios } = useAppContext();

  // Handle user logout
  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Handle closing the mobile drawer or profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown if click is outside
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      // Close mobile drawer if click is outside
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target) && drawerOpen) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [drawerOpen]);

  // Common styles for navigation links
  const linkStyles = ({ isActive }) =>
    `relative transition-all duration-300 font-medium font-serif text-lg text-stone-800 hover:text-amber-800
     ${isActive ? 'font-bold text-amber-800' : ''}`;

  // Common styles for dropdown items
  const dropdownItemStyles = 'flex items-center gap-3 p-3 px-4 font-serif transition-all duration-200 hover:bg-stone-200 cursor-pointer text-stone-800';

  return (
    <nav className="sticky top-0 z-50 bg-neutral-50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Left Side: Navigation Links */}
        <div className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={linkStyles}>Home</NavLink>
          <NavLink to="/products" className={linkStyles}>All Product</NavLink>
          <NavLink to="/admin" className={linkStyles}>Become an Admin</NavLink>
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <NavLink to="/" className="flex-shrink-0" onClick={() => setDrawerOpen(false)}>
            <img className="h-10" src={assets.logo} alt="logo" />
          </NavLink>
        </div>

        {/* Right Side: Actions */}
        <div className="hidden md:flex items-center gap-8">
          {/* Cart Icon */}
          <div onClick={() => navigate('/cart')} className="relative cursor-pointer transition-transform duration-300 hover:scale-110">
            <span className="text-stone-800 hover:text-amber-800 transition-colors">
              <Icons.ShoppingCart />
            </span>
            <span className="absolute -top-2 -right-3 text-xs text-white bg-amber-800 font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </div>

          {/* User Profile / Login */}
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="px-8 py-2 bg-amber-700 hover:bg-amber-900 transition text-white rounded-full font-medium font-serif shadow-lg hover:shadow-xl"
            >
              User Login
            </button>
          ) : (
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="focus:outline-none transition-transform duration-300 hover:scale-110 p-2 rounded-full"
              >
                <span className="text-stone-800">
                  <Icons.User />
                </span>
              </button>
              {profileDropdownOpen && (
                <div className="absolute top-10 right-0 mt-2 w-48 bg-neutral-50 border border-stone-300 rounded-lg shadow-xl z-40 transition-all duration-300 origin-top-right animate-fade-in-up">
                  <ul className="py-1">
                    <li
                      onClick={() => {
                        navigate('/my-orders');
                        setProfileDropdownOpen(false);
                      }}
                      className={dropdownItemStyles}
                    >
                      <img src={assets.bag_icon} className="h-5" alt="My Orders" />
                      My Orders
                    </li>
                    <li
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className={dropdownItemStyles}
                    >
                      <img src={assets.logout_icon} className="h-5" alt="Logout" />
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-6">
          {/* Cart Icon for mobile */}
          <div onClick={() => navigate('/cart')} className="relative cursor-pointer transition-transform duration-300 hover:scale-110">
            <span className="text-stone-800 hover:text-amber-800 transition-colors">
              <Icons.ShoppingCart />
            </span>
            <span className="absolute -top-2 -right-3 text-xs text-white bg-amber-800 font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {getCartCount()}
            </span>
          </div>
          {/* Mobile Menu Button */}
          <button onClick={() => setDrawerOpen(!drawerOpen)} aria-label="Menu" className="p-1 text-stone-800 hover:text-amber-800 transition-colors">
            {drawerOpen ? <Icons.X /> : <Icons.Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        ref={mobileDrawerRef}
        className={`fixed top-0 left-0 h-full w-64 bg-neutral-50 shadow-xl transition-transform duration-300 ease-in-out z-40 md:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-300">
          <NavLink to="/" onClick={() => setDrawerOpen(false)}>
            <img className="h-9" src={assets.logo} alt="logo" />
          </NavLink>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-1 text-stone-800 hover:text-amber-800 transition-colors">
            <Icons.X />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <NavLink to="/" onClick={() => setDrawerOpen(false)} className="text-lg font-medium font-serif text-stone-800 hover:text-amber-800">Home</NavLink>
          <NavLink to="/products" onClick={() => setDrawerOpen(false)} className="text-lg font-medium font-serif text-stone-800 hover:text-amber-800">All Product</NavLink>
          {user && (
            <NavLink to="/my-orders" onClick={() => setDrawerOpen(false)} className="text-lg font-medium font-serif text-stone-800 hover:text-amber-800">My Orders</NavLink>
          )}
          <NavLink to="/admin" onClick={() => setDrawerOpen(false)} className="text-lg font-medium font-serif text-stone-800 hover:text-amber-800">Become an Admin</NavLink>
          
          <div className="pt-4 border-t border-stone-300">
            {!user ? (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  setShowUserLogin(true);
                }}
                className="w-full px-6 py-2 bg-amber-800 hover:bg-amber-900 transition text-white rounded-full font-medium shadow-lg"
              >
                User Login
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setDrawerOpen(false);
                }}
                className="w-full px-6 py-2 bg-amber-800 hover:bg-amber-900 transition text-white rounded-full font-medium shadow-lg"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;