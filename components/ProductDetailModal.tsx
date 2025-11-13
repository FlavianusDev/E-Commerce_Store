import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Product, Review, User } from '../types';
import { XMarkIcon, StarIcon, HeartIcon } from '../constants';
import Tooltip from './Tooltip';

interface ProductDetailModalProps {
  product: Product;
  users: User[];
  currentUser: User;
  onClose: () => void;
  onAddToCart: (product: Product, selectedVariations: { [key: string]: string }) => void;
  onAddReview: (productId: number, review: Omit<Review, 'id' | 'date'>) => void;
  onToggleWishlist: (productId: number) => void;
}

// Reusable Star Rating Display Component
const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(<StarIcon key={i} className="h-5 w-5 text-yellow-500" solid={i <= rating} />);
  }
  return (
    <div className="flex items-center" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
        {stars}
    </div>
  );
};


const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, users, currentUser, onClose, onAddToCart, onAddReview, onToggleWishlist }) => {
  const [imageSrc, setImageSrc] = useState(product.imageUrl);
  
  // States for review form
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  // State for variations
  const [selectedVariations, setSelectedVariations] = useState<{ [key: string]: string }>({});
  const hasVariations = !!(product.variations && product.variations.length > 0);

  // State for tabs
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setImageSrc(product.imageUrl);
    // Reset variations when product changes
    setSelectedVariations({});
    setActiveTab('description');
  }, [product]);

  const handleImageError = () => {
    const placeholderUrl = `https://via.placeholder.com/800x800.png?text=${encodeURIComponent(product.name)}`;
    setImageSrc(placeholderUrl);
  };

  const isInWishlist = useMemo(() => {
    return currentUser?.wishlist?.includes(product.id) || false;
  }, [currentUser, product.id]);

  const seller = useMemo(() => {
    return users.find(u => u.id === product.sellerId);
  }, [users, product.sellerId]);

  const allVariationsSelected = useMemo(() => {
    if (!hasVariations) return true;
    return product.variations.length === Object.keys(selectedVariations).length;
  }, [product.variations, selectedVariations, hasVariations]);

  const handleVariationChange = (variationName: string, optionName: string) => {
    setSelectedVariations(prev => ({
      ...prev,
      [variationName]: optionName,
    }));
  };

  useEffect(() => {
    lastFocusedElementRef.current = document.activeElement as HTMLElement;
    
    const modalElement = modalRef.current;
    if (!modalElement) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'Tab') {
        const focusableElements = modalElement.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            event.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            event.preventDefault();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [onClose]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor || reviewRating === 0 || !reviewComment) {
      alert('Please fill out all fields to submit a review.');
      return;
    }
    onAddReview(product.id, {
      author: reviewAuthor,
      rating: reviewRating,
      comment: reviewComment,
    });
    // Reset form
    setReviewAuthor('');
    setReviewRating(0);
    setReviewComment('');
  };

  const averageRating = useMemo(() => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((acc, review) => acc + review.rating, 0);
    return total / product.reviews.length;
  }, [product.reviews]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
      >
        <Tooltip text="Close">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 z-20 p-1 bg-white/50 rounded-full"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </Tooltip>
        <div className="w-full md:w-1/2 flex-shrink-0">
          <img src={imageSrc} onError={handleImageError} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-hidden">
          <div className="flex-shrink-0">
            <span className="text-sm font-medium text-primary">{product.category}</span>
            <h2 id="product-modal-title" className="text-3xl font-bold text-slate-900 mt-2">{product.name}</h2>
            {seller && (
                <p className="text-sm text-slate-500 mt-1">Sold by: <span className="font-medium text-slate-600">{seller.storeName || seller.name}</span></p>
            )}
            <p className="text-3xl font-bold text-slate-800 mt-4">${product.price.toFixed(2)}</p>
            
            {hasVariations && (
              <div className="mt-6 space-y-3">
                {product.variations.map(variation => (
                  <div key={variation.name}>
                    <label htmlFor={`modal-variation-${product.id}-${variation.name}`} className="block text-sm font-medium text-gray-700">{variation.name}</label>
                    <select
                      id={`modal-variation-${product.id}-${variation.name}`}
                      name={variation.name}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      onChange={(e) => handleVariationChange(variation.name, e.target.value)}
                      defaultValue=""
                    >
                      <option value="" disabled>Select {variation.name}</option>
                      {variation.options.map(option => (
                        <option key={option.name} value={option.name}>{option.name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex items-center gap-3">
              <Tooltip text={hasVariations && !allVariationsSelected ? "Please select all options" : "Add this item to your shopping cart"}>
                <button
                  onClick={() => onAddToCart(product, selectedVariations)}
                  disabled={hasVariations && !allVariationsSelected}
                  className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-hover transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </Tooltip>
              <Tooltip text={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="p-3 border border-slate-300 rounded-lg text-slate-600 hover:border-red-500 hover:text-red-500 transition-colors"
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <HeartIcon className={`h-6 w-6 ${isInWishlist ? 'text-red-500' : ''}`} solid={isInWishlist} />
                </button>
              </Tooltip>
            </div>
          </div>
          
          <div className="flex-grow mt-6 pt-6 border-t border-slate-200 flex flex-col min-h-0">
            <div className="flex-shrink-0 border-b border-slate-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('description')} className={`py-3 px-1 text-sm font-medium ${activeTab === 'description' ? 'border-b-2 border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Description
                    </button>
                    <button onClick={() => setActiveTab('reviews')} className={`py-3 px-1 text-sm font-medium ${activeTab === 'reviews' ? 'border-b-2 border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
                        Reviews ({product.reviews.length})
                    </button>
                </nav>
            </div>
            <div className="py-6 flex-grow overflow-y-auto">
              {activeTab === 'description' && (
                  <p className="text-slate-600 animate-fade-in">{product.description}</p>
              )}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in">
                  <h3 className="text-xl font-semibold text-slate-800">Customer Reviews</h3>
                  {product.reviews.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mt-2 mb-4">
                        <StarRatingDisplay rating={averageRating} />
                        <span className="text-slate-600">
                          {averageRating.toFixed(1)} out of 5 ({product.reviews.length} reviews)
                        </span>
                      </div>
                      <div className="space-y-4 max-h-40 overflow-y-auto pr-2">
                        {product.reviews.map(review => (
                          <div key={review.id} className="border-b border-slate-100 pb-2">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-slate-800">{review.author}</p>
                              <StarRatingDisplay rating={review.rating} />
                            </div>
                            <p className="text-sm text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                            <p className="text-slate-600 mt-1">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-slate-500 mt-2">No reviews yet. Be the first to leave one!</p>
                  )}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                     <h3 className="text-lg font-semibold text-slate-800 mb-2">Leave a Review</h3>
                     <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <input type="text" value={reviewAuthor} onChange={e => setReviewAuthor(e.target.value)} placeholder="Your Name" className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
                        <fieldset className="border-none p-0">
                          <legend className="sr-only">Product Rating</legend>
                          <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
                              {[1, 2, 3, 4, 5].map(star => (
                                  <button type="button" key={star} aria-label={`Rate ${star} out of 5 stars`} onClick={() => setReviewRating(star)} onMouseEnter={() => setHoverRating(star)}>
                                     <StarIcon className={`h-7 w-7 cursor-pointer ${(hoverRating || reviewRating) >= star ? 'text-yellow-500' : 'text-slate-400'}`} solid={(hoverRating || reviewRating) >= star}/>
                                  </button>
                              ))}
                          </div>
                        </fieldset>
                        <textarea rows={3} value={reviewComment} onChange={e => setReviewComment(e.target.value)} placeholder="Write your review..." className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required></textarea>
                        <Tooltip text="Submit your review for this product">
                            <button type="submit" className="w-full bg-secondary text-white py-2 px-4 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed" disabled={!reviewAuthor || !reviewComment || reviewRating === 0}>
                                Submit Review
                            </button>
                        </Tooltip>
                     </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;