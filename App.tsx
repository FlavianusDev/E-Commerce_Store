
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ProductGrid from './components/ProductGrid';
import ProductDetailModal from './components/ProductDetailModal';
import CartSidebar from './components/CartSidebar';
import SortControls from './components/SortControls';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import CheckoutPage from './components/CheckoutPage';
import OrderSuccessPage from './components/OrderSuccessPage';
import AdminDashboard from './components/AdminDashboard';
import SellerDashboard from './components/SellerDashboard';
import UserProfilePage from './components/UserProfilePage';
import Hero from './components/Hero';
import Footer from './components/Footer';
import CategoryFilters from './components/CategoryFilters';
import FeaturedProducts from './components/FeaturedProducts';
import PayPalModal from './components/PayPalModal';
import * as api from './services/apiService';
import { Product, CartItem, Review, User, Order, SignUpData, PayoutDetails, AuthProvider } from './types';

type View = 'login' | 'signup' | 'store' | 'checkout' | 'success' | 'profile';

const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [purchasedItems, setPurchasedItems] = useState<CartItem[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<string>('default');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isSellerDashboardOpen, setIsSellerDashboardOpen] = useState(false);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);

  const [globalCommissionRate, setGlobalCommissionRate] = useState<number>(0.10);

  useEffect(() => {
    // Load initial data from the "API" on mount
    const fetchData = async () => {
        setProducts(await api.getProducts());
        setUsers(await api.getUsers());
        setOrderHistory(await api.getOrders());
        setGlobalCommissionRate(await api.getGlobalCommissionRate());
    };
    fetchData();
  }, []);

  const selectedProduct = useMemo(() => {
    if (selectedProductId === null) return null;
    return products.find(p => p.id === selectedProductId);
  }, [products, selectedProductId]);

  const categories = useMemo(() => {
    const allCategories = products.map(p => p.category);
    return ['All', ...Array.from(new Set(allCategories))];
  }, [products]);

  const featuredProducts = useMemo(() => {
    return products.filter(p => p.isFeatured);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (sortOrder) {
      case 'price-asc': return [...filtered].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...filtered].sort((a, b) => b.price - a.price);
      case 'name-asc': return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
      default: return filtered;
    }
  }, [products, searchQuery, sortOrder, selectedCategory]);

  const userOrderHistory = useMemo(() => {
    if (!currentUser) return [];
    return orderHistory.filter(order => order.userId === currentUser.id);
  }, [orderHistory, currentUser]);

  const handleLogin = useCallback(async (username: string, password: string): Promise<boolean> => {
    try {
      const user = await api.login(username, password);
      setCurrentUser(user);
      setView('store');
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const handleSocialLogin = useCallback(async (provider: AuthProvider) => {
    try {
      const user = await api.socialLogin(provider);
      setCurrentUser(user);
      setView('store');
    } catch (error) {
       alert((error as Error).message);
    }
  }, []);

  const handleSignUp = useCallback(async (signUpData: SignUpData): Promise<boolean> => {
    try {
      const newUser = await api.signUp(signUpData);
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setView('store');
      return true;
    } catch (error) {
      alert((error as Error).message);
      return false;
    }
  }, []);
  
  const handleSocialSignUp = useCallback(async (provider: AuthProvider) => {
     try {
      const newUser = await api.socialSignUp(provider);
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setView('store');
    } catch (error) {
       alert((error as Error).message);
    }
  }, []);


  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('login');
    setCartItems([]);
    setIsCartOpen(false);
    setIsAdminDashboardOpen(false);
    setIsSellerDashboardOpen(false);
  }, []);

  const handleAddToCart = useCallback((product: Product, selectedVariations: { [key: string]: string }) => {
    const cartItemId = product.id + '-' + Object.values(selectedVariations).sort().join('-');
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.cartItemId === cartItemId);
      if (existingItem) {
        return prevItems.map(item =>
          item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1, cartItemId, selectedVariations }];
    });
    setIsCartOpen(true);
  }, []);

  const handleRemoveFromCart = useCallback((cartItemId: string) => setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId)), []);
  
  const handleUpdateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(cartItemId);
      return;
    }
    setCartItems(prevItems => prevItems.map(item => item.cartItemId === cartItemId ? { ...item, quantity } : item));
  }, [handleRemoveFromCart]);

  const handleSelectProduct = useCallback((product: Product) => setSelectedProductId(product.id), []);
  const handleCloseModal = useCallback(() => setSelectedProductId(null), []);
  const handleToggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);

  const handleGoToCheckout = useCallback(() => {
    if (cartItems.length > 0) {
      setView('checkout');
      setIsCartOpen(false);
    }
  }, [cartItems.length]);

  const handlePayPalCheckout = useCallback(() => {
      setIsPayPalModalOpen(true);
  }, []);

  const handlePaymentSuccess = useCallback(async () => {
    if (!currentUser) return;
    try {
        const newOrder = await api.createOrder(currentUser.id, cartItems);
        setOrderHistory(prev => [newOrder, ...prev]);
        setPurchasedItems(cartItems);
        setCartItems([]);
        setIsPayPalModalOpen(false);
        setView('success');
    } catch (error) {
        alert((error as Error).message);
    }
  }, [cartItems, currentUser]);

  const handleAddReview = useCallback(async (productId: number, reviewData: Omit<Review, 'id' | 'date'>) => {
    const updatedProduct = await api.addReview(productId, reviewData);
    setProducts(prevProducts => prevProducts.map(p => p.id === productId ? updatedProduct : p));
  }, []);

  const handleToggleWishlist = useCallback(async (productId: number) => {
    if (!currentUser) { alert("Please log in to manage your wishlist."); return; }
    try {
        const updatedUser = await api.toggleWishlist(currentUser.id, productId);
        setCurrentUser(updatedUser);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
    } catch(error) {
        alert((error as Error).message);
    }
  }, [currentUser]);

  const handleAddProduct = useCallback(async (product: Omit<Product, 'id' | 'reviews' | 'addedOn'>) => {
    if (!currentUser) return;
    const newProduct = await api.addProduct(product, currentUser);
    setProducts(prev => [newProduct, ...prev]);
  }, [currentUser]);

  const handleEditProduct = useCallback(async (updatedProduct: Product) => {
    if (!currentUser) return;
    try {
      const returnedProduct = await api.updateProduct(updatedProduct, currentUser);
      setProducts(prev => prev.map(p => p.id === returnedProduct.id ? returnedProduct : p));
    } catch (error) {
      alert((error as Error).message);
    }
  }, [currentUser]);

  const handleDeleteProduct = useCallback(async (productId: number) => {
    if (!currentUser) return;
    try {
      await api.deleteProduct(productId, currentUser);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      alert((error as Error).message);
    }
  }, [currentUser]);

  const handleUpdateUser = useCallback(async (updatedUser: User) => {
    const user = await api.updateUser(updatedUser);
    setUsers(prevUsers => prevUsers.map(u => u.id === user.id ? user : u));
    setCurrentUser(user);
    alert('Profile updated successfully!');
  }, []);

  const handleDeleteUser = useCallback(async (userId: number) => {
    if (!currentUser) return;
    try {
      await api.deleteUser(userId, currentUser);
      // Refetch users and products since a seller's products may have been reassigned
      setUsers(await api.getUsers());
      setProducts(await api.getProducts());
      alert('User deleted successfully.');
    } catch (error) {
      alert((error as Error).message);
    }
  }, [currentUser]);

  const handleUpdatePayoutDetails = useCallback(async (userId: number, details: PayoutDetails) => {
    const updatedUser = await api.updatePayoutDetails(userId, details);
    setUsers(prevUsers => prevUsers.map(u => u.id === userId ? updatedUser : u));
    if (currentUser?.id === userId) setCurrentUser(updatedUser);
    alert('Payout details updated successfully!');
  }, [currentUser]);

  const handleSetGlobalCommissionRate = useCallback(async (rate: number) => {
    const newRate = await api.setGlobalCommissionRate(rate);
    setGlobalCommissionRate(newRate);
  }, []);

  const handleSetSellerCommissionRate = useCallback(async (sellerId: number, rate: number | null) => {
    const updatedSellers = await api.setSellerCommissionRate(sellerId, rate);
    // update users state with the new seller data
    setUsers(prevUsers => prevUsers.map(u => updatedSellers.find(s => s.id === u.id) || u));
  }, []);

  const cartItemCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);

  if (!currentUser) {
    return (
      <div className="bg-slate-50 min-h-screen">
        {view === 'login' && <LoginPage onLogin={handleLogin} onSocialLogin={handleSocialLogin} onNavigateToSignUp={() => setView('signup')} />}
        {view === 'signup' && <SignUpPage onSignUp={handleSignUp} onSocialSignUp={handleSocialSignUp} onNavigateToLogin={() => setView('login')} />}
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col">
      <Header 
        user={currentUser}
        onLogout={handleLogout}
        onSearch={setSearchQuery} 
        cartItemCount={cartItemCount}
        onCartClick={handleToggleCart}
        onAdminClick={() => setIsAdminDashboardOpen(true)}
        onSellerDashboardClick={() => setIsSellerDashboardOpen(true)}
        onProfileClick={() => setView('profile')}
      />
      <div className="flex-grow">
        {view === 'store' && (
          <main className="container mx-auto p-4 sm:p-6 lg:p-8">
            <Hero />
            <FeaturedProducts 
              products={featuredProducts} 
              onProductClick={handleSelectProduct}
              onAddToCart={handleAddToCart}
              onToggleWishlist={handleToggleWishlist}
              currentUser={currentUser}
            />
            <div id="product-list-header" className="flex flex-col sm:flex-row justify-between items-start sm:items-center my-8 gap-4">
              <h1 className="text-3xl font-bold text-slate-900">Explore Our Products</h1>
              <SortControls sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>
            <CategoryFilters categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory}/>
            <ProductGrid products={filteredAndSortedProducts} onProductClick={handleSelectProduct} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} currentUser={currentUser} />
          </main>
        )}
        {view === 'checkout' && (
          <CheckoutPage cartItems={cartItems} user={currentUser} onBackToStore={() => setView('store')} onCheckout={handlePayPalCheckout} onUpdateUser={handleUpdateUser} />
        )}
        {view === 'success' && (<OrderSuccessPage purchasedItems={purchasedItems} onContinueShopping={() => setView('store')} />)}
        {view === 'profile' && (<UserProfilePage user={currentUser} orders={userOrderHistory} allProducts={products} onUpdateUser={handleUpdateUser} onBackToStore={() => setView('store')} onAddToCart={handleAddToCart} onToggleWishlist={handleToggleWishlist} onProductClick={handleSelectProduct} onUpdatePayoutDetails={handleUpdatePayoutDetails} />)}
      </div>

      {selectedProduct && <ProductDetailModal product={selectedProduct} users={users} currentUser={currentUser} onClose={handleCloseModal} onAddToCart={handleAddToCart} onAddReview={handleAddReview} onToggleWishlist={handleToggleWishlist} />}
      <CartSidebar isOpen={isCartOpen} onClose={handleToggleCart} cartItems={cartItems} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveFromCart} onCheckout={handleGoToCheckout} />
      
      {isPayPalModalOpen && (
          <PayPalModal
              onClose={() => setIsPayPalModalOpen(false)}
              onConfirm={handlePaymentSuccess}
              total={cartItems.reduce((total, item) => total + item.price * item.quantity, 0) * 1.10} // Assumes 10% tax
          />
      )}

      {currentUser?.role === 'admin' && isAdminDashboardOpen && (
        <AdminDashboard 
          adminUser={currentUser} 
          products={products} 
          users={users} 
          orderHistory={orderHistory} 
          globalCommissionRate={globalCommissionRate} 
          onClose={() => setIsAdminDashboardOpen(false)} 
          onAddProduct={handleAddProduct} 
          onEditProduct={handleEditProduct} 
          onDeleteProduct={handleDeleteProduct}
          onDeleteUser={handleDeleteUser}
          onSetGlobalCommissionRate={handleSetGlobalCommissionRate} 
          onSetSellerCommissionRate={handleSetSellerCommissionRate} 
          onUpdatePayoutDetails={handleUpdatePayoutDetails} 
        />
      )}
      {currentUser?.role === 'seller' && isSellerDashboardOpen && (
        <SellerDashboard 
          seller={currentUser} 
          allProducts={products} 
          orderHistory={orderHistory} 
          globalCommissionRate={globalCommissionRate} 
          onClose={() => setIsSellerDashboardOpen(false)} 
          onAddProduct={handleAddProduct}
          onEditProduct={handleEditProduct} 
          onDeleteProduct={handleDeleteProduct} 
        />
      )}
      
      <Footer />
    </div>
  );
};

export default App;
