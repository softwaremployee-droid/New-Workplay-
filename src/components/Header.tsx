import React from 'react';
import { Bookmark, Search, SlidersHorizontal } from 'lucide-react';

interface HeaderProps {
  shortlistCount: number;
  onOpenShortlist: () => void;
  currency: 'EUR' | 'USD' | 'GBP';
  onCurrencyChange: (c: 'EUR' | 'USD' | 'GBP') => void;
  onScrollTo: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  shortlistCount,
  onOpenShortlist,
  currency,
  onCurrencyChange,
  onScrollTo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/90 bg-[#F8F9FA]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Brand Wordmark (Zone 1) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-baseline gap-2 group cursor-pointer"
        >
          <span className="font-display text-xl font-extrabold tracking-tighter text-[#0A0A0A]">
            CADRE
          </span>
          <span className="text-[10px] font-mono-numbers tracking-widest uppercase text-neutral-400 group-hover:text-black transition-colors">
            PARIS / TECH
          </span>
        </a>

        {/* Navigation Links (Zone 2) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-neutral-600">
          <button
            onClick={() => onScrollTo('directory')}
            className="hover:text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            Directory
          </button>
          <button
            onClick={() => onScrollTo('standards')}
            className="hover:text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            Audit Standards
          </button>
          <button
            onClick={() => onScrollTo('calculator')}
            className="hover:text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            Squad Economics
          </button>
          <button
            onClick={() => onScrollTo('faq')}
            className="hover:text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            Direct Hire Protocol
          </button>
        </nav>

        {/* Primary Actions (Zone 3) */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center border border-neutral-200 rounded-md p-0.5 bg-white text-[11px] font-mono-numbers">
            {(['EUR', 'USD', 'GBP'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                  currency === c
                    ? 'bg-[#0A0A0A] text-white font-semibold'
                    : 'text-neutral-500 hover:text-black'
                }`}
              >
                {c === 'EUR' ? '€ EUR' : c === 'USD' ? '$ USD' : '£ GBP'}
              </button>
            ))}
          </div>

          {/* Shortlist Drawer Trigger */}
          <button
            onClick={onOpenShortlist}
            className="relative flex items-center gap-2 rounded-full border border-neutral-900 bg-[#0A0A0A] px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Shortlist</span>
            <span className="font-mono-numbers flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
              {shortlistCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
