import React, { useState, useEffect } from 'react';
import { Product, User } from '../types';
import { ShoppingBagIcon, HeartIcon } from '../constants';
import Tooltip from './Tooltip';

interface ProductCardProps {
  product: Product;
  currentUser: User | null;
  isInWishlist: boolean;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, selectedVariations: { [key: string]: string }) => void;
  onToggleWishlist: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, currentUser, isInWishlist, onProductClick, onAddToCart, onToggleWishlist }) => {
  const [imageSrc, setImageSrc] = useState(product.imageUrl);
  const hasVariations = !!(product.variations && product.variations.length > 0);

  useEffect(() => {
    setImageSrc(product.imageUrl);
  }, [product.imageUrl]);

  const handleImageError = () => {
    const placeholderUrl = `https://via.placeholder.com/600x600.png?text=${encodeURIComponent(product.name)}`;
    setImageSrc(placeholderUrl);
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    if (hasVariations) {
      onProductClick(product); // Open modal if there are variations
    } else {
      onAddToCart(product, {});
    }
  };

  const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onToggleWishlist(product.id);
  }

  const formattedDate = new Date(product.addedOn).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Tooltip text="View product details">
      <div 
        onClick={() => onProductClick(product)}
        className="group/card relative bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 flex flex-col cursor-pointer"
      >
        <div className="relative aspect-w-1 aspect-h-1 w-full overflow-hidden">
          <img
            src={imageSrc}
            onError={handleImageError}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/50 flex justify-center items-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProductClick(product);
              }}
              className="bg-white text-slate-900 font-semibold py-2 px-5 rounded-full shadow-lg hover:bg-slate-200 transition-colors text-sm"
              aria-label={`Quick view ${product.name}`}
            >
              Quick View
            </button>
          </div>
        </div>
        <Tooltip text={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
          <button
            onClick={handleWishlistClick}
            className="absolute top-2 right-2 p-2 bg-white/70 rounded-full text-slate-600 hover:text-red-500 hover:bg-white transition-all z-10"
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <HeartIcon className={`h-6 w-6 ${isInWishlist ? 'text-red-600' : ''}`} solid={isInWishlist} />
          </button>
        </Tooltip>
        <div className="p-4 flex flex-col flex-grow bg-slate-50">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.category}</h3>
            <p className="text-xs text-slate-400" title={`Added on ${formattedDate}`}>
              Added: {formattedDate}
            </p>
          </div>
          <p className="text-base font-semibold text-slate-900 flex-grow">{product.name}</p>
          
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            <Tooltip text={hasVariations ? 'Select options' : 'Add to Cart'}>
              <button
                onClick={handleAddToCartClick}
                className="p-2 bg-slate-100 rounded-full text-slate-600 group-hover/card:bg-primary group-hover/card:text-white transition-colors"
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingBagIcon className="h-5 w-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default ProductCard;