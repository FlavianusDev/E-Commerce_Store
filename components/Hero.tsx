import React from 'react';

const Hero: React.FC = () => {
  const handleScrollToProducts = () => {
    const productsSection = document.getElementById('product-list-header');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-primary to-indigo-600 rounded-lg shadow-xl overflow-hidden">
      <div className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center text-white">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
          Welcome to VianStore
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-indigo-100">
          Your premier destination for high-quality digital assets, code snippets, and templates.
        </p>
        <div className="mt-8">
          <button
            onClick={handleScrollToProducts}
            className="inline-block bg-white text-primary font-bold py-3 px-8 rounded-lg shadow-md hover:bg-indigo-50 transition-transform transform hover:scale-105"
          >
            Explore Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
