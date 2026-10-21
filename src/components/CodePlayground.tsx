import React, { useState } from 'react';
import { Terminal, Copy, Check, Code2 } from 'lucide-react';

export const CodePlayground: React.FC = () => {
  const [activeLang, setActiveLang] = useState<'typescript' | 'python' | 'curl'>('typescript');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeModel, setActiveModel] = useState<'nano-banana-pro' | 'nano-banana-2' | 'nano-banana-2-lite'>('nano-banana-pro');

  const codeSnippets = {
    typescript: `import { GoogleGenAI } from '@google/genai';

// Initialize Nano Banana client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateBananaVisual() {
  const response = await ai.models.generateImages({
    model: '${activeModel}',
    prompt: 'Ultra-premium product packaging with embossed typography reading "NANO BANANA", studio rim light, 8k',
    config: {
      numberOfImages: 1,
      aspectRatio: '16:9',
      outputMimeType: 'image/jpeg',
      compressionQuality: 95,
      // Conversational multi-turn reference locking
      personGeneration: 'ALLOW_ADULT',
    },
  });

  for (const generatedImage of response.generatedImages) {
    const base64ImageBytes = generatedImage.image.imageBytes;
    console.log('Synthesized frame length:', base64ImageBytes.length);
  }
}

generateBananaVisual();`,

    python: `import os
from google import genai
from google.genai import types

# Initialize Nano Banana client
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

result = client.models.generate_images(
    model="${activeModel}",
    prompt="Ultra-premium product packaging with embossed typography reading 'NANO BANANA', studio rim light, 8k",
    config=types.GenerateImagesConfig(
        number_of_images=1,
        aspect_ratio="16:9",
        output_mime_type="image/jpeg",
        person_generation="ALLOW_ADULT",
    ),
)

for generated_image in result.generated_images:
    image_bytes = generated_image.image.image_bytes
    print(f"Generated {len(image_bytes)} bytes successfully.")`,

    curl: `curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:predict" \\
  -H "x-goog-api-key: $GEMINI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "instances": [
      {
        "prompt": "Ultra-premium product packaging with embossed typography reading 'NANO BANANA', studio rim light, 8k"
      }
    ],
    "parameters": {
      "sampleCount": 1,
      "aspectRatio": "16:9",
      "outputOptions": {
        "mimeType": "image/jpeg"
      }
    }
  }'`,
  };

  const currentCode = codeSnippets[activeLang];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="developer" className="py-20 border-b border-neutral-800/80 bg-[#090b10]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
              <span>Developer SDK</span>
              <span aria-hidden="true">·</span>
              <span>API Integration</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Seamless 3-Line Integration
            </h2>
            <p className="mt-2 text-base text-neutral-400 max-w-2xl">
              Integrate Nano Banana models into web applications, Discord bots, asset pipelines, and automated rendering clusters using standard SDKs.
            </p>
          </div>

          {/* Model selector pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Target Model:</span>
            <select
              value={activeModel}
              onChange={(e) => setActiveModel(e.target.value as any)}
              className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-amber-400 focus:outline-none focus:border-amber-400"
            >
              <option value="nano-banana-pro">Nano Banana Pro (4K Reasoning)</option>
              <option value="nano-banana-2">Nano Banana 2 (Production Workhorse)</option>
              <option value="nano-banana-2-lite">Nano Banana 2 Lite (340ms Edge)</option>
            </select>
          </div>
        </div>

        {/* Code Editor Frame */}
        <div className="rounded-2xl border border-neutral-800 bg-[#06080d] overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800/80 bg-[#0d121c]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
                <div className="h-3 w-3 rounded-full bg-neutral-800" />
              </div>

              {/* Language Switchers */}
              <div className="flex items-center gap-1 ml-4">
                {(['typescript', 'python', 'curl'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      activeLang === lang
                        ? 'bg-amber-400/15 text-amber-300 font-semibold border border-amber-400/40'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {lang === 'typescript' ? 'TypeScript' : lang === 'python' ? 'Python' : 'cURL'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-amber-400 px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Area */}
          <div className="p-6 overflow-x-auto text-xs font-mono leading-relaxed text-neutral-300">
            <pre>
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
