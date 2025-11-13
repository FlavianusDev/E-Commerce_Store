import React from 'react';
import { Product, User } from '../types';
import ProductCard from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  currentUser: User | null;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, selectedVariations: { [key: string]: string }) => void;
  onToggleWishlist: (productId: number) => void;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, currentUser, onProductClick, onAddToCart, onToggleWishlist }) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Products</h2>
      <div className="flex space-x-6 pb-4 -mx-4 px-4 overflow-x-auto">
        {products.map(product => (
          <div key={product.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
             <ProductCard
              product={product}
              currentUser={currentUser}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              isInWishlist={currentUser?.wishlist?.includes(product.id) || false}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;