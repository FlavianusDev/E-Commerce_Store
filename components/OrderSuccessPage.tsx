import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';

interface PurchasedItemImageProps {
  item: CartItem;
}

const PurchasedItemImage: React.FC<PurchasedItemImageProps> = ({ item }) => {
  const [imageSrc, setImageSrc] = useState(item.imageUrl);
  useEffect(() => {
    setImageSrc(item.imageUrl);
  }, [item.imageUrl]);

  const handleImageError = () => {
    const placeholderUrl = `https://via.placeholder.com/48x48.png?text=${encodeURIComponent(item.name)}`;
    setImageSrc(placeholderUrl);
  };

  return (
    <img 
      src={imageSrc} 
      onError={handleImageError} 
      alt={item.name} 
      className="w-12 h-12 rounded-md object-cover mr-4"
    />
  );
};

interface OrderSuccessPageProps {
  purchasedItems: CartItem[];
  onContinueShopping: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ purchasedItems, onContinueShopping }) => {
  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 text-center animate-fade-in">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <svg className="w-16 h-16 mx-auto text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Thank you for your order!</h1>
        <p className="text-slate-600 mt-2">Your payment was successful. You can download your purchased items below.</p>

        <div className="mt-8 text-left border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Your Downloads</h2>
          <ul className="space-y-4">
            {purchasedItems.map(item => (
              <li key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                <div className="flex items-center">
                  <PurchasedItemImage item={item} />
                  <span>{item.name}</span>
                </div>
                <a 
                  href={item.fileUrl} 
                  download 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          <button onClick={onContinueShopping} className="w-full bg-secondary text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md">
            Continue Shopping
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccessPage;