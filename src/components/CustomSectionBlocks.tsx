import React from 'react';
import {
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Copy,
  Sparkles,
  ArrowRight,
  Zap,
} from 'lucide-react';
import {
  CustomBlockItem,
  SectionId,
  useStudioBuilder,
} from '../context/StudioBuilderContext';
import { EditableText } from './EditableText';
import { PlatformLogo } from './PlatformLogo';
import { soundFx } from '../utils/sound';

interface CustomSectionBlocksProps {
  sectionId: SectionId;
}

export const CustomSectionBlocks: React.FC<CustomSectionBlocksProps> = ({
  sectionId,
}) => {
  const {
    isBuilderMode,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    setActiveSection,
    customBlocks,
    updateCustomBlock,
    duplicateCustomBlock,
    deleteCustomBlock,
    moveCustomBlock,
  } = useStudioBuilder();

  const sectionBlocks = customBlocks.filter((b) => b.sectionId === sectionId);
  if (sectionBlocks.length === 0) return null;

  const scrollToTarget = (target: string) => {
    soundFx.playPop();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderBlockContent = (block: CustomBlockItem) => {
    if (block.type === 'kpi-strip' || block.type === 'roi-comparison') {
      const isRoi = block.type === 'roi-comparison';
      return (
        <div
          className={`rounded-3xl border p-6 sm:p-8 ${
            isRoi
              ? 'bg-[#111111] text-white border-neutral-800 shadow-xl'
              : 'bg-white border-neutral-200/90 text-[#111111] shadow-sm'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono-numbers font-bold uppercase tracking-wider mb-2 ${
                  isRoi
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                <Sparkles className="h-3 w-3 text-emerald-500" />
                <EditableText
                  value={block.badge}
                  onChange={(val) => updateCustomBlock(block.id, { badge: val })}
                  label="Block Badge"
                />
              </div>
              <EditableText
                as="h3"
                value={block.title}
                onChange={(val) => updateCustomBlock(block.id, { title: val })}
                className="font-brand text-xl sm:text-2xl font-black uppercase tracking-tight block"
                label="Block Title"
              />
              <EditableText
                as="p"
                value={block.subtitle}
                onChange={(val) => updateCustomBlock(block.id, { subtitle: val })}
                className={`text-xs sm:text-sm font-mono-numbers mt-1 block ${
                  isRoi ? 'text-neutral-400' : 'text-neutral-600'
                }`}
                label="Block Subtitle"
              />
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollToTarget(block.ctaTarget);
              }}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-xs font-mono-numbers font-bold uppercase tracking-wider inline-flex items-center gap-2 shrink-0 cursor-pointer transition-colors"
            >
              <EditableText
                value={block.ctaText}
                onChange={(val) => updateCustomBlock(block.id, { ctaText: val })}
                label="CTA Button"
              />
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {block.metrics.map((metric, mIdx) => (
              <div
                key={mIdx}
                className={`rounded-2xl p-4 border ${
                  isRoi
                    ? 'bg-white/5 border-white/10'
                    : 'bg-neutral-50 border-neutral-200/80'
                }`}
              >
                <EditableText
                  as="div"
                  value={metric.value}
                  onChange={(val) => {
                    const nextMetrics = block.metrics.map((m, i) =>
                      i === mIdx ? { ...m, value: val } : m
                    );
                    updateCustomBlock(block.id, { metrics: nextMetrics });
                  }}
                  className="font-brand text-2xl sm:text-3xl font-black text-emerald-500 block"
                  label="Metric Value"
                />
                <EditableText
                  as="div"
                  value={metric.label}
                  onChange={(val) => {
                    const nextMetrics = block.metrics.map((m, i) =>
                      i === mIdx ? { ...m, label: val } : m
                    );
                    updateCustomBlock(block.id, { metrics: nextMetrics });
                  }}
                  className="text-xs sm:text-sm font-bold mt-1 block"
                  label="Metric Label"
                />
                <EditableText
                  as="div"
                  value={metric.subtext}
                  onChange={(val) => {
                    const nextMetrics = block.metrics.map((m, i) =>
                      i === mIdx ? { ...m, subtext: val } : m
                    );
                    updateCustomBlock(block.id, { metrics: nextMetrics });
                  }}
                  className={`text-[11px] font-mono-numbers mt-0.5 block ${
                    isRoi ? 'text-neutral-400' : 'text-neutral-500'
                  }`}
                  label="Metric Subtext"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (block.type === 'cta-banner') {
      return (
        <div className="rounded-3xl bg-gradient-to-r from-[#111111] via-[#181818] to-[#111111] text-white border border-neutral-800 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-numbers font-bold uppercase tracking-wider mb-2.5">
              <Zap className="h-3 w-3" />
              <EditableText
                value={block.badge}
                onChange={(val) => updateCustomBlock(block.id, { badge: val })}
                label="Banner Badge"
              />
            </div>
            <EditableText
              as="h3"
              value={block.title}
              onChange={(val) => updateCustomBlock(block.id, { title: val })}
              className="font-brand text-2xl sm:text-3xl font-black uppercase tracking-tight block"
              label="Banner Headline"
            />
            <EditableText
              as="p"
              value={block.subtitle}
              onChange={(val) => updateCustomBlock(block.id, { subtitle: val })}
              className="text-xs sm:text-sm text-neutral-300 font-mono-numbers mt-1.5 block"
              label="Banner Subtitle"
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              scrollToTarget(block.ctaTarget);
            }}
            className="px-6 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-xs font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 cursor-pointer shadow-md transition-all"
          >
            <EditableText
              value={block.ctaText}
              onChange={(val) => updateCustomBlock(block.id, { ctaText: val })}
              label="CTA Button Text"
            />
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      );
    }

    if (block.type === 'app-strip') {
      return (
        <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-[10px] font-mono-numbers font-bold uppercase tracking-widest text-emerald-600 block mb-1">
                <EditableText
                  value={block.badge}
                  onChange={(val) => updateCustomBlock(block.id, { badge: val })}
                  label="Badge"
                />
              </span>
              <EditableText
                as="h3"
                value={block.title}
                onChange={(val) => updateCustomBlock(block.id, { title: val })}
                className="font-brand text-lg sm:text-xl font-black uppercase text-[#111111] block"
                label="Title"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {block.apps.map((appId) => (
                <div
                  key={appId}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 flex items-center gap-2 text-xs font-mono-numbers font-bold text-[#111111]"
                >
                  <PlatformLogo platform={appId} size={15} />
                  <span className="capitalize">{appId.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Default: 'text-callout'
    return (
      <div className="rounded-3xl bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono-numbers font-bold uppercase tracking-wider mb-2">
          <EditableText
            value={block.badge}
            onChange={(val) => updateCustomBlock(block.id, { badge: val })}
            label="Callout Badge"
          />
        </div>
        <EditableText
          as="h3"
          value={block.title}
          onChange={(val) => updateCustomBlock(block.id, { title: val })}
          className="font-brand text-xl sm:text-2xl font-black uppercase text-[#111111] block"
          label="Callout Title"
        />
        <EditableText
          as="p"
          multiline
          value={block.subtitle}
          onChange={(val) => updateCustomBlock(block.id, { subtitle: val })}
          className="text-xs sm:text-sm text-neutral-600 font-mono-numbers mt-2 block"
          label="Callout Copy"
        />
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-12 my-8 space-y-6">
      {sectionBlocks.map((block, idx) => {
        const isSelected =
          isBuilderMode &&
          selectedTarget?.kind === 'custom-block' &&
          selectedTarget.blockId === block.id;

        return (
          <div
            key={block.id}
            id={`custom-block-${block.id}`}
            onClick={(e) => {
              if (!isBuilderMode) return;
              e.stopPropagation();
              soundFx.playTick();
              setActiveSection(sectionId);
              setSelectedTarget({
                kind: 'custom-block',
                blockId: block.id,
                sectionId,
              });
            }}
            className={`group/cblock relative rounded-3xl transition-all ${
              isBuilderMode ? 'cursor-pointer' : ''
            } ${
              isSelected
                ? 'ring-2 ring-emerald-500'
                : isBuilderMode
                ? 'hover:ring-1 hover:ring-black/25'
                : ''
            }`}
          >
            {isBuilderMode && (
              <div
                onClick={(e) => e.stopPropagation()}
                className={`absolute -top-3.5 right-4 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] text-white text-[10px] font-mono-numbers font-bold uppercase tracking-wider shadow-lg border border-white/15 select-none transition-opacity ${
                  isSelected
                    ? 'opacity-100'
                    : 'opacity-0 group-hover/cblock:opacity-100'
                }`}
              >
                <span className="text-emerald-400">Custom Block</span>
                <button
                  type="button"
                  onClick={() =>
                    selectAndEditTarget({
                      kind: 'custom-block',
                      blockId: block.id,
                      sectionId,
                    })
                  }
                  className="px-2 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] flex items-center gap-1 cursor-pointer"
                >
                  <Pencil className="h-2.5 w-2.5" />
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => duplicateCustomBlock(block.id)}
                  className="px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-2.5 w-2.5" />
                  <span>Clone</span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteCustomBlock(block.id)}
                  className="px-2 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-2.5 w-2.5" />
                  <span>Delete</span>
                </button>
                {sectionBlocks.length > 1 && (
                  <div className="flex items-center gap-0.5 pl-1 border-l border-white/15">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveCustomBlock(block.id, 'up')}
                      className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowUp className="h-2.5 w-2.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === sectionBlocks.length - 1}
                      onClick={() => moveCustomBlock(block.id, 'down')}
                      className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
                    >
                      <ArrowDown className="h-2.5 w-2.5" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {renderBlockContent(block)}
          </div>
        );
      })}
    </div>
  );
};
