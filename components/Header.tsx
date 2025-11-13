import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBagIcon } from '../constants';
import Tooltip from './Tooltip';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
  cartItemCount: number;
  onCartClick: () => void;
  onAdminClick: () => void;
  onSellerDashboardClick: () => void;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onSearch, cartItemCount, onCartClick, onAdminClick, onSellerDashboardClick, onProfileClick }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCartItemCount = useRef(cartItemCount);

  useEffect(() => {
    if (cartItemCount > prevCartItemCount.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400);
      return () => clearTimeout(timer);
    }
    prevCartItemCount.current = cartItemCount;
  }, [cartItemCount]);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Vian</span>
            <span className="text-2xl font-light text-slate-600">Store</span>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-end">
            <div className="max-w-md w-full lg:max-w-xs">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="search"
                  className="block w-full bg-white bg-opacity-50 py-2 pl-10 pr-3 border border-slate-300 rounded-md leading-5 text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                  placeholder="Search"
                  type="search"
                  name="search"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="ml-4 flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-4">
                {user.role === 'admin' && (
                  <Tooltip text="Manage store, products, and users">
                    <button onClick={onAdminClick} className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-primary">
                      Admin Panel
                    </button>
                  </Tooltip>
                )}
                 {user.role === 'seller' && (
                   <Tooltip text="Manage your products and view sales">
                    <button onClick={onSellerDashboardClick} className="hidden sm:inline-block text-sm font-medium text-slate-600 hover:text-primary">
                      Seller Dashboard
                    </button>
                  </Tooltip>
                )}
                 <Tooltip text="View your profile and order history">
                   <button onClick={onProfileClick} className="hidden sm:inline-block text-sm text-slate-500 hover:text-primary transition-colors">
                    Welcome, {user.username}
                  </button>
                 </Tooltip>
                 <Tooltip text="Sign out of your account">
                    <button onClick={onLogout} className="text-sm font-medium text-slate-600 hover:text-primary">
                      Logout
                    </button>
                 </Tooltip>
              </div>
            )}
             <Tooltip text="View Cart">
              <button onClick={onCartClick} className={`group -m-2 p-2 flex items-center relative ${isAnimating ? 'animate-cart-bump' : ''}`}>
                <ShoppingBagIcon className="h-6 w-6 flex-shrink-0 text-slate-600 group-hover:text-primary transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-secondary text-white text-xs rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
                <span className="sr-only">items in cart, view bag</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
