import React from 'react';
import { TwitterIcon, GitHubIcon } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start">
              <span className="text-2xl font-bold text-white">Vian</span>
              <span className="text-2xl font-light text-slate-300">Store</span>
            </div>
            <p className="mt-2 text-sm">Premium digital assets for modern creators.</p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <TwitterIcon className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-white transition-colors">
              <span className="sr-only">GitHub</span>
              <GitHubIcon className="h-6 w-6" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VianStore. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
