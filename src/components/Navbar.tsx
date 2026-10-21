import React, { useState } from 'react';
import { Menu, X, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenApiModal: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApiModal, onScrollToSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    onScrollToSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800/80 bg-[#090b10]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-6 lg:px-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 transition-opacity hover:opacity-90"
        >
          <span className="inline-block text-amber-400">🍌</span>
          <span>Nano Banana</span>
        </a>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
          <button
            onClick={() => handleNavClick('capabilities')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Capabilities
          </button>
          <button
            onClick={() => handleNavClick('studio')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Studio Playground
          </button>
          <button
            onClick={() => handleNavClick('models')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Model Weights
          </button>
          <button
            onClick={() => handleNavClick('gallery')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Gallery & Benchmarks
          </button>
          <button
            onClick={() => handleNavClick('developer')}
            className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            API Docs
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-neutral-950 transition-colors hover:bg-amber-300 active:scale-[0.98] whitespace-nowrap shrink-0 shadow-sm shadow-amber-400/20 cursor-pointer"
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Get API Key</span>
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-neutral-800 bg-[#0c1017] px-6 py-5 md:hidden space-y-4">
          <div className="flex flex-col gap-3 text-sm font-medium text-neutral-300">
            <button
              onClick={() => handleNavClick('capabilities')}
              className="text-left py-2 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Capabilities
            </button>
            <button
              onClick={() => handleNavClick('studio')}
              className="text-left py-2 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Studio Playground
            </button>
            <button
              onClick={() => handleNavClick('models')}
              className="text-left py-2 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Model Weights
            </button>
            <button
              onClick={() => handleNavClick('gallery')}
              className="text-left py-2 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              Gallery & Benchmarks
            </button>
            <button
              onClick={() => handleNavClick('developer')}
              className="text-left py-2 hover:text-amber-400 transition-colors whitespace-nowrap"
            >
              API Docs
            </button>
          </div>
          <div className="pt-2 border-t border-neutral-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApiModal();
              }}
              className="w-full flex justify-center items-center gap-2 rounded-lg bg-amber-400 py-2.5 text-xs font-semibold text-neutral-950"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span>Get API Key</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
