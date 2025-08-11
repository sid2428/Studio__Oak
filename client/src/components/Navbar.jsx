import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

// Custom SVG icons
const Icons = {
  Menu: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>),
  X: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>),
  User: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>),
  ShoppingCart: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 1.95 1.61h9.73a2 2 0 0 0 1.95-1.61L23 6H6"></path></svg>),
  Box: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>),
  LogOut: () => (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>),
  Heart: () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>)
};

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const mobileDrawerRef = useRef(null);

  const { user, setUser, setShowUserLogin, navigate, getCartCount, axios, setIsChatbotOpen } = useAppContext();

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target) && drawerOpen) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [drawerOpen]);

  const linkStyles = ({ isActive }) =>
    `text-stone-600 hover:text-stone-900 transition-colors text-lg ${isActive ? 'font-bold text-stone-900' : ''}`;

  const dropdownItemStyles = 'flex items-center gap-3 p-3 px-4 transition-all duration-200 hover:bg-stone-200 cursor-pointer text-stone-800';
  
  const handleContactClick = (e) => {
    e.preventDefault();
    setIsChatbotOpen(true);
    setDrawerOpen(false); // Close mobile drawer if open
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-stone-200">
        <nav className="relative w-full max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-start">
            <NavLink to="/" className={linkStyles}>Home</NavLink>
            <NavLink to="/products" className={linkStyles}>Shop</NavLink>
            <a href="#" onClick={handleContactClick} className="text-stone-600 hover:text-stone-900 transition-colors text-lg">Contact Us</a>
            <NavLink to="/admin" className={linkStyles}>Become an Admin</NavLink>
          </div>

          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex-shrink-0">
            <NavLink to="/" style={{ fontFamily: "'Playfair Display', serif" }} className="text-3xl md:text-4xl text-stone-800 tracking-wide">
              Studio Oak
            </NavLink>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 flex-1 justify-end">
            <div onClick={() => navigate('/wishlist')} className="relative cursor-pointer transition-transform duration-300 hover:scale-110">
              <span className="text-stone-800"><Icons.Heart /></span>
            </div>

            <div onClick={() => navigate('/cart')} className="relative cursor-pointer transition-transform duration-300 hover:scale-110">
              <span className="text-stone-800"><Icons.ShoppingCart /></span>
              {getCartCount() > 0 && 
                <span className="absolute -top-1 -right-2 text-xs text-white bg-stone-800 font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {getCartCount()}
                </span>
              }
            </div>

            {!user ? (
                <button onClick={() => setShowUserLogin(true)} className="focus:outline-none transition-transform duration-300 hover:scale-110 p-1">
                    <span className="text-stone-800"><Icons.User /></span>
                </button>
            ) : (
              <div className="relative" ref={profileDropdownRef}>
                <button onClick={() => setProfileDropdownOpen(p => !p)} className="focus:outline-none transition-transform duration-300 hover:scale-110 p-1">
                  <span className="text-stone-800"><Icons.User /></span>
                </button>
                {profileDropdownOpen && (
                  <div className="absolute top-10 right-0 mt-2 w-48 bg-stone-50 border border-stone-200 rounded-lg shadow-xl z-40 transition-all duration-300 origin-top-right animate-fade-in-up">
                    <ul className="py-1">
                      <li onClick={() => { navigate('/my-orders'); setProfileDropdownOpen(false); }} className={dropdownItemStyles}>
                        <Icons.Box /> My Orders
                      </li>
                      <li onClick={() => { logout(); setProfileDropdownOpen(false); }} className={dropdownItemStyles}>
                        <Icons.LogOut /> Logout
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            <button onClick={() => setDrawerOpen(true)} aria-label="Menu" className="p-1 text-stone-800 lg:hidden">
                <Icons.Menu />
            </button>
          </div>
        </nav>
      </header>

      <div ref={mobileDrawerRef} className={`fixed top-0 right-0 h-full w-64 bg-stone-50 shadow-xl transition-transform duration-300 ease-in-out z-40 lg:hidden ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800" style={{ fontFamily: "'Playfair Display', serif" }}>Menu</h2>
          <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" className="p-1 text-stone-800"><Icons.X /></button>
        </div>
        <div className="flex flex-col p-4 space-y-4">
          <NavLink to="/" onClick={() => setDrawerOpen(false)} className="text-xl text-stone-700">Home</NavLink>
          <NavLink to="/products" onClick={() => setDrawerOpen(false)} className="text-xl text-stone-700">Shop</NavLink>
          <a href="#" onClick={handleContactClick} className="text-xl text-stone-700">Contact Us</a>
          <NavLink to="/admin" onClick={() => setDrawerOpen(false)} className="text-xl text-stone-700">Become an Admin</NavLink>
          {user && (<NavLink to="/my-orders" onClick={() => setDrawerOpen(false)} className="text-xl text-stone-700">My Orders</NavLink>)}
          <div className="pt-4 border-t border-stone-200">
            {!user ? (
              <button onClick={() => { setDrawerOpen(false); setShowUserLogin(true); }} className="w-full px-6 py-2 bg-stone-800 hover:bg-stone-700 transition text-white rounded-full font-medium shadow-lg">Login</button>
            ) : (
              <button onClick={() => { logout(); setDrawerOpen(false); }} className="w-full px-6 py-2 bg-stone-800 hover:bg-stone-700 transition text-white rounded-full font-medium shadow-lg">Logout</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
