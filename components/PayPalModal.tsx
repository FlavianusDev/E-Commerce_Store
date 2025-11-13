import React, { useEffect, useRef } from 'react';
import { PayPalIcon, XMarkIcon } from '../constants';

interface PayPalModalProps {
  onClose: () => void;
  onConfirm: () => void;
  total: number;
}

const PayPalModal: React.FC<PayPalModalProps> = ({ onClose, onConfirm, total }) => {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    confirmButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="paypal-modal-title"
      >
        <div className="p-6 text-center">
            <button
                onClick={onClose}
                aria-label="Close dialog"
                className="absolute top-2 right-2 text-slate-400 hover:text-slate-700"
            >
                <XMarkIcon className="h-5 w-5" />
            </button>
          <PayPalIcon className="w-24 h-24 mx-auto -mt-4" />
          <h2 id="paypal-modal-title" className="text-xl font-bold text-slate-800 mt-2">
            Confirm your payment
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You're paying VianStore
          </p>
          <p className="text-5xl font-bold text-slate-900 my-6">
            ${total.toFixed(2)}
          </p>
          <p className="text-xs text-slate-400">
            Clicking confirm will complete your purchase. This is a simulation and no real payment will be processed.
          </p>
        </div>
        <div className="p-4 bg-slate-50">
          <button
            ref={confirmButtonRef}
            onClick={onConfirm}
            className="w-full bg-[#0070ba] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#005ea6] transition-colors"
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PayPalModal;
