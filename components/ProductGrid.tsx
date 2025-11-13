

import React from 'react';
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  currentUser: User | null;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, selectedVariations: { [key: string]: string }) => void;
  onToggleWishlist: (productId: number) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, currentUser, onProductClick, onAddToCart, onToggleWishlist }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          currentUser={currentUser}
          onProductClick={onProductClick}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          isInWishlist={currentUser?.wishlist?.includes(product.id) || false}
        />
      ))}
    </div>
  );
};

export default ProductGrid;