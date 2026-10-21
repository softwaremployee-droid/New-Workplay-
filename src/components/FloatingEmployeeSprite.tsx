import React from 'react';
import { motion } from 'motion/react';

interface FloatingEmployeeSpriteProps {
  src: string;
  alt: string;
  index?: number;
  className?: string;
  imageClassName?: string;
  showShadow?: boolean;
  floatAmplitude?: number;
}

export const FloatingEmployeeSprite: React.FC<FloatingEmployeeSpriteProps> = ({
  src,
  alt,
  index = 0,
  className = '',
  imageClassName = '',
  showShadow = true,
  floatAmplitude = 8,
}) => {
  const duration = 3.6 + (index % 3) * 0.45;
  const delay = index * 0.25;

  return (
    <div className={`relative flex flex-col items-center justify-end bg-transparent select-none ${className}`}>
      <motion.div
        animate={{
          y: [0, -floatAmplitude, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }}
        className="w-full h-full flex items-end justify-center rounded-2xl overflow-hidden"
      >
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          draggable={false}
          className={`object-cover object-top w-full h-full ${imageClassName}`}
        />
      </motion.div>

      {showShadow && (
        <motion.div
          animate={{
            scaleX: [1, 0.75, 1],
            opacity: [0.18, 0.08, 0.18],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
          className="h-2 w-20 rounded-full bg-black/40 blur-[4px] -mt-1 pointer-events-none"
        />
      )}
    </div>
  );
};
