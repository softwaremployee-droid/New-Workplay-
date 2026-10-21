import React from 'react';
import { motion } from 'motion/react';
import { BecaneProduct } from '../data/becaneProducts';
import { BecaneModelFigure } from './BecaneModelFigure';

interface FloatingTopRightCardProps {
  currentCollection: string;
  totalCollections: string;
  activeProduct: BecaneProduct;
  onOpenDetails: () => void;
}

export const FloatingTopRightCard: React.FC<FloatingTopRightCardProps> = ({
  currentCollection = '01',
  totalCollections = '01',
  activeProduct,
  onOpenDetails,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut', delay: 0.15 }}
      onClick={onOpenDetails}
      aria-label="Collection Information"
      className="fixed top-[1.5%] right-[1.5%] z-30 bg-white rounded-none shadow-none border-none p-3.5 sm:p-4.5 flex items-center gap-4 text-[12px] sm:text-[13px] font-archivo-expanded tracking-wider uppercase cursor-pointer hover:bg-neutral-50 transition-colors select-none"
    >
      {/* Label and Collection Fraction */}
      <div className="flex items-center gap-2">
        <span className="text-black font-extrabold">COLLECTION</span>
        <span className="text-[#8E8E93] tabular-numbers font-medium">
          {currentCollection} / {totalCollections}
        </span>
      </div>

      {/* Tiny Model Preview Thumbnail Box matching screenshot */}
      <div className="h-8 w-5 sm:h-9 sm:w-6 border border-neutral-300 overflow-hidden bg-neutral-100 flex items-end justify-center p-0.5">
        <div className="h-full w-full flex items-end justify-center transform scale-90">
          <BecaneModelFigure
            product={activeProduct}
            isSelected={false}
            onSelect={() => {}}
          />
        </div>
      </div>
    </motion.aside>
  );
};
