import React, { useState, useEffect, useRef } from 'react';
import { CartItem } from '../types';
import { XMarkIcon, PlusIcon, MinusIcon } from '../constants';
import Tooltip from './Tooltip';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckout: () => void;
}

const CartItemImage: React.FC<{ item: CartItem }> = ({ item }) => {
  const [imageSrc, setImageSrc] = useState(item.imageUrl);
  useEffect(() => {
    setImageSrc(item.imageUrl);
  }, [item.imageUrl]);

  const handleImageError = () => {
    const placeholderUrl = `https://via.placeholder.com/96x96.png?text=${encodeURIComponent(item.name)}`;
    setImageSrc(placeholderUrl);
  };

  return (
    <img 
      src={imageSrc} 
      onError={handleImageError} 
      alt={item.name} 
      className="h-full w-full object-cover object-center" 
    />
  );
};

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const prevSubtotal = useRef(subtotal);

  useEffect(() => {
    if (subtotal !== prevSubtotal.current) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 600);
      prevSubtotal.current = subtotal;
      return () => clearTimeout(timer);
    }
  }, [subtotal]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className={`relative w-screen max-w-md transform transition ease-in-out duration-300 ${isOpen ? 'animate-slide-in' : 'animate-slide-out'}`}>
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
            <div className="flex-1 py-6 px-4 sm:px-6">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-medium text-gray-900" id="slide-over-title">Shopping cart</h2>
                <div className="ml-3 h-7 flex items-center">
                  <button type="button" className="-m-2 p-2 text-gray-400 hover:text-gray-500" onClick={onClose}>
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="mt-8">
                <div className="flow-root">
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <li key={item.cartItemId} className="py-6 flex">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <CartItemImage item={item} />
                          </div>
                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{item.name}</h3>
                                <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                               {Object.keys(item.selectedVariations).length > 0 && (
                                <p className="mt-1 text-sm text-slate-500">
                                  {Object.entries(item.selectedVariations).map(([key, value]) => `${key}: ${value}`).join(', ')}
                                </p>
                              )}
                            </div>
                            <div className="flex-1 flex items-center justify-between text-sm mt-2">
                              <div className="flex items-center border border-gray-200 rounded">
                                <Tooltip text="Decrease quantity">
                                  <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)} className="p-1 text-gray-500 hover:text-gray-700"><MinusIcon className="w-4 h-4" /></button>
                                </Tooltip>
                                <span className="px-3 text-gray-700">{item.quantity}</span>
                                <Tooltip text="Increase quantity">
                                  <button onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)} className="p-1 text-gray-500 hover:text-gray-700"><PlusIcon className="w-4 h-4"/></button>
                                </Tooltip>
                              </div>
                              <div className="flex">
                                <Tooltip text="Remove from cart">
                                  <button onClick={() => onRemoveItem(item.cartItemId)} type="button" className="font-medium text-primary hover:text-primary-hover">Remove</button>
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-10">Your cart is empty.</p>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                <div className={`flex justify-between text-base font-medium text-gray-900 rounded-md -m-2 p-2 transition-colors ${isFlashing ? 'animate-flash' : ''}`}>
                  <p>Subtotal</p>
                  <p>${subtotal.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                <div className="mt-6">
                  <button onClick={onCheckout} className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-hover">Checkout</button>
                </div>
                <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
                  <p>or <button type="button" className="text-primary font-medium hover:text-primary-hover" onClick={onClose}>Continue Shopping<span aria-hidden="true"> &rarr;</span></button></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;