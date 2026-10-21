import React from 'react';
import { motion } from 'motion/react';
import { OdometerCounter } from './OdometerCounter';

interface FloatingTopLeftCardProps {
  allCount: number;
  storiesCount: number;
  cartCount: number;
  activeFilter: 'all' | 'stories';
  onSelectFilter: (filter: 'all' | 'stories') => void;
  onOpenCart: () => void;
  onOpenStories: () => void;
}

export const FloatingTopLeftCard: React.FC<FloatingTopLeftCardProps> = ({
  allCount,
  storiesCount,
  cartCount,
  activeFilter,
  onSelectFilter,
  onOpenCart,
  onOpenStories,
}) => {
  return (
    <motion.aside
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: 'easeOut', delay: 0.05 }}
      aria-label="Navigation and Cart"
      className="fixed top-[1.5%] left-[1.5%] z-30 bg-white rounded-none shadow-none border-none p-4 sm:p-5 w-[calc(100%-3%)] sm:w-auto min-w-[280px] sm:min-w-[340px]"
    >
      {/* Brand Wordmark (Italic, bold, expanded Archivo) */}
      <div className="mb-4">
        <button
          onClick={() => {
            onSelectFilter('all');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-archivo-expanded text-lg sm:text-xl font-black italic tracking-tighter text-black uppercase cursor-pointer hover:opacity-75 transition-opacity"
        >
          BÉCANE
        </button>
      </div>

      {/* Navigation & Counters Strip */}
      <div className="flex items-center justify-between gap-6 text-[12px] sm:text-[13px] font-archivo-expanded tracking-wider uppercase select-none">
        {/* Left items: ALL and STORIES */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => onSelectFilter('all')}
            className={`flex items-center gap-1.5 cursor-pointer transition-opacity ${
              activeFilter === 'all' ? 'text-black font-extrabold' : 'text-black/80 hover:text-black font-bold'
            }`}
          >
            <span>ALL</span>
            <OdometerCounter value={allCount} />
          </button>

          <button
            onClick={() => {
              onSelectFilter('stories');
              onOpenStories();
            }}
            className="flex items-center gap-1.5 text-black hover:text-neutral-600 font-bold cursor-pointer transition-opacity"
          >
            <span>STORIES</span>
            <OdometerCounter value={storiesCount} />
          </button>
        </div>

        {/* Right item: CART */}
        <div>
          <button
            onClick={onOpenCart}
            className="flex items-center gap-1.5 text-black hover:text-neutral-600 font-bold cursor-pointer transition-opacity"
          >
            <span>CART</span>
            <OdometerCounter value={cartCount} />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
