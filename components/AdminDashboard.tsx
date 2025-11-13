
import React, { useState, useEffect, useMemo } from 'react';
import { Product, User, Order, PayoutDetails } from '../types';
import { XMarkIcon, PlusIcon, BanknotesIcon, CogIcon, ChartBarIcon, HomeIcon, UsersIcon } from '../constants';
import Tooltip from './Tooltip';
import ConfirmationDialog from './ConfirmationDialog';

// ... (ProductFormModal component remains the same)
interface ProductFormModalProps {
  productToEdit: Product | null;
  onClose: () => void;
  onSave: (product: Product | Omit<Product, 'id' | 'reviews' | 'sellerId' | 'addedOn'>, sellerId: number) => void;
  sellerId: number;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ productToEdit, onClose, onSave, sellerId }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    fileUrl: '',
    isFeatured: false,
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: productToEdit.price.toString(),
        description: productToEdit.description,
        category: productToEdit.category,
        imageUrl: productToEdit.imageUrl,
        fileUrl: productToEdit.fileUrl,
        isFeatured: productToEdit.isFeatured || false,
      });
    } else {
      setFormData({ name: '', price: '', description: '', category: '', imageUrl: '', fileUrl: '', isFeatured: false });
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
       setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
       setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price) || 0,
    };
    if (productToEdit) {
      onSave({ ...productToEdit, ...productData }, productToEdit.sellerId);
    } else {
      onSave(productData, sellerId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
          <Tooltip text="Close">
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Tooltip>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Product Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price</label>
            <input type="number" name="price" id="price" step="0.01" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Category</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label>
            <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
           <div>
            <label htmlFor="fileUrl" className="block text-sm font-medium text-slate-700">File/Download URL</label>
            <input type="text" name="fileUrl" id="fileUrl" value={formData.fileUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" id="description" rows={4} value={formData.description} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"></textarea>
          </div>
          <div className="flex items-center">
            <input
              id="isFeatured"
              name="isFeatured"
              type="checkbox"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-slate-900">
              Feature this product on the homepage
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
             <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-transparent rounded-md hover:bg-slate-200">Cancel</button>
             <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-hover">Save Product</button>
          </div>
        </form>
      </div>
    </div>
  )
};

const ProductImage: React.FC<{product: Product}> = ({ product }) => {
    const [imageSrc, setImageSrc] = useState(product.imageUrl);
    useEffect(() => { setImageSrc(product.imageUrl) }, [product.imageUrl]);
    const handleImageError = () => {
        const placeholderUrl = `https://via.placeholder.com/40x40.png?text=${encodeURIComponent(product.name.substring(0, 3))}`;
        setImageSrc(placeholderUrl);
    };
    return <img className="h-10 w-10 rounded-md object-cover" src={imageSrc} onError={handleImageError} alt={product.name} />
}

const CommissionsManager: React.FC<{
  sellers: User[];
  globalCommissionRate: number;
  onSetGlobalCommissionRate: (rate: number) => void;
  onSetSellerCommissionRate: (sellerId: number, rate: number | null) => void;
}> = ({ sellers, globalCommissionRate, onSetGlobalCommissionRate, onSetSellerCommissionRate }) => {
  const [globalRateInput, setGlobalRateInput] = useState((globalCommissionRate * 100).toString());
  const [sellerRateInputs, setSellerRateInputs] = useState<{ [key: number]: string }>({});
  const [recentlyUpdated, setRecentlyUpdated] = useState<number | null>(null);

  useEffect(() => {
    setGlobalRateInput((globalCommissionRate * 100).toString());
  }, [globalCommissionRate]);

  const handleGlobalRateSet = () => {
    const rate = parseFloat(globalRateInput) / 100;
    if (!isNaN(rate)) {
      onSetGlobalCommissionRate(rate);
      alert('Global rate updated!');
    }
  };

  const handleSellerRateChange = (sellerId: number, value: string) => {
    setSellerRateInputs(prev => ({ ...prev, [sellerId]: value }));
  };

  const handleSellerRateSet = (sellerId: number) => {
    const rateStr = sellerRateInputs[sellerId];
    if (rateStr === '' || rateStr === undefined) return;
    const rate = parseFloat(rateStr) / 100;
    if (!isNaN(rate)) {
      onSetSellerCommissionRate(sellerId, rate);
      setRecentlyUpdated(sellerId);
      setTimeout(() => setRecentlyUpdated(null), 1500);
    }
  };

  const handleClearOverride = (sellerId: number) => {
    onSetSellerCommissionRate(sellerId, null);
    setSellerRateInputs(prev => {
        const newState = {...prev};
        delete newState[sellerId];
        return newState;
    });
    setRecentlyUpdated(sellerId);
    setTimeout(() => setRecentlyUpdated(null), 1500);
  }

  return (
    <div className="p-4 sm:p-6 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Global Commission Rate</h3>
        <p className="text-sm text-slate-500 mt-1">This rate applies to all sellers without a specific override.</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex-grow max-w-xs">
            <input type="number" value={globalRateInput} onChange={(e) => setGlobalRateInput(e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-4 pr-12" />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"><span className="text-gray-500 sm:text-sm">%</span></div>
          </div>
          <button onClick={handleGlobalRateSet} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-hover">Set Global Rate</button>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Seller-Specific Commissions</h3>
        <p className="text-sm text-slate-500 mt-1">Set a custom commission rate for individual sellers. This will override the global rate.</p>
        <div className="mt-4 -mx-6">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Effective Rate</th>
                            <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Override Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {sellers.map(seller => (
                        <tr key={seller.id} className={`transition-colors duration-500 ${recentlyUpdated === seller.id ? 'bg-green-50' : ''}`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <p className="font-medium text-slate-900">{seller.storeName || seller.name}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${seller.commissionRate !== undefined ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-800'}`}>
                                    {((seller.commissionRate ?? globalCommissionRate) * 100).toFixed(1)}%
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <div className="relative" style={{width: '100px'}}>
                                        <input type="number" placeholder="eg. 15" value={sellerRateInputs[seller.id] || ''} onChange={(e) => handleSellerRateChange(seller.id, e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm pl-3 pr-8"/>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><span className="text-gray-500 sm:text-sm">%</span></div>
                                    </div>
                                    <button onClick={() => handleSellerRateSet(seller.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-slate-600 rounded-md hover:bg-slate-700">Set</button>
                                    <button onClick={() => handleClearOverride(seller.id)} className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-200 rounded-md hover:bg-slate-300">Clear</button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>
    </div>
  )
}

const PayoutSettings: React.FC<{
    user: User,
    onUpdatePayoutDetails: (userId: number, details: PayoutDetails) => void;
}> = ({ user, onUpdatePayoutDetails }) => {
    const [details, setDetails] = useState<PayoutDetails>(user.payoutDetails || { method: 'bank' });

    const handleSave = () => {
        onUpdatePayoutDetails(user.id, details);
    }
    
    return (
        <div className="p-4 sm:p-6">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold text-slate-800">Your Payout Information</h3>
                <p className="text-sm text-slate-500 mt-1">This is where your earnings will be sent. Please ensure this is accurate.</p>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-700">Payout Method</label>
                    <select value={details.method} onChange={e => setDetails({ ...details, method: e.target.value as 'bank' | 'paypal' })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm">
                        <option value="bank">Bank Account</option>
                        <option value="paypal">PayPal</option>
                    </select>
                </div>

                {details.method === 'bank' && (
                    <div className="mt-4 space-y-4 animate-fade-in">
                        <input type="text" placeholder="Account Number" value={details.accountNumber || ''} onChange={e => setDetails({...details, accountNumber: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                        <input type="text" placeholder="Routing Number" value={details.routingNumber || ''} onChange={e => setDetails({...details, routingNumber: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                )}
                {details.method === 'paypal' && (
                    <div className="mt-4 animate-fade-in">
                         <input type="email" placeholder="PayPal Email Address" value={details.paypalEmail || ''} onChange={e => setDetails({...details, paypalEmail: e.target.value})} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
                    </div>
                )}
                 <button onClick={handleSave} className="mt-6 w-full bg-primary text-white py-2 px-4 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md">
                    Save Payout Settings
                </button>
            </div>
        </div>
    )
}

const Financials: React.FC<{
    orderHistory: Order[];
    users: User[];
    globalCommissionRate: number;
}> = ({ orderHistory, users, globalCommissionRate }) => {
    const allTransactions = useMemo(() => {
        return orderHistory.flatMap(order => 
            order.items.map(item => {
                const seller = users.find(u => u.id === item.sellerId);
                const commissionRate = seller?.commissionRate ?? globalCommissionRate;
                const salePrice = item.price * item.quantity;
                const commission = salePrice * commissionRate;
                const net = salePrice - commission;
                return {
                    orderId: order.id,
                    date: order.date,
                    productName: item.name,
                    sellerName: seller?.storeName || 'Unknown',
                    salePrice,
                    commission,
                    net,
                }
            })
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [orderHistory, users, globalCommissionRate]);

    const totals = useMemo(() => {
        return allTransactions.reduce((acc, t) => ({
            sales: acc.sales + t.salePrice,
            commissions: acc.commissions + t.commission,
        }), { sales: 0, commissions: 0 });
    }, [allTransactions]);

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-600">Total Gross Sales</p>
                    <p className="text-2xl font-bold text-slate-800">${totals.sales.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-600">Total Commissions Earned</p>
                    <p className="text-2xl font-bold text-green-700">${totals.commissions.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-4 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-600">Net to Sellers</p>
                    <p className="text-2xl font-bold text-slate-800">${(totals.sales - totals.commissions).toFixed(2)}</p>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-800 p-6">All Transactions</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                         <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Seller</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Sale</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Net</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {allTransactions.map(t => (
                                <tr key={`${t.orderId}-${t.productName}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{t.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{t.sellerName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">${t.salePrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">-${t.commission.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-right">${t.net.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const Overview: React.FC<{
    users: User[];
    products: Product[];
    orderHistory: Order[];
}> = ({ users, products, orderHistory }) => {
    const totalRevenue = useMemo(() => orderHistory.reduce((sum, order) => sum + order.total, 0), [orderHistory]);
    const sellerCount = useMemo(() => users.filter(u => u.role === 'seller').length, [users]);

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Active Sellers</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{sellerCount}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Products</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-slate-500">Total Orders</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{orderHistory.length}</p>
                </div>
            </div>
             <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-800 p-6">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                         <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {orderHistory.slice(0, 5).map(order => {
                                const customer = users.find(u => u.id === order.userId);
                                return (
                                    <tr key={order.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">#{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{new Date(order.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{customer?.name || 'Unknown User'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-semibold text-right">${order.total.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

const UserManagement: React.FC<{
    adminUser: User;
    users: User[];
    onDeleteUser: (userId: number) => void;
}> = ({ adminUser, users, onDeleteUser }) => {
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const handleDeleteClick = (user: User) => {
        if (user.id === adminUser.id) {
            alert("You cannot delete your own admin account.");
            return;
        }
        setUserToDelete(user);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            onDeleteUser(userToDelete.id);
        }
        setIsConfirmOpen(false);
        setUserToDelete(null);
    };

    const getRoleClass = (role: User['role']) => {
        switch(role) {
            case 'admin': return 'bg-red-100 text-red-800';
            case 'seller': return 'bg-blue-100 text-blue-800';
            default: return 'bg-slate-100 text-slate-800';
        }
    }

    return (
        <>
            <div className="p-4 sm:p-6">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <h3 className="text-lg font-semibold text-slate-800 p-6">All Users</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                    <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <p className="font-medium text-slate-900">{user.name}</p>
                                            <p className="text-sm text-slate-500">{user.username}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <Tooltip text={`Delete user "${user.username}"`}>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)} 
                                                    className="text-red-600 hover:text-red-900 disabled:text-slate-300 disabled:cursor-not-allowed"
                                                    disabled={user.id === adminUser.id}
                                                >
                                                    Delete
                                                </button>
                                            </Tooltip>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
             <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirm User Deletion"
                message={`Are you sure you want to delete the user "${userToDelete?.username}"? If they are a seller, their products will be reassigned to you. This action cannot be undone.`}
            />
        </>
    )
}

interface AdminDashboardProps {
  adminUser: User;
  products: Product[];
  users: User[];
  orderHistory: Order[];
  globalCommissionRate: number;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'reviews' | 'addedOn'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
  onDeleteUser: (userId: number) => void;
  onSetGlobalCommissionRate: (rate: number) => void;
  onSetSellerCommissionRate: (sellerId: number, rate: number | null) => void;
  onUpdatePayoutDetails: (userId: number, details: PayoutDetails) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, products, users, orderHistory, globalCommissionRate, onClose, onAddProduct, onEditProduct, onDeleteProduct, onDeleteUser, onSetGlobalCommissionRate, onSetSellerCommissionRate, onUpdatePayoutDetails }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'users' | 'commissions' | 'financials' | 'payout'>('overview');
  
  const sellers = users.filter(u => u.role === 'seller');

  const handleOpenForm = (product?: Product) => {
    setProductToEdit(product || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (productData: Product | Omit<Product, 'id' | 'reviews' | 'sellerId' | 'addedOn'>, sellerId: number) => {
    if ('id' in productData) {
      onEditProduct(productData);
    } else {
      onAddProduct({ ...productData, sellerId });
    }
    handleCloseForm();
  };

  const getSellerName = (sellerId: number) => {
    const seller = users.find(u => u.id === sellerId);
    return seller?.storeName || seller?.username || 'Unknown';
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete.id);
    }
    setIsConfirmOpen(false);
    setProductToDelete(null);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: HomeIcon },
    { id: 'products', label: 'Manage Products', icon: CogIcon },
    { id: 'users', label: 'Manage Users', icon: UsersIcon },
    { id: 'commissions', label: 'Commissions', icon: BanknotesIcon },
    { id: 'financials', label: 'Financials', icon: ChartBarIcon },
    { id: 'payout', label: 'Payout Settings', icon: BanknotesIcon },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-30 animate-fade-in" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full max-w-5xl bg-slate-50 shadow-xl z-40 transform animate-slide-in flex flex-col">
        <header className="p-4 bg-white border-b sticky top-0 flex justify-between items-center">
          <h2 className="text-xl font-bold">Admin Panel</h2>
           <Tooltip text="Close Panel">
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Tooltip>
        </header>

        <nav className="bg-white border-b">
          <div className="px-4 flex space-x-2 overflow-x-auto">
             {tabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium shrink-0 ${activeTab === tab.id ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                    <tab.icon className="w-5 h-5"/> {tab.label}
                </button>
             ))}
          </div>
        </nav>

        <div className="flex-grow overflow-y-auto">
          {activeTab === 'overview' && <Overview users={users} products={products} orderHistory={orderHistory} />}
          
          {activeTab === 'products' && (
            <div className="p-4 sm:p-6">
              <div className="mb-4">
                <Tooltip text="Add a new product to the store">
                  <button onClick={() => handleOpenForm()} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-hover">
                    <PlusIcon className="w-5 h-5" /> Add New Product
                  </button>
                </Tooltip>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sold By</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                        {products.map(product => (
                            <tr key={product.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                    <ProductImage product={product} />
                                </div>
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                    <div className="text-sm text-slate-500">{product.category}</div>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">${product.price.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{getSellerName(product.sellerId)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-4">
                                  <Tooltip text={`Edit "${product.name}"`}>
                                    <button onClick={() => handleOpenForm(product)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                  </Tooltip>
                                  <Tooltip text={`Delete "${product.name}"`}>
                                    <button onClick={() => handleDeleteClick(product)} className="text-red-600 hover:text-red-900">Delete</button>
                                  </Tooltip>
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
              <UserManagement adminUser={adminUser} users={users} onDeleteUser={onDeleteUser} />
          )}
          {activeTab === 'commissions' && (
            <CommissionsManager
              sellers={sellers}
              globalCommissionRate={globalCommissionRate}
              onSetGlobalCommissionRate={onSetGlobalCommissionRate}
              onSetSellerCommissionRate={onSetSellerCommissionRate}
            />
          )}
          {activeTab === 'financials' && (
            <Financials orderHistory={orderHistory} users={users} globalCommissionRate={globalCommissionRate} />
          )}
          {activeTab === 'payout' && (
            <PayoutSettings user={adminUser} onUpdatePayoutDetails={onUpdatePayoutDetails} />
          )}
        </div>
      </div>
      {isFormOpen && (
        <ProductFormModal 
          productToEdit={productToEdit}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
          sellerId={3} // Admin user ID
        />
      )}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  )
}

export default AdminDashboard;
