
import React, { useState, useMemo, useEffect } from 'react';
import { Product, User, Order } from '../types';
import { XMarkIcon, PlusIcon, ChartBarIcon, CogIcon, BanknotesIcon } from '../constants';
import Tooltip from './Tooltip';
import ConfirmationDialog from './ConfirmationDialog';

// ... (ProductFormModal component remains the same)
interface ProductFormModalProps {
  productToEdit: Product | null;
  onClose: () => void;
  onSave: (product: Product | Omit<Product, 'id' | 'reviews' | 'sellerId' | 'addedOn'>) => void;
}

const ProductFormModal: React.FC<ProductFormModalProps> = ({ productToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    fileUrl: '',
    isFeatured: false,
  });

  // FIX: useEffect was used without being imported.
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
       setFormData(prev => ({...prev, [name]: checked }));
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
      onSave({ ...productToEdit, ...productData });
    } else {
      onSave(productData);
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
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Product Name" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          <input type="number" name="price" step="0.01" value={formData.price} onChange={handleChange} placeholder="Price" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Category" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          <input type="text" name="fileUrl" value={formData.fileUrl} onChange={handleChange} placeholder="File/Download URL" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
          <textarea name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Description" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"></textarea>
          <div className="flex items-center">
            <input id="isFeatured" name="isFeatured" type="checkbox" checked={formData.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
            <label htmlFor="isFeatured" className="ml-2 block text-sm text-slate-900">Feature this product on the homepage</label>
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
        const placeholderUrl = `https://via.placeholder.com/64x64.png?text=${encodeURIComponent(product.name.substring(0, 3))}`;
        setImageSrc(placeholderUrl);
    };
    return <img className="w-16 h-16 object-cover rounded-md" src={imageSrc} onError={handleImageError} alt={product.name} />
}

interface SellerDashboardProps {
  seller: User;
  allProducts: Product[];
  orderHistory: Order[];
  globalCommissionRate: number;
  onClose: () => void;
  onAddProduct: (product: Omit<Product, 'id' | 'reviews' | 'addedOn'>) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ seller, allProducts, orderHistory, globalCommissionRate, onClose, onAddProduct, onEditProduct, onDeleteProduct }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'transactions'>('overview');
  
  const sellerProducts = useMemo(() => {
    return allProducts.filter(p => p.sellerId === seller.id);
  }, [allProducts, seller.id]);

  const salesAnalytics = useMemo(() => {
    const relevantItems = orderHistory.flatMap(order => order.items).filter(item => item.sellerId === seller.id);
    const totalSales = relevantItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const commissionRate = seller.commissionRate ?? globalCommissionRate;
    const adminCommission = totalSales * commissionRate;
    const netEarnings = totalSales - adminCommission;
    return { totalSales, adminCommission, netEarnings, commissionRate };
  }, [orderHistory, seller.id, seller.commissionRate, globalCommissionRate]);

  const sellerTransactions = useMemo(() => {
    const commissionRate = seller.commissionRate ?? globalCommissionRate;
    return orderHistory
      .flatMap(order => 
        order.items
          .filter(item => item.sellerId === seller.id)
          .map(item => {
            const salePrice = item.price * item.quantity;
            const commission = salePrice * commissionRate;
            const net = salePrice - commission;
            return {
              orderId: order.id,
              date: order.date,
              productName: item.name,
              quantity: item.quantity,
              salePrice,
              commission,
              net
            };
          })
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orderHistory, seller.id, seller.commissionRate, globalCommissionRate]);

  const handleOpenForm = (product?: Product) => {
    setProductToEdit(product || null);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = (productData: Product | Omit<Product, 'id' | 'reviews' | 'sellerId' | 'addedOn'>) => {
    if ('id' in productData) {
      onEditProduct(productData);
    } else {
      onAddProduct({ ...productData, sellerId: seller.id });
    }
    handleCloseForm();
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

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-30 animate-fade-in" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-slate-50 shadow-xl z-40 transform animate-slide-in flex flex-col">
        <header className="p-4 bg-white border-b sticky top-0 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{seller.storeName || `${seller.name}'s Dashboard`}</h2>
            <p className="text-sm text-slate-500">Manage your products and view sales.</p>
          </div>
           <Tooltip text="Close Panel">
            <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Tooltip>
        </header>

        <nav className="bg-white border-b">
          <div className="px-4 flex space-x-2">
            <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                <ChartBarIcon className="w-5 h-5"/> Sales Overview
            </button>
            <button onClick={() => setActiveTab('products')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium ${activeTab === 'products' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                <CogIcon className="w-5 h-5"/> Manage Products
            </button>
            <button onClick={() => setActiveTab('transactions')} className={`flex items-center gap-2 py-3 px-4 text-sm font-medium ${activeTab === 'transactions' ? 'border-b-2 border-primary text-primary' : 'text-slate-500 hover:text-slate-700'}`}>
                <BanknotesIcon className="w-5 h-5"/> Transaction History
            </button>
          </div>
        </nav>
        
        <div className="flex-grow p-4 sm:p-6 overflow-y-auto">
          {activeTab === 'overview' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-slate-600">Total Sales</p>
                    <p className="text-3xl font-bold text-slate-800">${salesAnalytics.totalSales.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-red-600">Admin Commission ({ (salesAnalytics.commissionRate * 100).toFixed(1) }%)</p>
                    <p className="text-3xl font-bold text-red-800">-${salesAnalytics.adminCommission.toFixed(2)}</p>
                </div>
                 <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-sm text-green-600">Your Net Earnings</p>
                    <p className="text-3xl font-bold text-green-800">${salesAnalytics.netEarnings.toFixed(2)}</p>
                </div>
            </div>
          )}
          {activeTab === 'products' && (
            <div>
              <div className="mb-4">
                <Tooltip text="Add a new product to your listings">
                  <button onClick={() => handleOpenForm()} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-hover">
                    <PlusIcon className="w-5 h-5" /> Add New Product
                  </button>
                </Tooltip>
              </div>
              <div className="space-y-3">
                {sellerProducts.length > 0 ? sellerProducts.map(product => (
                  <div key={product.id} className="bg-white p-3 rounded-md shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ProductImage product={product} />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-sm text-slate-500">${product.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Tooltip text={`Edit your product: "${product.name}"`}>
                        <button onClick={() => handleOpenForm(product)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
                      </Tooltip>
                      <Tooltip text={`Delete your product: "${product.name}"`}>
                        <button onClick={() => handleDeleteClick(product)} className="text-sm font-medium text-red-600 hover:text-red-800">Delete</button>
                      </Tooltip>
                    </div>
                  </div>
                )) : (
                  <div className="text-center text-slate-500 py-10 bg-white rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">No products yet!</h3>
                    <p>Click "Add New Product" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'transactions' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <h3 className="text-lg font-semibold text-slate-800 p-6">Transaction History</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                         <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Sale</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Commission</th>
                                <th className="py-3 px-6 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Net Earning</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {sellerTransactions.length > 0 ? sellerTransactions.map(t => (
                                <tr key={`${t.orderId}-${t.productName}`}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 font-medium">{t.productName} (x{t.quantity})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-800 text-right">${t.salePrice.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right">-${t.commission.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold text-right">${t.net.toFixed(2)}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-slate-500">No transactions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
              </div>
          )}
        </div>
      </div>
      {isFormOpen && (
        <ProductFormModal 
          productToEdit={productToEdit}
          onClose={handleCloseForm}
          onSave={handleSaveProduct}
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

export default SellerDashboard;
