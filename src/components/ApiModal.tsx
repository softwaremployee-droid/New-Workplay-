import React, { useState } from 'react';
import { X, Terminal, Check, Copy, Key, ShieldCheck } from 'lucide-react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiModal: React.FC<ApiModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState<'developer' | 'studio' | 'enterprise'>('developer');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please provide a valid developer email address.');
      return;
    }
    setErrorMessage('');
    // Generate pseudo-production API key
    const prefix = tier === 'developer' ? 'nb_live_indie_' : tier === 'studio' ? 'nb_live_studio_' : 'nb_live_ent_';
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    setGeneratedKey(`${prefix}${randomHex}`);
  };

  const handleCopyKey = () => {
    if (!generatedKey) return;
    navigator.clipboard.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleReset = () => {
    setGeneratedKey(null);
    setEmail('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-[#0c1017] p-6 lg:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          aria-label="Close API modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
          <Terminal className="h-4 w-4" />
          <span>Developer API Gateway</span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2">
          {generatedKey ? 'API Key Provisioned' : 'Generate Nano Banana API Key'}
        </h3>
        <p className="text-xs text-neutral-400 mb-6">
          Access high-throughput inference endpoints for Nano Banana Pro, Nano Banana 2, and Nano Banana 2 Lite.
        </p>

        {generatedKey ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Production token ready. Save this key in your secure environment variables (.env).</span>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Your Secret API Key
              </label>
              <div className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                <span className="text-xs font-mono text-amber-300 flex-1 truncate">{generatedKey}</span>
                <button
                  onClick={handleCopyKey}
                  className="px-3 py-1 rounded-lg bg-neutral-800 text-xs text-neutral-200 hover:text-white hover:bg-neutral-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-[11px] font-mono text-neutral-400">
              <div className="text-neutral-500 mb-1">// Quickstart Shell Export</div>
              <code>export GEMINI_API_KEY="{generatedKey.slice(0, 16)}..."</code>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-xs font-medium text-neutral-300 hover:text-white cursor-pointer"
              >
                Provision Another
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-amber-400 text-xs font-bold text-neutral-950 hover:bg-amber-300 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Workload Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setTier('developer')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                    tier === 'developer'
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-neutral-200">Indie</div>
                  <div className="text-[10px] text-neutral-400">50K req/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('studio')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                    tier === 'studio'
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-neutral-200">Studio</div>
                  <div className="text-[10px] text-neutral-400">500K req/mo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setTier('enterprise')}
                  className={`p-2.5 rounded-xl border text-xs text-left transition-colors cursor-pointer ${
                    tier === 'enterprise'
                      ? 'border-amber-400 bg-amber-400/10 text-white'
                      : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-semibold text-neutral-200">Cluster</div>
                  <div className="text-[10px] text-neutral-400">Custom TPU</div>
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">
                Developer / Organization Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="developer@company.com"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none"
              />
              {errorMessage && (
                <p className="mt-1.5 text-[11px] text-rose-400">{errorMessage}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-400 text-xs font-bold text-neutral-950 hover:bg-amber-300 transition-colors cursor-pointer shadow-lg shadow-amber-400/20"
              >
                Generate Instant Access Key
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
