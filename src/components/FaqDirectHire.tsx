import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  GripVertical,
  Plus,
  Trash2,
  Pencil,
  Copy,
} from 'lucide-react';
import { SectionBuilderBar } from './SectionBuilderBar';
import { SectionPartWrapper } from './SectionPartWrapper';
import { EditableText } from './EditableText';
import { PartId, useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

type CategoryFilter = 'all' | 'savings' | 'apps' | 'operations' | 'guarantee';

interface FaqDirectHireProps {
  sectionIndex?: number;
  totalSections?: number;
}

export const FaqDirectHire: React.FC<FaqDirectHireProps> = ({
  sectionIndex = 3,
  totalSections = 4,
}) => {
  const {
    isBuilderMode,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    setActiveSection,
    config,
    updateConfig,
    sectionParts,
    hiddenParts,
    faqs,
    updateFaq,
    reorderFaqs,
    addFaq,
    duplicateFaq,
    deleteFaq,
    draggedItem,
    setDraggedItem,
  } = useStudioBuilder();

  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const filteredFaqs = useMemo(() => {
    return faqs
      .map((faq, originalIndex) => ({ ...faq, originalIndex }))
      .filter((faq) => {
        const matchesCategory =
          selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesQuery =
          searchQuery.trim() === '' ||
          faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (faq.highlight &&
            faq.highlight.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
      });
  }, [faqs, searchQuery, selectedCategory]);

  const visibleParts = (sectionParts.faq || []).filter(
    (partId) => !hiddenParts.includes(partId)
  );

  const renderPart = (partId: PartId, partIdx: number) => {
    if (partId === 'faq-header') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="faq"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mb-12 text-center max-w-3xl mx-auto"
        >
          {/* FAQ Badge */}
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-neutral-100 via-emerald-50/60 to-neutral-100 border border-neutral-200/80 text-xs font-bold uppercase tracking-wider text-neutral-800 mb-3 font-mono-numbers shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <EditableText
              value={config.faqBadge}
              onChange={(val) => updateConfig('faqBadge', val)}
              label="FAQ Badge"
            />
          </div>

          {/* Explicit FAQ Text Header */}
          <div className="mb-2">
            <EditableText
              as="h2"
              value={config.faqTitle || 'FAQ'}
              onChange={(val) => updateConfig('faqTitle', val)}
              className="font-brand text-4xl sm:text-6xl font-black uppercase tracking-tight text-[#111111] leading-none block"
              label="FAQ Text Header"
            />
          </div>

          {/* FAQ Secondary Headline */}
          <EditableText
            as="h3"
            value={config.faqHeadline}
            onChange={(val) => updateConfig('faqHeadline', val)}
            className="font-brand text-xl sm:text-3xl font-black uppercase tracking-tight text-neutral-800 leading-tight block"
            label="FAQ Headline"
          />

          <div className="mt-3 max-w-2xl mx-auto">
            <EditableText
              as="p"
              multiline
              value={config.faqSubheadline}
              onChange={(val) => updateConfig('faqSubheadline', val)}
              className="text-sm sm:text-base text-neutral-600 font-mono-numbers"
              label="FAQ Subheadline"
            />
          </div>

          {/* Search bar & Category Filter Pills */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search questions or apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full pl-10 pr-4 py-2 text-xs font-mono-numbers bg-white border border-neutral-200 rounded-full focus:outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111] placeholder:text-neutral-400 shadow-2xs"
              />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap justify-center text-[11px] font-mono-numbers font-bold uppercase">
              {[
                { id: 'all', label: 'All' },
                { id: 'savings', label: '90% Savings' },
                { id: 'apps', label: 'Apps & Execution' },
                { id: 'operations', label: 'Capacity' },
                { id: 'guarantee', label: 'Guarantee & Security' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playTick();
                    setSelectedCategory(tab.id as CategoryFilter);
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    selectedCategory === tab.id
                      ? 'bg-[#111111] text-white shadow-xs'
                      : 'bg-white hover:bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {isBuilderMode && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playPop();
                    addFaq();
                    setOpenIndex(faqs.length);
                    selectAndEditTarget({ kind: 'faq', faqIndex: faqs.length });
                  }}
                  className="px-3 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Add FAQ</span>
                </button>
              )}
            </div>
          </div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'faq-accordion-list') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="faq"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="space-y-3"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-neutral-200 p-8">
              <HelpCircle className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#111111]">
                No matching questions found.
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs font-mono-numbers text-emerald-600 hover:underline font-bold"
              >
                Clear search filter
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const idx = faq.originalIndex;
              const isOpen = openIndex === idx;
              const isBuilderSelected =
                isBuilderMode &&
                selectedTarget?.kind === 'faq' &&
                selectedTarget.faqIndex === idx;
              const isDragOver = dragOverIdx === idx;
              return (
                <div
                  key={faq.id}
                  draggable={isBuilderMode}
                  onDragStart={(e) => {
                    if (!isBuilderMode) return;
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedItem({ type: 'faq', faqIndex: idx });
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null);
                    setDragOverIdx(null);
                  }}
                  onDragOver={(e) => {
                    if (
                      isBuilderMode &&
                      draggedItem?.type === 'faq' &&
                      draggedItem.faqIndex !== idx
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverIdx(idx);
                    }
                  }}
                  onDragLeave={() => setDragOverIdx(null)}
                  onDrop={(e) => {
                    if (!isBuilderMode) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverIdx(null);
                    if (draggedItem?.type === 'faq' && draggedItem.faqIndex !== idx) {
                      soundFx.playPop();
                      reorderFaqs(draggedItem.faqIndex, idx);
                    }
                    setDraggedItem(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playTick();
                    setOpenIndex(isOpen ? null : idx);
                    if (isBuilderMode) {
                      setActiveSection('faq');
                      setSelectedTarget({ kind: 'faq', faqIndex: idx });
                    }
                  }}
                  className={`rounded-2xl border transition-all ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500 shadow-md'
                      : isBuilderSelected
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500 shadow-sm'
                      : isOpen
                      ? 'bg-gradient-to-r from-white via-neutral-50/60 to-white border-neutral-400/80 shadow-sm'
                      : 'bg-white border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="w-full py-4.5 px-6 flex items-center justify-between text-left group cursor-pointer">
                    <div className="pr-4 flex items-center gap-3 flex-1">
                      {isBuilderMode && (
                        <span title="Drag to reorder question" className="shrink-0 flex items-center">
                          <GripVertical className="h-4 w-4 text-neutral-400 cursor-grab" />
                        </span>
                      )}
                      <EditableText
                        value={faq.q}
                        onChange={(val) => updateFaq(idx, { q: val })}
                        className="font-display text-sm sm:text-base font-bold text-[#111111] group-hover:text-neutral-700 transition-colors"
                        label="Question"
                      />
                      {faq.highlight && (
                        <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold bg-neutral-100 text-neutral-600 border border-neutral-200/80 shrink-0">
                          <EditableText
                            value={faq.highlight}
                            onChange={(val) => updateFaq(idx, { highlight: val })}
                            label="Highlight Badge"
                          />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isBuilderMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playPop();
                            setOpenIndex(idx);
                            selectAndEditTarget({ kind: 'faq', faqIndex: idx });
                          }}
                          className="px-2 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-700 hover:text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                          title="Edit this FAQ component"
                        >
                          <Pencil className="h-3 w-3" />
                          <span>Edit</span>
                        </button>
                      )}

                      {isBuilderMode && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playPop();
                            duplicateFaq(idx);
                          }}
                          className="px-2 py-1 rounded-full bg-neutral-100 hover:bg-[#111111] text-neutral-700 hover:text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                          title="Duplicate this FAQ component"
                        >
                          <Copy className="h-3 w-3" />
                          <span className="hidden sm:inline">Clone</span>
                        </button>
                      )}

                      {isBuilderMode && faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playTick();
                            deleteFaq(idx);
                          }}
                          className="px-2 py-1 rounded-full bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer"
                          title="Delete this FAQ component (⌘Z to undo)"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </button>
                      )}

                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-[#111111] shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-neutral-400 group-hover:text-[#111111] shrink-0 transition-colors" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-neutral-100">
                      <EditableText
                        as="p"
                        multiline
                        value={faq.a}
                        onChange={(val) => updateFaq(idx, { a: val })}
                        className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal block"
                        label="FAQ Answer"
                      />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </SectionPartWrapper>
      );
    }

    if (partId === 'faq-guarantee-banner') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="faq"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mt-12"
        >
          <div className="rounded-3xl bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0c0c0c] border border-neutral-800 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <EditableText
                  as="h3"
                  value={config.faqGuaranteeTitle}
                  onChange={(val) => updateConfig('faqGuaranteeTitle', val)}
                  className="font-brand text-base sm:text-lg font-black uppercase tracking-tight text-white block"
                  label="Guarantee Title"
                />
                <div className="mt-1">
                  <EditableText
                    as="p"
                    multiline
                    value={config.faqGuaranteeText}
                    onChange={(val) => updateConfig('faqGuaranteeText', val)}
                    className="text-xs sm:text-sm text-neutral-400 font-mono-numbers"
                    label="Guarantee Description"
                  />
                </div>
              </div>
            </div>

            <a
              href="#lineup"
              onClick={() => soundFx.playPop()}
              className="w-full md:w-auto px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#111111] text-xs font-mono-numbers font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shrink-0 shadow-sm"
            >
              <EditableText
                value={config.faqGuaranteeCta}
                onChange={(val) => updateConfig('faqGuaranteeCta', val)}
                label="Guarantee CTA"
              />
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </SectionPartWrapper>
      );
    }

    return null;
  };

  return (
    <section
      id="faq"
      className="relative py-24 border-b border-neutral-200 bg-gradient-to-b from-white via-[#FAFAFA] to-white overflow-hidden"
    >
      <div
        className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(16,185,129,0.05),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <SectionBuilderBar
        sectionId="faq"
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        label="Direct Hire FAQ"
      />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {visibleParts.map((partId, idx) => renderPart(partId, idx))}
      </div>
    </section>
  );
};
