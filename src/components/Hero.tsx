import React from 'react';
import { ArrowDown, Check, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onExploreDirectory: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreDirectory }) => {
  return (
    <section className="relative border-b border-neutral-200 bg-[#F8F9FA] pt-12 pb-16 lg:pt-20 lg:pb-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Editorial Sub-Kicker */}
        <div className="flex items-center gap-3 text-xs font-semibold tracking-widest uppercase text-neutral-500 mb-6 font-mono-numbers">
          <span>PARISIAN EDITORIAL / ROSTER 2026</span>
          <span aria-hidden="true" className="text-neutral-300">/</span>
          <span>9 AUDITED ENGINEERS AVAILABLE</span>
        </div>

        {/* Hero Title */}
        <div className="max-w-5xl">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-[#0A0A0A] leading-[0.98]">
            Hire Exceptional Software Engineers.
            <span className="block text-neutral-400 font-normal">Pre-Vetted. Direct.</span>
          </h1>

          <p className="mt-8 max-w-2xl text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
            Bypass agency spam and months of screening loops. Access an exclusive cadre of senior engineers, 
            distributed systems architects, and technical leads pre-audited through production code sandboxes.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreDirectory}
              className="inline-flex items-center gap-3 rounded-full bg-[#0A0A0A] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-neutral-800 active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Engineer Directory</span>
              <ArrowDown className="h-3.5 w-3.5" />
            </button>

            <div className="text-xs text-neutral-500 font-mono-numbers pl-2">
              Updated today · Direct hire contracts
            </div>
          </div>
        </div>

        {/* 4-Item Minimalist Metric Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-neutral-200">
          <div>
            <div className="font-display text-3xl lg:text-4xl font-extrabold text-[#0A0A0A] font-mono-numbers">
              48h
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-700">First Interview</div>
            <div className="text-[11px] text-neutral-500">Direct booking with shortlisted engineers</div>
          </div>

          <div>
            <div className="font-display text-3xl lg:text-4xl font-extrabold text-[#0A0A0A] font-mono-numbers">
              1.4%
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-700">Audit Pass Rate</div>
            <div className="text-[11px] text-neutral-500">Rigorous 3-stage distributed system defense</div>
          </div>

          <div>
            <div className="font-display text-3xl lg:text-4xl font-extrabold text-[#0A0A0A] font-mono-numbers">
              0%
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-700">Recruiter Commission</div>
            <div className="text-[11px] text-neutral-500">Transparent rates, direct employment contracts</div>
          </div>

          <div>
            <div className="font-display text-3xl lg:text-4xl font-extrabold text-[#0A0A0A] font-mono-numbers">
              100%
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-700">Code Audited</div>
            <div className="text-[11px] text-neutral-500">Live test coverage & concurrency benchmarked</div>
          </div>
        </div>
      </div>

      {/* Editorial Marquee Strip (Bécane signature style) */}
      <div className="mt-14 border-y border-neutral-200 bg-white py-3.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs font-semibold uppercase tracking-widest text-neutral-700 font-mono-numbers">
          <span className="mx-6">★ PRE-VETTED SENIOR SOFTWARE TALENT</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">TOP 1.4% CODE AUDITED</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">DIRECT INTERVIEWS IN 48H</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">ZERO RECRUITER AGENCY FEES</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">PARIS · LONDON · BERLIN · REMOTE</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">FULL-TIME & SQUAD CONTRACTS</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">★ PRE-VETTED SENIOR SOFTWARE TALENT</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">TOP 1.4% CODE AUDITED</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">DIRECT INTERVIEWS IN 48H</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">ZERO RECRUITER AGENCY FEES</span>
          <span className="mx-6 text-neutral-300">/</span>
          <span className="mx-6">PARIS · LONDON · BERLIN · REMOTE</span>
        </div>
      </div>
    </section>
  );
};
