import React from 'react';
import { motion } from 'motion/react';

interface DragHandleProps {
  hasDragged: boolean;
  onPan?: () => void;
}

export const DragHandle: React.FC<DragHandleProps> = ({ hasDragged, onPan }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{
        opacity: hasDragged ? 0 : 1,
        y: 0,
      }}
      transition={{ duration: 0.38, ease: 'easeOut', delay: 0.35 }}
      className={`fixed bottom-[1.8%] left-1/2 -translate-x-1/2 z-30 pointer-events-auto transition-opacity duration-500 ${
        hasDragged ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div
        onClick={onPan}
        className="h-2 w-14 rounded-full bg-[#7C7C82] hover:bg-[#5A5A60] active:scale-95 transition-all cursor-grab active:cursor-grabbing shadow-sm"
        title="Drag to explore collection runway"
        aria-label="Drag handle"
      />
    </motion.div>
  );
};
