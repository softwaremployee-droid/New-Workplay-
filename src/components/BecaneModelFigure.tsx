import React from 'react';
import { motion } from 'motion/react';
import { BecaneProduct } from '../data/becaneProducts';

interface BecaneModelFigureProps {
  product: BecaneProduct;
  isSelected: boolean;
  onSelect: () => void;
  onHover?: (hovering: boolean) => void;
}

export const BecaneModelFigure: React.FC<BecaneModelFigureProps> = ({
  product,
  isSelected,
  onSelect,
  onHover,
}) => {
  const { index, silhouette } = product;

  // Render SVG cutout styling matching each specific look in the screenshot
  const renderLookArtwork = () => {
    switch (index) {
      case 1:
        // Model 1: Blonde female in black backless bodysuit and tall black boots (back profile)
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Blonde Hair */}
            <path d="M48 20 C42 22, 40 38, 42 55 C46 58, 54 58, 56 50 C58 38, 55 20, 48 20 Z" fill="#D8C39B" />
            <path d="M44 32 C42 42, 43 62, 45 70 C48 70, 52 68, 52 58 Z" fill="#C4AD82" />
            {/* Neck & Bare Back */}
            <path d="M46 52 C45 60, 44 80, 46 95 C49 98, 53 96, 54 85 C55 70, 53 54, 50 52 Z" fill="#E4C8B1" />
            {/* Black Bodysuit */}
            <path d="M44 85 C42 92, 40 115, 43 130 C46 138, 54 138, 56 128 C58 114, 56 90, 54 85 Z" fill="#141414" />
            <path d="M43 125 C40 135, 42 150, 47 154 C53 154, 56 145, 56 128 Z" fill="#0D0D0D" />
            {/* Legs in sheer black tights */}
            <path d="M44 148 C43 165, 42 190, 44 210 C46 210, 49 205, 49 190 C49 170, 48 152, 46 148 Z" fill="#242124" />
            <path d="M50 148 C50 168, 51 192, 53 210 C55 210, 58 200, 57 185 C56 168, 54 152, 52 148 Z" fill="#2A262A" />
            {/* Black Leather Boots */}
            <path d="M42 208 C41 225, 41 245, 40 262 C39 265, 47 266, 48 262 C49 248, 49 225, 48 208 Z" fill="#0A0A0A" />
            <path d="M51 208 C51 225, 52 245, 53 262 C53 265, 60 265, 59 261 C58 248, 56 225, 55 208 Z" fill="#0A0A0A" />
            {/* Heel / Sole Details */}
            <rect x="39" y="261" width="8" height="3" fill="#000000" />
            <rect x="53" y="260" width="8" height="3" fill="#000000" />
          </svg>
        );

      case 2:
        // Model 2: Olive green flight suit + glossy black helmet (side profile)
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Black Helmet with Visor */}
            <ellipse cx="50" cy="38" rx="14" ry="16" fill="#151515" />
            <path d="M40 34 C40 28, 48 26, 56 28 C60 30, 62 36, 60 42 C56 46, 44 46, 40 34 Z" fill="#050505" />
            <ellipse cx="46" cy="34" rx="4" ry="1.5" fill="#333333" opacity="0.6" />
            {/* Olive Green Flight Jumpsuit Torso */}
            <path d="M42 54 C38 65, 36 90, 39 120 C42 125, 58 125, 60 118 C61 95, 60 65, 56 54 Z" fill="#4D5845" />
            {/* Jumpsuit collar / chest zipper detail */}
            <line x1="49" y1="55" x2="49" y2="105" stroke="#373F32" strokeWidth="1.5" />
            {/* Belt cinch */}
            <rect x="40" y="116" width="20" height="4" fill="#3B4234" />
            {/* Arms folded / resting */}
            <path d="M38 65 C34 78, 34 95, 42 108 C45 106, 46 100, 44 92 C42 82, 42 70, 40 65 Z" fill="#444E3D" />
            {/* Baggy Olive Trousers */}
            <path d="M40 120 C38 145, 36 185, 38 245 C42 248, 48 248, 48 240 C47 200, 47 160, 48 135 Z" fill="#4D5845" />
            <path d="M50 120 C49 150, 50 190, 50 240 C52 248, 58 248, 60 242 C61 185, 59 145, 58 120 Z" fill="#454F3E" />
            {/* Dark Moto Combat Boots */}
            <path d="M36 242 C35 252, 33 260, 37 263 C46 264, 48 260, 47 248 Z" fill="#1C1C1C" />
            <path d="M49 242 C49 252, 50 260, 54 263 C61 264, 62 260, 60 248 Z" fill="#151515" />
          </svg>
        );

      case 3:
        // Model 3: Distressed long leather trench coat, slick hair, boots
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Slicked blonde/brown hair */}
            <path d="M48 22 C44 24, 43 32, 45 42 C48 45, 55 45, 56 38 C57 28, 54 22, 48 22 Z" fill="#B39973" />
            {/* Face in profile */}
            <path d="M44 32 C41 38, 42 46, 45 48 C47 48, 49 46, 49 40 Z" fill="#E8D1BC" />
            {/* Long Distressed Leather Trench Coat */}
            <path d="M43 48 C38 60, 33 110, 31 180 C30 220, 29 245, 35 248 C45 248, 60 248, 65 244 C68 220, 67 170, 63 110 C61 70, 56 50, 53 48 Z" fill="#3D291F" />
            {/* Leather texture / lapel highlights */}
            <path d="M46 50 C44 70, 45 100, 48 130 C50 130, 54 90, 53 50 Z" fill="#4D362B" />
            {/* Trench Belt */}
            <rect x="36" y="112" width="28" height="5" fill="#2E1E16" />
            {/* Lower Hem Cut & Boots peeking out */}
            <path d="M38 245 L42 262 L50 262 L48 245 Z" fill="#0F0F0F" />
            <path d="M52 245 L54 262 L62 262 L60 245 Z" fill="#171717" />
          </svg>
        );

      case 4:
        // Model 4: Double Denim (Vintage Blue Jacket & Flared Jeans)
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Dark Hair / Head */}
            <ellipse cx="48" cy="34" rx="8" ry="12" fill="#241B15" />
            <path d="M44 32 C40 38, 42 46, 46 48 C49 48, 50 44, 48 36 Z" fill="#C9A080" />
            {/* Denim Jacket (Boxy Vintage Blue) */}
            <path d="M38 48 C32 60, 30 85, 33 112 C40 115, 58 115, 63 108 C65 85, 63 60, 58 48 Z" fill="#4B6E8C" />
            {/* Denim Jacket Collar & Seams */}
            <path d="M44 48 L48 62 L52 48 Z" fill="#38546C" />
            <line x1="48" y1="62" x2="48" y2="110" stroke="#38546C" strokeWidth="1.5" />
            {/* Flared Washed Denim Jeans */}
            <path d="M36 112 C34 140, 32 190, 30 250 C36 254, 45 254, 46 248 C46 195, 46 150, 47 120 Z" fill="#527798" />
            <path d="M48 120 C48 150, 48 195, 49 248 C51 254, 60 254, 65 250 C63 190, 61 140, 59 112 Z" fill="#486B8A" />
            {/* Pointed Black Boots */}
            <path d="M30 250 C28 258, 30 263, 40 263 C44 263, 45 258, 44 250 Z" fill="#121212" />
            <path d="M50 250 C50 258, 52 263, 62 263 C65 263, 66 258, 64 250 Z" fill="#181818" />
          </svg>
        );

      case 5:
        // Model 5: Cream Textured Knit Sweater + Black Slim Trousers
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Blonde Bob Hair */}
            <path d="M46 24 C40 28, 40 44, 44 54 C48 55, 55 54, 56 46 C57 32, 54 24, 46 24 Z" fill="#E2CE9D" />
            {/* Neck */}
            <rect x="46" y="50" width="7" height="8" fill="#E8D1BC" />
            {/* Cream Chunky Textured Knit Sweater */}
            <path d="M38 56 C34 68, 33 92, 36 118 C42 122, 56 122, 62 116 C65 92, 64 68, 58 56 Z" fill="#EFE8D6" />
            <ellipse cx="48" cy="58" rx="8" ry="3" fill="#DFD6C2" />
            {/* Knit Ribbing Texture */}
            <line x1="38" y1="114" x2="60" y2="114" stroke="#DFD6C2" strokeWidth="2" />
            {/* Slim Black Trousers */}
            <path d="M38 118 C37 145, 36 195, 38 248 C41 251, 46 251, 47 245 C47 200, 46 150, 47 122 Z" fill="#151515" />
            <path d="M48 122 C48 150, 48 200, 49 245 C50 251, 55 251, 58 248 C59 195, 59 145, 58 118 Z" fill="#1C1C1C" />
            {/* Minimalist Black Leather Shoes */}
            <path d="M36 248 C34 256, 36 262, 44 262 C46 262, 47 256, 46 248 Z" fill="#0A0A0A" />
            <path d="M49 248 C49 256, 50 262, 58 262 C61 262, 62 256, 60 248 Z" fill="#0A0A0A" />
          </svg>
        );

      case 6:
        // Model 6: Brown Cafe Racer Leather + Gloss Black Helmet
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Black Motorcycle Helmet */}
            <ellipse cx="50" cy="36" rx="14" ry="16" fill="#111111" />
            <path d="M41 34 C41 27, 50 25, 57 28 C61 31, 61 38, 58 44 C53 47, 43 47, 41 34 Z" fill="#050505" />
            <ellipse cx="46" cy="33" rx="4" ry="1.5" fill="#444444" opacity="0.7" />
            {/* Cafe Racer Brown Leather Jacket */}
            <path d="M40 52 C35 64, 34 88, 37 114 C44 118, 56 118, 62 112 C64 88, 62 64, 57 52 Z" fill="#543725" />
            {/* Brass Zipper / Hardware Details */}
            <line x1="48" y1="53" x2="48" y2="112" stroke="#A88B57" strokeWidth="1.5" />
            {/* Dark Trousers */}
            <path d="M38 114 C36 142, 34 190, 36 248 C39 252, 45 252, 46 246 C46 195, 46 150, 47 118 Z" fill="#1C1C1C" />
            <path d="M48 118 C48 150, 48 195, 49 246 C50 252, 56 252, 59 248 C61 190, 59 142, 58 114 Z" fill="#141414" />
            {/* Riding Boots */}
            <path d="M34 248 C32 256, 34 262, 43 262 C46 262, 46 256, 45 248 Z" fill="#3D291E" />
            <path d="M50 248 C50 256, 51 262, 60 262 C63 262, 64 256, 62 248 Z" fill="#352319" />
          </svg>
        );

      case 7:
        // Model 7: All-Black Racing Suit
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Blonde Hair */}
            <path d="M47 22 C42 25, 41 38, 44 48 C48 50, 54 50, 56 42 C57 30, 54 22, 47 22 Z" fill="#D6C197" />
            {/* All-Black Fitted Technical Racing Suit */}
            <path d="M40 50 C36 62, 35 90, 38 116 C43 120, 56 120, 61 114 C64 90, 62 62, 57 50 Z" fill="#1A1A1A" />
            {/* Technical Contrast Seams */}
            <line x1="43" y1="55" x2="42" y2="114" stroke="#333333" strokeWidth="1" />
            <line x1="55" y1="55" x2="56" y2="114" stroke="#333333" strokeWidth="1" />
            {/* Black Fitted Racing Trousers */}
            <path d="M38 116 C36 145, 35 195, 37 250 C41 254, 46 254, 47 246 C47 195, 46 150, 47 120 Z" fill="#171717" />
            <path d="M48 120 C48 150, 48 195, 49 246 C50 254, 55 254, 58 250 C60 195, 59 145, 58 116 Z" fill="#121212" />
            {/* Black Boots */}
            <path d="M36 248 C34 256, 36 263, 44 263 C47 263, 47 256, 46 248 Z" fill="#0A0A0A" />
            <path d="M49 248 C49 256, 50 263, 58 263 C61 263, 62 256, 60 248 Z" fill="#0A0A0A" />
          </svg>
        );

      case 8:
        // Model 8: Oversized Motorsport Racing Hoodie + Cargo Trousers
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Head */}
            <ellipse cx="48" cy="34" rx="8" ry="12" fill="#2B211B" />
            {/* Oversized Black Hoodie with Red Accents */}
            <path d="M35 48 C28 62, 26 92, 30 124 C38 128, 60 128, 67 120 C70 92, 68 62, 62 48 Z" fill="#1F1F1F" />
            {/* Red Racing Accent on Collar/Chest */}
            <path d="M44 48 L48 64 L52 48 Z" fill="#C8232C" />
            {/* Baggy Washed Concrete Cargo Pants */}
            <path d="M32 124 C30 155, 28 200, 32 252 C38 256, 46 256, 47 248 C47 195, 46 150, 47 126 Z" fill="#788085" />
            <path d="M48 126 C48 150, 48 195, 49 248 C50 256, 58 256, 64 252 C68 200, 66 155, 64 124 Z" fill="#6C7378" />
            {/* Cargo Pocket flaps */}
            <rect x="29" y="165" width="8" height="12" fill="#5C6367" />
            <rect x="58" y="165" width="8" height="12" fill="#5C6367" />
            {/* Skate / Combat Footwear */}
            <path d="M30 250 C28 258, 30 264, 42 264 C45 264, 46 258, 45 250 Z" fill="#1C1C1C" />
            <path d="M50 250 C50 258, 51 264, 62 264 C65 264, 66 258, 64 250 Z" fill="#151515" />
          </svg>
        );

      case 9:
        // Model 9: Cropped Military Bomber + Moto Pants
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Blonde Hair Updo */}
            <path d="M46 22 C42 25, 41 38, 44 46 C48 48, 54 48, 56 42 C57 30, 54 22, 46 22 Z" fill="#DBC69D" />
            {/* Cropped Olive Flight Bomber */}
            <path d="M38 48 C32 60, 31 82, 34 104 C41 108, 56 108, 62 102 C65 82, 64 60, 58 48 Z" fill="#3D4536" />
            {/* Bomber Ribbed Hem */}
            <rect x="36" y="100" width="26" height="4" fill="#2F352A" />
            {/* Fitted Dark Trousers */}
            <path d="M38 104 C36 135, 34 190, 36 248 C40 252, 45 252, 46 246 C46 195, 46 145, 47 110 Z" fill="#242424" />
            <path d="M48 110 C48 145, 48 195, 49 246 C50 252, 55 252, 58 248 C60 190, 59 135, 58 104 Z" fill="#1D1D1D" />
            {/* Black Boots */}
            <path d="M34 248 C32 256, 34 262, 43 262 C46 262, 46 256, 45 248 Z" fill="#0D0D0D" />
            <path d="M49 248 C49 256, 50 262, 59 262 C62 262, 63 256, 61 248 Z" fill="#0D0D0D" />
          </svg>
        );

      case 10:
        // Model 10: Utility Tank & Desert Khaki Cargo + Helmet
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Dark Motorcycle Helmet */}
            <ellipse cx="50" cy="36" rx="14" ry="16" fill="#161616" />
            <path d="M41 33 C41 26, 50 24, 57 27 C61 30, 61 37, 58 43 C53 46, 43 46, 41 33 Z" fill="#080808" />
            {/* White Ribbed Tank Top */}
            <path d="M42 52 C39 64, 38 85, 41 106 C46 109, 54 109, 58 104 C60 85, 59 64, 56 52 Z" fill="#F4F4F4" />
            {/* Bare arms & neck */}
            <path d="M38 60 C34 72, 33 90, 36 102 C38 102, 40 95, 40 85 Z" fill="#E8D1BC" />
            <path d="M60 60 C64 72, 65 90, 62 102 C60 102, 58 95, 58 85 Z" fill="#E8D1BC" />
            {/* Wide Desert Khaki Utility Cargo Trousers */}
            <path d="M38 106 C35 138, 33 185, 34 248 C39 253, 46 253, 47 246 C47 195, 46 145, 47 110 Z" fill="#C7BBA5" />
            <path d="M48 110 C48 145, 48 195, 49 246 C50 253, 57 253, 62 248 C63 185, 61 138, 58 106 Z" fill="#BDB09A" />
            {/* Black Moto Boots */}
            <path d="M33 248 C31 256, 33 262, 43 262 C46 262, 46 256, 45 248 Z" fill="#111111" />
            <path d="M49 248 C49 256, 50 262, 60 262 C63 262, 64 256, 62 248 Z" fill="#111111" />
          </svg>
        );

      case 11:
      default:
        // Model 11: Boxy Heather Grey Tee + Vintage Straight Denim
        return (
          <svg viewBox="0 0 100 280" className="h-full w-auto select-none pointer-events-none drop-shadow-md">
            {/* Blonde Hair */}
            <path d="M46 24 C40 28, 40 44, 44 54 C48 55, 55 54, 56 46 C57 32, 54 24, 46 24 Z" fill="#D9C299" />
            {/* Boxy Heather Grey Tee */}
            <path d="M38 54 C32 66, 31 88, 34 112 C41 116, 56 116, 62 110 C65 88, 64 66, 58 54 Z" fill="#8C939A" />
            {/* Vintage Straight Denim Jeans */}
            <path d="M36 112 C34 142, 33 190, 34 250 C39 254, 45 254, 46 246 C46 195, 46 145, 47 116 Z" fill="#4C6E8C" />
            <path d="M48 116 C48 145, 48 195, 49 246 C50 254, 57 254, 62 250 C63 190, 62 142, 60 112 Z" fill="#44637E" />
            {/* Black Boots */}
            <path d="M33 250 C31 258, 33 263, 42 263 C45 263, 46 258, 45 250 Z" fill="#0F0F0F" />
            <path d="M49 250 C49 258, 50 263, 59 263 C63 263, 64 258, 62 250 Z" fill="#0F0F0F" />
          </svg>
        );
    }
  };

  return (
    <div
      onClick={onSelect}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
      className="relative flex flex-col items-center group cursor-pointer shrink-0 select-none"
    >
      {/* Floating Look Artwork with Hover Motion */}
      <motion.div
        animate={{
          y: isSelected ? -14 : 0,
          scale: isSelected ? 1.05 : 1,
        }}
        whileHover={{ y: -16, scale: 1.05 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-[280px] sm:h-[340px] md:h-[380px] flex items-end justify-center"
      >
        {renderLookArtwork()}
      </motion.div>

      {/* Realistic Floor Shadow Beneath Feet */}
      <motion.div
        animate={{
          scale: isSelected ? 1.25 : 1,
          opacity: isSelected ? 0.35 : 0.2,
        }}
        whileHover={{ scale: 1.3, opacity: 0.35 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="mt-1 h-2 w-16 sm:w-20 rounded-full bg-black blur-[3px]"
      />
    </div>
  );
};
