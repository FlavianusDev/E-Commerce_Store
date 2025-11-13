import React, { useState, useEffect } from 'react';
import { CartItem, User } from '../types';

interface CheckoutPageProps {
  cartItems: CartItem[];
  user: User;
  onBackToStore: () => void;
  onCheckout: () => void; // This will now trigger the PayPal modal
  onUpdateUser: (user: User) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ cartItems, user, onBackToStore, onCheckout, onUpdateUser }) => {
  const [shippingAddress, setShippingAddress] = useState(user.shippingAddress);

  useEffect(() => {
    // If user updates address on this page, save it back to their profile
    // This check prevents an infinite loop on component mount
    if (user.shippingAddress !== shippingAddress) {
      onUpdateUser({ ...user, shippingAddress });
    }
  }, [shippingAddress, onUpdateUser, user]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const taxes = subtotal * 0.1; // Example 10% tax
  const total = subtotal + taxes;

  const handleCheckoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onCheckout();
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div className="mb-6">
        <button onClick={onBackToStore} className="text-primary font-medium hover:text-primary-hover">
          &larr; Back to Store
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side: Shipping Information */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Shipping Information</h2>
          <div>
            <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
            <textarea
              id="shippingAddress"
              rows={4}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              required
            />
             <p className="mt-2 text-xs text-slate-500">
                Your updated address will be saved to your profile.
            </p>
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white p-8 rounded-lg shadow-sm h-fit lg:sticky lg:top-24">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.cartItemId} className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            <div className="border-t pt-6 space-y-2">
              <div className="flex justify-between text-slate-600">
                <p>Subtotal</p>
                <p>${subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between text-slate-600">
                <p>Taxes</p>
                <p>${taxes.toFixed(2)}</p>
              </div>
              <div className="flex justify-between font-bold text-lg text-slate-900 border-t pt-4 mt-2">
                <p>Total</p>
                <p>${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleCheckoutClick}
            className="mt-8 w-full bg-[#0070ba] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005ea6] transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.062 13.235c.108-.598.42-1.722.905-2.122.485-.4 1.19-.603 1.936-.603h.36c.21 0 .396.11.492.302l.68 1.343c.092.18.267.288.45.288h.92c.39 0 .626-.4.436-.73l-2.04-3.62c-.19-.33-.53-.448-.868-.29-1.55.72-2.38 2.05-2.735 3.28-.27 1.02-.04 2.03.65 2.5.69.47 1.61.47 2.5.47h.74c.48 0 .82-.28.9-.76l.09-.54c0-.04 0-.07-.04-.07h-1.39c-.58 0-1.01-.33-1.12-.9z" fill="#009cde"></path>
              <path d="M6.342 12.836c.108-.598.42-1.722.905-2.122.485-.4 1.19-.603 1.936-.603h.36c.21 0 .396.11.492.302l.68 1.343c.092.18.267.288.45.288h.92c.39 0 .626-.4.436-.73l-2.04-3.62c-.19-.33-.53-.448-.868-.29-1.55.72-2.38 2.05-2.735 3.28-.27 1.02-.04 2.03.65 2.5.69.47 1.61.47 2.5.47h.74c.48 0 .82-.28.9-.76l.09-.54c0-.04 0-.07-.04-.07h-1.39c-.58 0-1.01-.33-1.12-.9z" fill="#002f86"></path>
              <path d="M15.48 7.21h-2.12c-.52 0-.81.24-.96.75l-1.88 9.01c-.11.48.22.84.7.84h1.4c.33 0 .6-.21.7-.62l.22-1.04.04-.17c.1-.5.53-.87 1.06-.87h.84c1.17 0 2.05-.72 2.26-1.9.15-.82-.16-1.54-.74-1.95-.58-.41-1.37-.64-2.22-.64h-.82c-.35 0-.62-.2-.72-.5l-.3-1.34c-.06-.29.13-.5.42-.5z" fill="#002f86"></path>
            </svg>
            Pay with PayPal
          </button>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;