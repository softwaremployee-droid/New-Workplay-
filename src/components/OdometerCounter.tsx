import React from 'react';
import { motion } from 'motion/react';

interface OdometerDigitProps {
  digit: string;
}

const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const OdometerDigit: React.FC<OdometerDigitProps> = ({ digit }) => {
  const isNumber = !isNaN(parseInt(digit, 10));
  const numericValue = isNumber ? parseInt(digit, 10) : 0;

  if (!isNumber) {
    return <span className="inline-block px-0.5">{digit}</span>;
  }

  return (
    <div className="relative inline-block h-[1.1em] overflow-hidden align-middle leading-none">
      <motion.div
        animate={{ y: `-${numericValue * 10}%` }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col"
      >
        {DIGITS.map((d) => (
          <span key={d} className="inline-block h-[1.1em] tabular-numbers leading-none text-center">
            {d}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

interface OdometerCounterProps {
  value: number;
  padDigits?: number;
  prefix?: string;
  className?: string;
}

export const OdometerCounter: React.FC<OdometerCounterProps> = ({
  value,
  padDigits = 2,
  prefix = '',
  className = 'text-[#8E8E93]',
}) => {
  const formattedString = `${prefix}${value.toString().padStart(padDigits, '0')}`;

  return (
    <span className={`inline-flex items-center tabular-numbers tracking-normal ${className}`}>
      {formattedString.split('').map((char, index) => (
        <OdometerDigit key={`${index}-${char}`} digit={char} />
      ))}
    </span>
  );
};
