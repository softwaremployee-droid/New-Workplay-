import React, { useState } from 'react';
import { Maximize2, X, Copy, Check, ArrowRight, Eye } from 'lucide-react';
import { ShowcaseItem } from '../types';
import { SHOWCASE_GALLERY } from '../data/models';

interface ShowcaseGalleryProps {
  onLoadIntoPlayground: (prompt: string, model: string, seed: number) => void;
}

export const ShowcaseGallery: React.FC<ShowcaseGalleryProps> = ({ onLoadIntoPlayground }) => {
  const [selectedItem, setSelectedItem] = useState<ShowcaseItem | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const categories = ['All', 'Product Design', 'Identity Locking', 'Text Rendering', 'Scientific Macro'];

  const filteredItems = selectedFilter === 'All'
    ? SHOWCASE_GALLERY
    : SHOWCASE_GALLERY.filter((item) => item.category === selectedFilter);

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <section id="gallery" className="py-20 border-b border-neutral-800/80 bg-[#07090e]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <span>Production Verification</span>
              <span aria-hidden="true">·</span>
              <span>Visual Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Curated Model Renders
            </h2>
            <p className="mt-2 text-base text-neutral-400 max-w-2xl">
              Inspect unretouched raw outputs across diverse prompt regimes, showing micro-surface finish, 
              crisp typography, and character locking.
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-neutral-800 bg-[#0c1017] overflow-hidden transition-all duration-300 hover:border-neutral-700 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div 
                onClick={() => setSelectedItem(item)}
                className="relative aspect-[16/10] overflow-hidden bg-neutral-950 cursor-pointer"
              >
                <img
                  src={item.imageSrc}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/80 backdrop-blur-md text-xs font-semibold text-white border border-neutral-700">
                    <Maximize2 className="h-3.5 w-3.5 text-amber-400" />
                    <span>Inspect Raw Latent</span>
                  </div>
                </div>

                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono-numbers text-neutral-300 border border-neutral-800">
                  {item.model}
                </div>
              </div>

              {/* Card Meta & Prompt */}
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-numbers">{item.resolution}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-numbers">{item.renderTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                    "{item.prompt}"
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.highlights.map((h, i) => (
                      <span key={i} className="text-[11px] text-neutral-400 bg-neutral-900 border border-neutral-800/80 px-2.5 py-1 rounded-md">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-mono-numbers">
                    Seed: {item.seed}
                  </span>
                  <button
                    onClick={() => onLoadIntoPlayground(item.prompt, item.model, item.seed)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>Test in Playground</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox */}
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
            <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-[#0c1017] overflow-hidden shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/70 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                <div className="md:col-span-7 bg-neutral-950 flex items-center justify-center">
                  <img
                    src={selectedItem.imageSrc}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                </div>

                <div className="md:col-span-5 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
                      <span>{selectedItem.model}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedItem.category}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{selectedItem.title}</h3>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                        <span>Exact Prompt</span>
                        <button
                          onClick={() => handleCopyPrompt(selectedItem.prompt)}
                          className="flex items-center gap-1 text-amber-400 hover:text-amber-300 text-[11px] cursor-pointer"
                        >
                          {copiedPrompt ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950 text-xs text-neutral-300 leading-relaxed font-mono">
                        {selectedItem.prompt}
                      </div>
                    </div>

                    <div className="space-y-2 text-xs pt-3 border-t border-neutral-800 text-neutral-400">
                      <div className="flex justify-between">
                        <span>Resolution</span>
                        <span className="font-mono-numbers text-white">{selectedItem.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Inference Latency</span>
                        <span className="font-mono-numbers text-white">{selectedItem.renderTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latent Seed</span>
                        <span className="font-mono-numbers text-white">{selectedItem.seed}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800">
                    <button
                      onClick={() => {
                        onLoadIntoPlayground(selectedItem.prompt, selectedItem.model, selectedItem.seed);
                        setSelectedItem(null);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors cursor-pointer"
                    >
                      <span>Load Parameters into Studio</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
