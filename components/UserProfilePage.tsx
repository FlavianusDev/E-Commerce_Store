import React, { useState, useEffect, useMemo } from 'react';
import { User, Order, Product, PayoutDetails } from '../types';
import ProductCard from './ProductCard';
import { BanknotesIcon } from '../constants';

interface PayoutSettingsFormProps {
    user: User,
    onUpdatePayoutDetails: (userId: number, details: PayoutDetails) => void;
}
const PayoutSettingsForm: React.FC<PayoutSettingsFormProps> = ({ user, onUpdatePayoutDetails }) => {
    const [details, setDetails] = useState<PayoutDetails>(user.payoutDetails || { method: 'bank' });

    useEffect(() => {
        setDetails(user.payoutDetails || { method: 'bank' });
    }, [user.payoutDetails]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdatePayoutDetails(user.id, details);
    }
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Payout Settings</h2>
            <p className="text-sm text-slate-500 mb-4">This is where your earnings will be sent. Please ensure this information is accurate.</p>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label htmlFor="payoutMethod" className="block text-sm font-medium text-slate-700">Payout Method</label>
                    <select id="payoutMethod" value={details.method} onChange={e => setDetails({ ...details, method: e.target.value as 'bank' | 'paypal' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                        <option value="bank">Bank Account</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                {details.method === 'bank' && (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">Account Number</label>
                            <input type="text" id="accountNumber" placeholder="Account Number" value={details.accountNumber || ''} onChange={e => setDetails({...details, accountNumber: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="routingNumber" className="block text-sm font-medium text-gray-700">Routing Number</label>
                            <input type="text" id="routingNumber" placeholder="Routing Number" value={details.routingNumber || ''} onChange={e => setDetails({...details, routingNumber: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        </div>
                    </div>
                )}
                {details.method === 'paypal' && (
                    <div className="animate-fade-in">
                        <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700">PayPal Email</label>
                         <input type="email" id="paypalEmail" placeholder="PayPal Email Address" value={details.paypalEmail || ''} onChange={e => setDetails({...details, paypalEmail: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                )}
                 <button type="submit" className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md">
                    Save Payout Settings
                </button>
            </form>
        </div>
    )
}
interface UserProfilePageProps {
  user: User;
  orders: Order[];
  allProducts: Product[];
  onUpdateUser: (user: User) => void;
  onBackToStore: () => void;
  onAddToCart: (product: Product, selectedVariations: { [key: string]: string }) => void;
  onToggleWishlist: (productId: number) => void;
  onProductClick: (product: Product) => void;
  onUpdatePayoutDetails: (userId: number, details: PayoutDetails) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, orders, allProducts, onUpdateUser, onBackToStore, onAddToCart, onToggleWishlist, onProductClick, onUpdatePayoutDetails }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    shippingAddress: user.shippingAddress,
  });
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'payout'>('profile');

  const wishlistProducts = useMemo(() => {
    if (!user.wishlist) return [];
    return allProducts.filter(p => user.wishlist.includes(p.id));
  }, [allProducts, user.wishlist]);

  useEffect(() => {
    setFormData({
      name: user.name,
      shippingAddress: user.shippingAddress,
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({ ...user, ...formData });
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
      <button onClick={onBackToStore} className="text-primary font-medium hover:text-primary-hover mb-6">
        &larr; Back to Store
      </button>
      <h1 className="text-3xl font-bold text-slate-900 mb-8">My Account</h1>

      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-sm font-medium ${activeTab === 'profile' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Profile Details
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-sm font-medium ${activeTab === 'orders' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Order History
        </button>
         <button
          onClick={() => setActiveTab('wishlist')}
          className={`py-3 px-4 text-sm font-medium ${activeTab === 'wishlist' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Wishlist ({wishlistProducts.length})
        </button>
        {user.role === 'seller' && (
          <button
            onClick={() => setActiveTab('payout')}
            className={`flex items-center gap-2 py-3 px-4 text-sm font-medium ${activeTab === 'payout' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <BanknotesIcon className="w-5 h-5"/> Payout Settings
          </button>
        )}
      </div>

      <div>
        {activeTab === 'profile' && (
          <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Your Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="username"
                  value={user.username}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm cursor-not-allowed"
                />
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="shippingAddress" className="block text-sm font-medium text-gray-700">Shipping Address</label>
                <textarea
                  id="shippingAddress"
                  name="shippingAddress"
                  rows={3}
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Order History</h2>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold">Order #{order.id}</p>
                        <p className="text-sm text-slate-500">
                          Date: {new Date(order.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-semibold text-lg">Total: ${order.total.toFixed(2)}</p>
                    </div>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.cartItemId} className="flex items-center gap-3 text-sm">
                          <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded object-cover" />
                          <span className="flex-grow">{item.name}</span>
                          <span className="text-slate-600">Qty: {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-500 py-10">You have no past orders.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'wishlist' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-slate-800 mb-4">My Wishlist</h2>
                {wishlistProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {wishlistProducts.map(product => (
                             <ProductCard
                                key={product.id}
                                product={product}
                                currentUser={user}
                                onProductClick={onProductClick}
                                onAddToCart={onAddToCart}
                                onToggleWishlist={onToggleWishlist}
                                isInWishlist={true}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-slate-500 py-10">Your wishlist is empty. Start exploring to add products!</p>
                )}
            </div>
        )}

        {activeTab === 'payout' && user.role === 'seller' && (
            <PayoutSettingsForm user={user} onUpdatePayoutDetails={onUpdatePayoutDetails} />
        )}
      </div>
    </main>
  );
};

export default UserProfilePage;