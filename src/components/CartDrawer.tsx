import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { BecaneProduct } from '../data/becaneProducts';
import { OdometerCounter } from './OdometerCounter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: BecaneProduct[];
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const totalEur = cartItems.reduce((acc, curr) => acc + curr.priceEur, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white h-full flex flex-col justify-between p-6 sm:p-8 font-archivo-expanded uppercase tracking-wider text-black select-none"
      >
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <span className="text-base sm:text-lg font-black italic tracking-tight">CART</span>
              <OdometerCounter value={cartItems.length} className="text-neutral-500 font-bold" />
            </div>

            <button
              onClick={onClose}
              className="p-1 hover:opacity-60 transition-opacity cursor-pointer"
              aria-label="Close cart"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
            {cartItems.length === 0 ? (
              <div className="py-16 text-center text-xs text-neutral-400 font-medium">
                YOUR BAG IS EMPTY.
                <div className="mt-2 text-neutral-600">CLICK ANY LOOK ON THE RUNWAY TO ADD.</div>
              </div>
            ) : (
              cartItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="flex items-center justify-between p-3.5 bg-[#F5F5F5] rounded-none"
                >
                  <div>
                    <div className="text-[11px] font-bold text-neutral-400">{item.code}</div>
                    <div className="text-xs font-black text-black">{item.title}</div>
                    <div className="text-xs font-bold text-neutral-600">€{item.priceEur}</div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-neutral-400 hover:text-black transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer with Total and Checkout */}
        <div className="pt-6 border-t border-neutral-200 space-y-4">
          <div className="flex items-center justify-between text-xs font-black">
            <span>TOTAL ESTIMATE</span>
            <span className="tabular-numbers">€{totalEur.toLocaleString()}</span>
          </div>

          <button
            onClick={() => {
              alert('Redirecting to secure Bécane Paris checkout...');
            }}
            disabled={cartItems.length === 0}
            className="w-full bg-black text-white py-3.5 text-xs font-black tracking-widest uppercase hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>PROCEED TO ORDER</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          {cartItems.length > 0 && (
            <button
              onClick={onClearCart}
              className="w-full text-center text-[11px] text-neutral-400 hover:text-black transition-colors cursor-pointer py-1 font-bold"
            >
              CLEAR BAG
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
