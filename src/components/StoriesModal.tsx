import React from 'react';
import { motion } from 'motion/react';
import { X, ArrowRight } from 'lucide-react';

interface StoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoriesModal: React.FC<StoriesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const stories = [
    {
      code: 'STORY 01',
      title: 'MIDNIGHT ON THE PÉRIPHÉRIQUE',
      date: 'FALL 2026',
      excerpt: 'Motorcycle speed test across Paris ring roads at 3:00 AM. Testing abrasion resistance of French waxed calfskin against asphalt friction.',
    },
    {
      code: 'STORY 02',
      title: 'PARACHUTE COTTON IN MOTION',
      date: 'WINTER 2026',
      excerpt: 'The engineering behind Bécane ripstop jumpsuits. 240gsm high-tenacity cotton woven with technical Kevlar blend threads.',
    },
    {
      code: 'STORY 03',
      title: 'THE GLOSS HELMET ARCHIVE',
      date: 'SUMMER 2026',
      excerpt: 'Collaborative development of the full-face helmet with custom aerodynamic brow spoiler and anti-fog magnetic visor.',
    },
    {
      code: 'STORY 04',
      title: 'ATELIER PARIS 11ÈME',
      date: 'ARCHIVE',
      excerpt: 'Inside our workshop where every garment is pattern-drafted, laser cut, and finished by master leather artisans.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl bg-white rounded-none shadow-2xl p-6 sm:p-10 font-archivo-expanded uppercase tracking-wider text-black relative select-none"
      >
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black italic">BÉCANE STORIES</span>
            <span className="text-xs font-bold text-neutral-400">04 VOLUMES</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Close stories"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-1 no-scrollbar">
          {stories.map((story) => (
            <div
              key={story.code}
              className="p-4 bg-[#F5F5F5] hover:bg-neutral-100 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400">
                <span>{story.code}</span>
                <span>{story.date}</span>
              </div>
              <h3 className="text-sm font-black text-black mt-1 group-hover:opacity-80 transition-opacity">
                {story.title}
              </h3>
              <p className="text-xs font-normal text-neutral-600 normal-case mt-2 leading-relaxed">
                {story.excerpt}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
