import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight, ArrowLeft, Plus, Check } from 'lucide-react';
import { BecaneProduct } from '../data/becaneProducts';
import { BecaneModelFigure } from './BecaneModelFigure';

interface DiscoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: BecaneProduct;
  onNext: () => void;
  onPrev: () => void;
  onAddToCart: (product: BecaneProduct) => void;
  isItemInCart: boolean;
}

export const DiscoverModal: React.FC<DiscoverModalProps> = ({
  isOpen,
  onClose,
  product,
  onNext,
  onPrev,
  onAddToCart,
  isItemInCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white rounded-none shadow-2xl p-6 sm:p-10 font-archivo-expanded uppercase tracking-wider text-black relative select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-neutral-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-center pt-2">
          {/* Left: Silhouette Figure Preview */}
          <div className="sm:col-span-5 h-[320px] bg-[#F5F5F5] flex items-end justify-center p-4 relative">
            <div className="h-full flex items-end justify-center">
              <BecaneModelFigure
                product={product}
                isSelected={true}
                onSelect={() => {}}
              />
            </div>
            <div className="absolute top-3 left-3 text-[11px] font-bold text-neutral-400">
              {product.code}
            </div>
          </div>

          {/* Right: Details & Action */}
          <div className="sm:col-span-7 flex flex-col justify-between h-full space-y-5">
            <div>
              <div className="text-[11px] font-bold text-[#8E8E93] tracking-widest">
                COLLECTION 01 / LOOK {product.index.toString().padStart(2, '0')}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight mt-1">
                {product.title}
              </h2>
              <div className="text-base font-extrabold text-black mt-2">
                €{product.priceEur}
              </div>
              <p className="mt-4 text-xs font-normal text-neutral-600 normal-case leading-relaxed">
                {product.details}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-neutral-100">
              <button
                onClick={() => onAddToCart(product)}
                className={`w-full py-3.5 text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isItemInCart
                    ? 'bg-neutral-900 text-white hover:bg-black'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                {isItemInCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>ADD TO CART · €{product.priceEur}</span>
                  </>
                )}
              </button>

              {/* Prev / Next Pagination */}
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 pt-1">
                <button
                  onClick={onPrev}
                  className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>PREVIOUS</span>
                </button>
                <span className="text-[11px] tabular-numbers font-medium">
                  {product.index} OF 14
                </span>
                <button
                  onClick={onNext}
                  className="hover:text-black transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>NEXT</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
