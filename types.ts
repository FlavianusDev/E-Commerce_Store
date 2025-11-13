export interface Review {
  id: number;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface VariationOption {
  name: string;
}
export interface VariationType {
  name: string;
  options: VariationOption[];
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  reviews: Review[];
  fileUrl: string; // For digital downloads
  sellerId: number;
  isFeatured?: boolean;
  variations?: VariationType[];
  addedOn: string; // YYYY-MM-DD format
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
  selectedVariations: { [key: string]: string };
}

export interface PayoutDetails {
  method: 'bank' | 'paypal';
  accountNumber?: string;
  routingNumber?: string;
  paypalEmail?: string;
}

export type AuthProvider = 'local' | 'google' | 'github';

export interface User {
  id: number;
  username: string;
  password?: string; // Password is optional for social logins
  role: 'user' | 'admin' | 'seller';
  name: string;
  shippingAddress: string;
  storeName?: string;
  storeDescription?: string;
  commissionRate?: number; // e.g., 0.10 for 10%
  wishlist?: number[]; // Array of product IDs
  payoutDetails?: PayoutDetails;
  authProvider: AuthProvider;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  date: string;
  total: number;
}

// Used for the sign-up process
export interface SignUpData {
  username: string;
  password?: string;
  name: string;
  shippingAddress: string;
  isSeller: boolean;
  storeName?: string;
  storeDescription?: string;
  authProvider: AuthProvider;
}