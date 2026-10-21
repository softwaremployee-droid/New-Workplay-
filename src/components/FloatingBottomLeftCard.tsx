import React from 'react';
import { motion } from 'motion/react';
import { OdometerCounter } from './OdometerCounter';

interface FloatingBottomLeftCardProps {
  productCount: number;
  onDiscover: () => void;
}

export const FloatingBottomLeftCard: React.FC<FloatingBottomLeftCardProps> = ({
  productCount,
  onDiscover,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut', delay: 0.25 }}
      aria-label="Product Count and Discover Action"
      className="fixed bottom-[1.5%] left-[1.5%] z-30 bg-white rounded-none shadow-none border-none px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-8 text-[12px] sm:text-[13px] font-archivo-expanded tracking-wider uppercase w-[calc(100%-3%)] sm:w-auto min-w-[240px] sm:min-w-[280px] select-none"
    >
      {/* Product count */}
      <div className="flex items-center gap-1.5 text-black font-extrabold">
        <OdometerCounter value={productCount} className="text-[#8E8E93]" />
        <span>PRODUCTS</span>
      </div>

      {/* Discover Action */}
      <button
        onClick={onDiscover}
        className="text-[#8E8E93] hover:text-black font-bold transition-colors cursor-pointer"
      >
        DISCOVER
      </button>
    </motion.aside>
  );
};
