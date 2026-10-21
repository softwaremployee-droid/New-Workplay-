import React from 'react';
import { Layers, Type, UserCheck, Zap, ArrowUpRight } from 'lucide-react';
import { CHARACTER_IMAGE, TYPOGRAPHY_IMAGE, MACRO_IMAGE } from '../data/models';

export const CapabilitiesBento: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 border-b border-neutral-800/80 bg-[#090b10]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <span>Architectural Innovations</span>
            <span aria-hidden="true">·</span>
            <span>Why Nano Banana</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Beyond Standard Image Diffusion
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            Engineered from ground up to overcome the four persistent failure modes of visual AI: 
            character drift, garbled letters, scene destruction on edit, and sluggish generation latency.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Item 1: Multi-Turn Scene Preservation (col-span-8) */}
          <div className="md:col-span-8 rounded-2xl border border-neutral-800 bg-[#0c1017] p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                01. Scene Geometry Retention
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Conversational Multi-Turn Inpainting
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
                Traditional models regenerate the entire image when you issue a refinement prompt, 
                erasing camera perspective and ambient lighting. Nano Banana localizes the generative latent field, 
                modifying only what you specify while keeping unchanged regions mathematically locked.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/80 grid grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block">Perspective Lock</span>
                <span className="font-semibold text-white font-mono-numbers">100% Ray-Aligned</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Ambient Continuity</span>
                <span className="font-semibold text-white font-mono-numbers">ΔE &lt; 0.8 Lux</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Inpainting Masking</span>
                <span className="font-semibold text-amber-400 font-mono-numbers">Zero-Brush Zero-Shot</span>
              </div>
            </div>
          </div>

          {/* Bento Item 2: Sub-Second Latency (col-span-4) */}
          <div className="md:col-span-4 rounded-2xl border border-neutral-800 bg-[#0c1017] p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                02. Real-Time Interaction
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                340ms Median Latency
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Nano Banana 2 Lite is distilled for client-side fluid manipulation, gaming texture generation, and instant designer co-piloting.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800/80">
              <div className="text-3xl font-extrabold text-amber-400 font-mono-numbers">
                3.2× Faster
              </div>
              <span className="text-xs text-neutral-500 mt-1 block">Than previous generation multimodal pipelines</span>
            </div>
          </div>

          {/* Bento Item 3: Typography & Text Precision (col-span-5) */}
          <div className="md:col-span-5 rounded-2xl border border-neutral-800 bg-[#0c1017] p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                03. Text & Layout Accuracy
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Native 4K Typography Synthesis
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                No more illegible pseudo-alphabets or distorted logos. Nano Banana Pro embeds typographic tokens with sub-pixel kerning, 
                enabling realistic gold foil embossing, neon signs, and commercial packaging.
              </p>
            </div>

            <div className="mt-8 rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
              <img
                src={TYPOGRAPHY_IMAGE}
                alt="Legible packaging typography"
                referrerPolicy="no-referrer"
                className="w-full h-36 object-cover"
              />
            </div>
          </div>

          {/* Bento Item 4: Character Consistency (col-span-7) */}
          <div className="md:col-span-7 rounded-2xl border border-neutral-800 bg-[#0c1017] p-8 flex flex-col justify-between group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                04. Identity Persistence
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Character-Locked Multi-Scene Rigs
              </h3>
              <p className="text-sm text-neutral-300 leading-relaxed">
                Render an actor, mascot, or fashion look across multiple chapters, angles, and weather conditions without facial distortion. 
                Nano Banana maintains bone landmarks, iris texture, and garment styling continuously.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <img
                  src={CHARACTER_IMAGE}
                  alt="Consistent Character Rig"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
                <img
                  src={MACRO_IMAGE}
                  alt="Microscopic Material Fidelity"
                  referrerPolicy="no-referrer"
                  className="w-full h-36 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
