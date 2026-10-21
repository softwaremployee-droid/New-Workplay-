import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Sliders, 
  RefreshCw, 
  Download, 
  Eye, 
  Type, 
  UserCheck, 
  Layers, 
  Check, 
  Copy,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { ModelId, AspectRatio } from '../types';
import { MODELS, PRESETS, HERO_IMAGE, CHARACTER_IMAGE, TYPOGRAPHY_IMAGE, MACRO_IMAGE } from '../data/models';

type StudioTab = 'prompt-canvas' | 'conversational-edit' | 'character-rig' | 'typography-lab';

export const StudioPlayground: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StudioTab>('prompt-canvas');

  // Tab 1: Prompt Canvas State
  const [selectedModel, setSelectedModel] = useState<ModelId>('nano-banana-pro');
  const [prompt, setPrompt] = useState<string>(PRESETS[0].prompt);
  const [negativePrompt, setNegativePrompt] = useState<string>(PRESETS[0].negativePrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [guidanceScale, setGuidanceScale] = useState<number>(8.5);
  const [steps, setSteps] = useState<number>(40);
  const [seed, setSeed] = useState<number>(4892014);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(100);
  const [currentDisplayImage, setCurrentDisplayImage] = useState<string>(HERO_IMAGE);
  const [copiedSeed, setCopiedSeed] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<string>('2.38s');

  // Tab 2: Conversational Edit (Before/After Slider)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const [activeTurn, setActiveTurn] = useState<number>(1);

  // Tab 4: Typography Lab
  const [customBrandText, setCustomBrandText] = useState<string>('NANO BANANA');
  const [customSubText, setCustomSubText] = useState<string>('100% PURE ENERGY');
  const [showLegacyCompare, setShowLegacyCompare] = useState<boolean>(false);

  // Handle preset selection
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setPrompt(preset.prompt);
    setNegativePrompt(preset.negativePrompt);
    setAspectRatio(preset.aspectRatio);
    setSelectedModel(preset.model);
    setSeed(preset.seed);
    setGuidanceScale(preset.guidance);
    setSteps(preset.steps);
    setCurrentDisplayImage(preset.imageSrc);
  };

  // Generate Simulation
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    const modelObj = MODELS.find((m) => m.id === selectedModel);
    const targetMs = modelObj ? modelObj.latencyMs * 1.5 : 2000;
    const intervalTime = 50;
    const increment = (intervalTime / targetMs) * 100;

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          setElapsedTime(((targetMs / 1000) * (0.9 + Math.random() * 0.2)).toFixed(2) + 's');
          return 100;
        }
        return Math.min(100, prev + increment);
      });
    }, intervalTime);

    // Pick image based on prompt content
    if (prompt.toLowerCase().includes('portrait') || prompt.toLowerCase().includes('model') || prompt.toLowerCase().includes('parka')) {
      setCurrentDisplayImage(CHARACTER_IMAGE);
    } else if (prompt.toLowerCase().includes('typography') || prompt.toLowerCase().includes('packaging') || prompt.toLowerCase().includes('brand')) {
      setCurrentDisplayImage(TYPOGRAPHY_IMAGE);
    } else if (prompt.toLowerCase().includes('macro') || prompt.toLowerCase().includes('microscopic') || prompt.toLowerCase().includes('filaments')) {
      setCurrentDisplayImage(MACRO_IMAGE);
    } else {
      setCurrentDisplayImage(HERO_IMAGE);
    }
  };

  const handleRandomizeSeed = () => {
    setSeed(Math.floor(1000000 + Math.random() * 9000000));
  };

  const handleCopySeed = () => {
    navigator.clipboard.writeText(seed.toString());
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  // Slider Mouse/Touch Handlers
  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min((x / rect.width) * 100, 100));
    setSliderPosition(percent);
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handleSliderMove(e.clientX);
    };
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches[0]) handleSliderMove(e.touches[0].clientX);
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('touchend', handleGlobalMouseUp);
    window.addEventListener('touchmove', handleGlobalTouchMove);

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('touchend', handleGlobalMouseUp);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
    };
  }, [isDragging]);

  return (
    <section id="studio" className="py-20 border-b border-neutral-800/80 bg-[#07090e]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <span>Interactive Sandbox</span>
              <span aria-hidden="true">·</span>
              <span>Nano Banana Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Creative Studio Playground
            </h2>
            <p className="mt-2 text-base text-neutral-400 max-w-2xl">
              Directly evaluate prompt adherence, conversational scene preservation, character identity locking, and typographic fidelity.
            </p>
          </div>

          {/* Functional Mode Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-xl overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveTab('prompt-canvas')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'prompt-canvas'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Prompt Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('conversational-edit')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'conversational-edit'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Conversational Edit</span>
            </button>

            <button
              onClick={() => setActiveTab('character-rig')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'character-rig'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Character Rig</span>
            </button>

            <button
              onClick={() => setActiveTab('typography-lab')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'typography-lab'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Type className="h-3.5 w-3.5" />
              <span>Typography Lab</span>
            </button>
          </div>
        </div>

        {/* TAB 1: PROMPT CANVAS */}
        {activeTab === 'prompt-canvas' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Control Column */}
            <div className="lg:col-span-5 rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 space-y-6">
              {/* Presets */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Curated Verification Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                        prompt === preset.prompt
                          ? 'border-amber-400/80 bg-amber-400/10 text-white'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <div className="font-semibold text-neutral-200 truncate">{preset.category}</div>
                      <div className="text-[11px] text-neutral-400 truncate">{preset.title}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Inference Weight Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {MODELS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m.id)}
                      className={`p-2.5 text-center rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                        selectedModel === m.id
                          ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      <div className="truncate">{m.name.replace('Nano Banana ', '')}</div>
                      <div className="text-[10px] text-neutral-500 font-mono-numbers mt-0.5">{m.latencyMs}ms</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Positive Prompt
                  </label>
                  <span className="text-[10px] text-neutral-500 font-mono-numbers">{prompt.length} chars</span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-200 placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors resize-none leading-relaxed"
                  placeholder="Describe your scene with lighting, materials, and typography instructions..."
                />
              </div>

              {/* Aspect Ratio */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-2">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['16:9', '4:3', '1:1', '9:16'] as AspectRatio[]).map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 text-center rounded-lg border text-xs font-medium font-mono-numbers transition-colors cursor-pointer ${
                        aspectRatio === ratio
                          ? 'border-amber-400 bg-amber-400/10 text-white'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Parameters: Guidance Scale & Seed */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-400">Guidance</span>
                    <span className="text-amber-400 font-mono-numbers">{guidanceScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-400">Seed</span>
                    <button
                      onClick={handleRandomizeSeed}
                      className="text-neutral-400 hover:text-amber-400 flex items-center gap-1 text-[11px] cursor-pointer"
                    >
                      <RefreshCw className="h-2.5 w-2.5" />
                      <span>Random</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1">
                    <span className="text-xs text-neutral-300 font-mono-numbers flex-1 truncate">{seed}</span>
                    <button
                      onClick={handleCopySeed}
                      className="text-neutral-500 hover:text-amber-400 cursor-pointer"
                      title="Copy Seed"
                    >
                      {copiedSeed ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-xs font-bold text-neutral-950 transition-all hover:bg-amber-300 active:scale-[0.99] disabled:opacity-60 shadow-lg shadow-amber-400/20 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Synthesizing Latents ({Math.round(generationProgress)}%)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Run Nano Banana Inference</span>
                  </>
                )}
              </button>
            </div>

            {/* Display Canvas Column */}
            <div className="lg:col-span-7 rounded-2xl border border-neutral-800 bg-[#0c1017] p-4 flex flex-col justify-between">
              {/* Canvas Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="relative h-16 w-16">
                      <div className="absolute inset-0 rounded-full border-2 border-amber-400/20" />
                      <div className="absolute inset-0 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-mono-numbers text-amber-400">
                        {Math.round(generationProgress)}%
                      </div>
                    </div>
                    <div className="text-xs font-mono-numbers text-neutral-400">
                      Processing 4K diffusion latents via {MODELS.find((m) => m.id === selectedModel)?.name}...
                    </div>
                  </div>
                ) : (
                  <img
                    src={currentDisplayImage}
                    alt="Generated output by Nano Banana"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                )}

                {/* Status bar badge */}
                {!isGenerating && (
                  <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-md text-[11px] font-mono-numbers text-neutral-300 border border-neutral-700/60 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{MODELS.find((m) => m.id === selectedModel)?.name}</span>
                    <span className="text-neutral-500">·</span>
                    <span>{elapsedTime}</span>
                  </div>
                )}
              </div>

              {/* Canvas Controls Footer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span>Aspect: {aspectRatio}</span>
                  <span aria-hidden="true">·</span>
                  <span>Steps: {steps}</span>
                  <span aria-hidden="true">·</span>
                  <span>CFG: {guidanceScale}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = currentDisplayImage;
                      link.download = `nano_banana_render_${seed}.jpg`;
                      link.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-xs text-neutral-300 hover:text-white hover:border-neutral-700 transition-colors cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Raw</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CONVERSATIONAL MULTI-TURN INPAINTING */}
        {activeTab === 'conversational-edit' && (
          <div className="rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Conversational Multi-Turn Scene Preservation
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Unlike traditional diffusion models that hallucinate an entirely new image on secondary prompts, Nano Banana isolates instructions and updates specific regions while preserving facial geometry, perspective, and lighting.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Select Turn:</span>
                {[1, 2, 3].map((turn) => (
                  <button
                    key={turn}
                    onClick={() => setActiveTurn(turn)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                      activeTurn === turn
                        ? 'border-amber-400 bg-amber-400/10 text-amber-300'
                        : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    Turn #{turn}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversational prompt transcript */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className={`p-3 rounded-xl border text-xs ${activeTurn === 1 ? 'border-amber-400/80 bg-amber-400/5 text-neutral-200' : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400'}`}>
                <div className="font-semibold text-amber-400 mb-1">Turn 1 (Base Prompt)</div>
                <p className="line-clamp-2">"High fashion editorial portrait of a stylish futuristic model wearing a tailored yellow and dark slate technical parka."</p>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${activeTurn === 2 ? 'border-amber-400/80 bg-amber-400/5 text-neutral-200' : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400'}`}>
                <div className="font-semibold text-amber-400 mb-1">Turn 2 (Conversational Instruction)</div>
                <p className="line-clamp-2">"Add reflective aviator sunglasses and add subtle rim lighting on the cheekbone without changing the coat or background."</p>
              </div>

              <div className={`p-3 rounded-xl border text-xs ${activeTurn === 3 ? 'border-amber-400/80 bg-amber-400/5 text-neutral-200' : 'border-neutral-800/80 bg-neutral-900/40 text-neutral-400'}`}>
                <div className="font-semibold text-amber-400 mb-1">Turn 3 (Atmosphere Shift)</div>
                <p className="line-clamp-2">"Shift time to twilight, add fine water mist reflections on the jacket shoulders, keep identity locked."</p>
              </div>
            </div>

            {/* Interactive Before/After Split Viewer */}
            <div
              ref={sliderContainerRef}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-xl border border-neutral-800 select-none cursor-ew-resize"
            >
              {/* After Image (Full width background) */}
              <img
                src={CHARACTER_IMAGE}
                alt="Nano Banana Conversational Edit Output"
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-xs font-mono-numbers text-amber-400 border border-neutral-700">
                Turn #{activeTurn}: Nano Banana Edit
              </div>

              {/* Before Image (Clipped by slider position) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={HERO_IMAGE}
                  alt="Original Reference Base"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 h-full w-full object-cover max-w-none"
                  style={{ width: sliderContainerRef.current ? `${sliderContainerRef.current.clientWidth}px` : '100%' }}
                />
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded text-xs font-mono-numbers text-neutral-300 border border-neutral-700">
                  Original Reference Base
                </div>
              </div>

              {/* Divider Line & Draggable Handle */}
              <div
                className="absolute inset-y-0 w-1 bg-amber-400 shadow-xl pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg font-bold text-xs">
                  ↔
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>← Drag slider horizontally to compare scene preservation</span>
              <span className="font-mono-numbers">Split: {Math.round(sliderPosition)}%</span>
            </div>
          </div>
        )}

        {/* TAB 3: CHARACTER CONSISTENCY RIG */}
        {activeTab === 'character-rig' && (
          <div className="rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 lg:p-8 space-y-6">
            <div className="border-b border-neutral-800 pb-5">
              <h3 className="text-lg font-bold text-white">
                Multi-Turn Character Identity Locking
              </h3>
              <p className="text-xs text-neutral-400 mt-1 max-w-3xl">
                Nano Banana solves identity drift by introducing structural latent anchor tokens. 
                Whether re-rendering in neon night scenes, bright midday desert sunlight, or editorial studio shots, 
                facial bone structure, skin complexion, and key styling remain authentic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={CHARACTER_IMAGE}
                    alt="Studio Reference"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-numbers text-white">
                    Anchor: Studio Key
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-200">Shot 01 · Reference Rig</div>
                <div className="text-[11px] text-neutral-400">Neutral studio illumination, precise facial baseline.</div>
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-amber-400 pt-1 border-t border-neutral-900">
                  <span>Cosine Similarity</span>
                  <span>1.000 (Anchor)</span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={CHARACTER_IMAGE}
                    alt="Night Rain Context"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover filter contrast-125 saturate-110"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-numbers text-white">
                    Context: Neon Rain
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-200">Shot 02 · Atmosphere Shift</div>
                <div className="text-[11px] text-neutral-400">High contrast cyan/warm fill; jawline & eyes locked.</div>
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-emerald-400 pt-1 border-t border-neutral-900">
                  <span>Cosine Similarity</span>
                  <span>0.994</span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={CHARACTER_IMAGE}
                    alt="Macro Profile"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover filter brightness-95"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-numbers text-white">
                    Context: Macro Profile
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-200">Shot 03 · Detail Scale</div>
                <div className="text-[11px] text-neutral-400">Micro skin pore texture and sunglasses reflection aligned.</div>
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-emerald-400 pt-1 border-t border-neutral-900">
                  <span>Cosine Similarity</span>
                  <span>0.991</span>
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-neutral-900">
                  <img
                    src={CHARACTER_IMAGE}
                    alt="High Velocity Motion"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover filter sepia-20"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-mono-numbers text-white">
                    Context: Golden Hour
                  </div>
                </div>
                <div className="text-xs font-semibold text-neutral-200">Shot 04 · Dynamic Angle</div>
                <div className="text-[11px] text-neutral-400">Warm 3200K side illumination; jacket collar & seams locked.</div>
                <div className="flex items-center justify-between text-[11px] font-mono-numbers text-emerald-400 pt-1 border-t border-neutral-900">
                  <span>Cosine Similarity</span>
                  <span>0.988</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: TYPOGRAPHY LAB */}
        {activeTab === 'typography-lab' && (
          <div className="rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 lg:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5">
              <div>
                <h3 className="text-lg font-bold text-white">
                  Legible 4K Typography & Packaging Synthesis
                </h3>
                <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                  Traditional diffusion models output illegible pseudo-glyphs. Nano Banana Pro natively understands character kerning, embossing, foil stamping, and multi-line structured copy.
                </p>
              </div>

              <button
                onClick={() => setShowLegacyCompare(!showLegacyCompare)}
                className="px-3.5 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {showLegacyCompare ? 'Hide Legacy Comparison' : 'Compare vs Legacy Diffusion'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Inputs */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Primary Headline Typography (Embossed Gold)
                  </label>
                  <input
                    type="text"
                    value={customBrandText}
                    onChange={(e) => setCustomBrandText(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs font-bold text-amber-400 focus:border-amber-400 focus:outline-none"
                    placeholder="E.g. NANO BANANA"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                    Secondary Subtitle (Fine Deboss)
                  </label>
                  <input
                    type="text"
                    value={customSubText}
                    onChange={(e) => setCustomSubText(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-neutral-200 focus:border-amber-400 focus:outline-none"
                    placeholder="E.g. 100% PURE ENERGY"
                  />
                </div>

                <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-900/50 text-xs space-y-2">
                  <div className="font-semibold text-white">Typographic Adherence Metrics:</div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Glyph Legibility Score</span>
                    <span className="font-mono-numbers text-emerald-400">99.8%</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Kerning Precision</span>
                    <span className="font-mono-numbers text-emerald-400">0.02 em delta</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Multi-line Word Wrap</span>
                    <span className="font-mono-numbers text-emerald-400">Balanced</span>
                  </div>
                </div>
              </div>

              {/* Showcase Box Visual */}
              <div className="lg:col-span-7">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-2xl">
                  {showLegacyCompare ? (
                    <div className="h-full w-full flex flex-col items-center justify-center p-8 text-center bg-neutral-900/80">
                      <div className="text-amber-400 font-mono-numbers text-2xl blur-[1.5px] tracking-widest line-through">
                        N4N0 B4N4N4
                      </div>
                      <div className="text-neutral-500 font-mono-numbers text-xs blur-[2px] mt-2">
                        10O% PVRE ENRECY
                      </div>
                      <p className="text-xs text-rose-400 mt-6 max-w-sm">
                        Legacy Models: Distorted characters, missing stems, glyph hallucinations, and warped baseline alignment.
                      </p>
                    </div>
                  ) : (
                    <>
                      <img
                        src={TYPOGRAPHY_IMAGE}
                        alt="Nano Banana Typography Benchmark"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex items-center justify-between">
                        <span className="text-xs text-neutral-300 font-mono-numbers">
                          Target: "{customBrandText}" & "{customSubText}"
                        </span>
                        <span className="text-xs text-amber-400 font-semibold">
                          Nano Banana Pro Verified
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
