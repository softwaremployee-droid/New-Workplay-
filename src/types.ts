export type ModelId = 'nano-banana-2-lite' | 'nano-banana-2' | 'nano-banana-pro';

export interface ModelSpec {
  id: ModelId;
  name: string;
  tagline: string;
  latencyMs: number;
  maxResolution: string;
  contextParams: string;
  specialty: string;
  recommendedFor: string;
  benchmarks: {
    promptAdherence: number; // 0 - 100
    typographyFidelity: number;
    characterLock: number;
    speedRating: number;
  };
}

export type AspectRatio = '16:9' | '4:3' | '1:1' | '9:16';

export interface PromptPreset {
  id: string;
  title: string;
  category: 'Product' | 'Portrait' | 'Typography' | 'Macro';
  prompt: string;
  negativePrompt: string;
  aspectRatio: AspectRatio;
  model: ModelId;
  imageSrc: string;
  seed: number;
  guidance: number;
  steps: number;
}

export interface ShowcaseItem {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  aspectRatio: string;
  model: string;
  prompt: string;
  seed: number;
  renderTime: string;
  resolution: string;
  highlights: string[];
}
