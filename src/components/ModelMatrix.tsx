import React, { useState } from 'react';
import { Cpu, Zap, ShieldCheck, Check, ArrowRight } from 'lucide-react';
import { ModelId } from '../types';
import { MODELS } from '../data/models';

interface ModelMatrixProps {
  onSelectModelForStudio: (modelId: ModelId) => void;
}

export const ModelMatrix: React.FC<ModelMatrixProps> = ({ onSelectModelForStudio }) => {
  const [activeBenchmark, setActiveBenchmark] = useState<'promptAdherence' | 'typographyFidelity' | 'characterLock' | 'speedRating'>('promptAdherence');

  return (
    <section id="models" className="py-20 border-b border-neutral-800/80 bg-[#090b10]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <span>Model Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Family Weights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Engineered for Every Workload Scale
          </h2>
          <p className="mt-4 text-base text-neutral-400">
            From instant 340ms UI previews to pixel-perfect 4K commercial publishing, 
            choose the exact model tier tuned for your throughput and reasoning requirements.
          </p>
        </div>

        {/* 3 Model Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {MODELS.map((model) => (
            <div
              key={model.id}
              className={`relative rounded-2xl border transition-all duration-300 p-6 flex flex-col justify-between ${
                model.id === 'nano-banana-pro'
                  ? 'border-amber-400/80 bg-[#0f1420] shadow-xl shadow-amber-400/5'
                  : 'border-neutral-800 bg-[#0c1017] hover:border-neutral-700'
              }`}
            >
              {/* Optional editorial highlight kicker */}
              {model.id === 'nano-banana-pro' && (
                <div className="text-[11px] font-semibold text-amber-400 tracking-wider uppercase mb-2">
                  Flagship Fidelity
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{model.name}</h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                  {model.tagline}
                </p>

                {/* Key Spec metrics */}
                <div className="mt-6 space-y-3 pt-6 border-t border-neutral-800/80 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Median Latency</span>
                    <span className="font-mono-numbers font-semibold text-white">{model.latencyMs}ms</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Max Resolution</span>
                    <span className="font-mono-numbers font-semibold text-white">{model.maxResolution}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Active Parameters</span>
                    <span className="font-mono-numbers font-semibold text-white">{model.contextParams}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-neutral-400">Target Environment</span>
                    <span className="font-medium text-amber-300 truncate max-w-[170px]">{model.recommendedFor}</span>
                  </div>
                </div>

                {/* Strengths summary */}
                <div className="mt-6 pt-4 border-t border-neutral-800/80 text-xs text-neutral-300">
                  <div className="font-semibold text-neutral-200 mb-2">Core Advantage:</div>
                  <p className="text-neutral-400 leading-relaxed text-[11px]">
                    {model.specialty}
                  </p>
                </div>
              </div>

              {/* Action button */}
              <div className="mt-8 pt-4">
                <button
                  onClick={() => onSelectModelForStudio(model.id)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    model.id === 'nano-banana-pro'
                      ? 'bg-amber-400 text-neutral-950 hover:bg-amber-300'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white'
                  }`}
                >
                  <span>Select for Playground</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Benchmark Section */}
        <div className="mt-16 rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 lg:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h3 className="text-lg font-bold text-white">Empirical Benchmark Evaluations</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Evaluated against the standardized Multimodal Vision & Typographic Adherence Test Suite (MV-TATS).
              </p>
            </div>

            {/* Benchmark criteria segmented tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg overflow-x-auto">
              <button
                onClick={() => setActiveBenchmark('promptAdherence')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeBenchmark === 'promptAdherence'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Prompt Adherence
              </button>
              <button
                onClick={() => setActiveBenchmark('typographyFidelity')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeBenchmark === 'typographyFidelity'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Typography Precision
              </button>
              <button
                onClick={() => setActiveBenchmark('characterLock')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeBenchmark === 'characterLock'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Character Identity
              </button>
              <button
                onClick={() => setActiveBenchmark('speedRating')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeBenchmark === 'speedRating'
                    ? 'bg-amber-400 text-neutral-950 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Speed & Throughput
              </button>
            </div>
          </div>

          {/* Bar comparisons */}
          <div className="space-y-5">
            {MODELS.map((m) => {
              const val = m.benchmarks[activeBenchmark];
              return (
                <div key={m.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-neutral-200">{m.name}</span>
                    <span className="font-mono-numbers text-amber-400 font-bold">{val} / 100</span>
                  </div>
                  <div className="h-3 w-full bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        m.id === 'nano-banana-pro' ? 'bg-amber-400' : 'bg-neutral-400'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
