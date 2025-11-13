import { MOCK_USERS, MOCK_PRODUCTS } from '../constants';
import { User, Product, Order, CartItem, Review, SignUpData, PayoutDetails, AuthProvider } from '../types';

// Simulate a database with in-memory arrays
let users: User[] = JSON.parse(JSON.stringify(MOCK_USERS));
let products: Product[] = JSON.parse(JSON.stringify(MOCK_PRODUCTS));
let orders: Order[] = [];
let globalCommissionRate = 0.10; // 10%

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- Auth ---
export const login = async (username: string, password?: string): Promise<User> => {
  await simulateDelay(300);
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return user;
  }
  throw new Error("Invalid credentials");
};

export const socialLogin = async (provider: AuthProvider): Promise<User> => {
    await simulateDelay(300);
    const user = users.find(u => u.authProvider === provider);
    if (user) {
        return user;
    }
    throw new Error(`No mock user found for ${provider}. Please sign up first.`);
}

export const signUp = async (data: SignUpData): Promise<User> => {
    await simulateDelay(400);
    if (users.some(u => u.username === data.username)) {
        throw new Error("Username already exists");
    }
    const newUser: User = {
        id: Date.now(),
        username: data.username,
        password: data.password,
        name: data.name,
        shippingAddress: data.shippingAddress,
        role: data.isSeller ? 'seller' : 'user',
        storeName: data.storeName,
        storeDescription: data.storeDescription,
        wishlist: [],
        authProvider: 'local'
    };
    users.push(newUser);
    return newUser;
}

export const socialSignUp = async (provider: AuthProvider): Promise<User> => {
    await simulateDelay(400);
    const existingUser = users.find(u => u.authProvider === provider);
    if (existingUser) return existingUser; // If user exists, just log them in

    const newUser: User = {
        id: Date.now(),
        username: `${provider}_user_${Date.now()}`.slice(0,15),
        name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
        shippingAddress: '123 Social Media Lane',
        role: 'user',
        wishlist: [],
        authProvider: provider,
    };
    users.push(newUser);
    return newUser;
}

// --- Data Fetching ---
export const getProducts = async (): Promise<Product[]> => {
  await simulateDelay(100);
  return products;
}
export const getUsers = async (): Promise<User[]> => {
  await simulateDelay(50);
  return users;
}
export const getOrders = async (): Promise<Order[]> => {
    await simulateDelay(50);
    return orders;
}
export const getGlobalCommissionRate = async (): Promise<number> => {
  await simulateDelay(50);
  return globalCommissionRate;
}

// --- Product Management ---
export const addProduct = async (productData: Omit<Product, 'id' | 'reviews' | 'addedOn'>, currentUser: User): Promise<Product> => {
    await simulateDelay(200);
    if (currentUser.role !== 'admin' && currentUser.role !== 'seller') {
        throw new Error("Permission Denied: Only sellers or admins can add products.");
    }
    const newProduct: Product = {
      ...productData,
      id: Date.now(),
      reviews: [],
      addedOn: new Date().toISOString().split('T')[0],
    };
    products = [newProduct, ...products];
    return newProduct;
}

export const updateProduct = async (updatedProduct: Product, currentUser: User): Promise<Product> => {
    await simulateDelay(200);
    if (currentUser.role !== 'admin' && updatedProduct.sellerId !== currentUser.id) {
        throw new Error("Permission Denied: You can only edit your own products.");
    }
    products = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    return updatedProduct;
}

export const deleteProduct = async (productId: number, currentUser: User): Promise<void> => {
    await simulateDelay(300);
    const productToDelete = products.find(p => p.id === productId);
    if (!productToDelete) throw new Error("Product not found");

    if (currentUser.role !== 'admin' && productToDelete.sellerId !== currentUser.id) {
        throw new Error("Permission Denied: You can only delete your own products.");
    }
    products = products.filter(p => p.id !== productId);
}

export const addReview = async (productId: number, reviewData: Omit<Review, 'id' | 'date'>): Promise<Product> => {
    await simulateDelay(150);
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex === -1) throw new Error("Product not found");

    const newReview: Review = {
        ...reviewData,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
    };
    products[productIndex].reviews.unshift(newReview);
    return products[productIndex];
}


// --- User Management ---
export const updateUser = async (updatedUserData: User): Promise<User> => {
    await simulateDelay(200);
    users = users.map(u => u.id === updatedUserData.id ? updatedUserData : u);
    return updatedUserData;
}

export const deleteUser = async (userIdToDelete: number, currentUser: User): Promise<void> => {
    await simulateDelay(400);
    if (currentUser.role !== 'admin') {
        throw new Error("Permission Denied: Only admins can delete users.");
    }
    if (userIdToDelete === currentUser.id) {
        throw new Error("Security Error: Admins cannot delete their own account.");
    }
    
    const userToDelete = users.find(u => u.id === userIdToDelete);
    if (!userToDelete) {
        throw new Error("User not found.");
    }

    // If deleting a seller, reassign their products to the admin
    if (userToDelete.role === 'seller') {
        products = products.map(p => {
            if (p.sellerId === userIdToDelete) {
                return { ...p, sellerId: currentUser.id };
            }
            return p;
        });
    }

    users = users.filter(u => u.id !== userIdToDelete);
}

export const toggleWishlist = async (userId: number, productId: number): Promise<User> => {
    await simulateDelay(100);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");
    
    const user = users[userIndex];
    const wishlist = user.wishlist || [];
    const newWishlist = wishlist.includes(productId)
        ? wishlist.filter(id => id !== productId)
        : [...wishlist, productId];
    
    users[userIndex] = { ...user, wishlist: newWishlist };
    return users[userIndex];
}

export const updatePayoutDetails = async (userId: number, details: PayoutDetails): Promise<User> => {
    await simulateDelay(250);
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) throw new Error("User not found");

    users[userIndex] = { ...users[userIndex], payoutDetails: details };
    return users[userIndex];
}

// --- Order Management ---
export const createOrder = async (userId: number, cartItems: CartItem[]): Promise<Order> => {
    await simulateDelay(500);
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const newOrder: Order = {
        id: Date.now(),
        userId: userId,
        items: cartItems,
        date: new Date().toISOString(),
        total: subtotal * 1.10, // 10% tax
    };
    orders.push(newOrder);
    return newOrder;
}

// --- Admin Controls ---
export const setGlobalCommissionRate = async (rate: number): Promise<number> => {
    await simulateDelay(100);
     if (rate < 0 || rate > 1) {
      throw new Error("Commission rate must be between 0 (0%) and 1 (100%).");
    }
    globalCommissionRate = rate;
    return globalCommissionRate;
}

export const setSellerCommissionRate = async (sellerId: number, rate: number | null): Promise<User[]> => {
    await simulateDelay(150);
    users = users.map(user => {
        if (user.id === sellerId && user.role === 'seller') {
          const updatedUser = { ...user };
          if (rate !== null && rate >= 0 && rate <= 1) {
            updatedUser.commissionRate = rate;
          } else if (rate === null) {
            delete updatedUser.commissionRate;
          }
          return updatedUser;
        }
        return user;
    });
    return users;
}