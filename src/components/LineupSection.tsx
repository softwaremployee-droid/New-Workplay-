import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Candidate } from '../data/talent';
import { SoftwareEmployeeCutout } from './SoftwareEmployeeCutout';
import { PlatformLogo, SOFTWARE_APPLICATIONS } from './PlatformLogo';
import { SectionBuilderBar } from './SectionBuilderBar';
import { SectionPartWrapper } from './SectionPartWrapper';
import { EditableText } from './EditableText';
import { PartId, useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface LineupSectionProps {
  shortlist: Candidate[];
  onToggleShortlist: (candidate: Candidate) => void;
  onOpenDossier: (candidate: Candidate) => void;
  onHoverCandidate: (candidate: Candidate | null) => void;
  hoveredCandidate: Candidate | null;
  onOpenWorkflow: () => void;
  onOpenWorkshops?: () => void;
  currency: 'EUR' | 'USD' | 'GBP';
  sectionIndex?: number;
  totalSections?: number;
}

export const LineupSection: React.FC<LineupSectionProps> = ({
  shortlist,
  onToggleShortlist,
  onOpenDossier,
  onHoverCandidate,
  hoveredCandidate,
  sectionIndex = 0,
  totalSections = 4,
}) => {
  const {
    isBuilderMode,
    candidates,
    config,
    updateConfig,
    sectionParts,
    hiddenParts,
    setDraggedItem,
  } = useStudioBuilder();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const scrollByEmployee = (direction: -1 | 1) => {
    soundFx.playTick();
    const container = scrollRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>(
      '[data-employee-card="true"]'
    );
    if (cards.length >= 2) {
      const step = cards[1].offsetLeft - cards[0].offsetLeft;
      container.scrollBy({ left: direction * step, behavior: 'smooth' });
    } else if (cards.length === 1) {
      container.scrollBy({
        left: direction * cards[0].offsetWidth,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBuilderMode) return;
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftStart(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isBuilderMode) return;
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    scrollRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const isShortlisted = (id: string) => shortlist.some((item) => item.id === id);

  const marqueeApps = [...SOFTWARE_APPLICATIONS, ...SOFTWARE_APPLICATIONS];

  const visibleParts = (sectionParts.lineup || []).filter(
    (partId) => !hiddenParts.includes(partId)
  );

  const renderPart = (partId: PartId, partIdx: number) => {
    if (partId === 'lineup-headline') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="lineup"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="relative px-6 lg:px-12 pt-1 sm:pt-2 bg-transparent"
        >
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-4xl bg-transparent"
          >
            {config.showHeroBadge && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-xs border border-black/10 text-xs font-mono-numbers font-bold text-[#111111] mb-3.5">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                <EditableText
                  value={config.heroBadgeText}
                  onChange={(val) => updateConfig('heroBadgeText', val)}
                  label="Top Badge Copy"
                />
              </div>
            )}

            <div className="flex flex-wrap items-baseline gap-4 sm:gap-5">
              <EditableText
                as="h1"
                value={config.heroHeadline}
                onChange={(val) => updateConfig('heroHeadline', val)}
                className="font-brand text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#111111] leading-none select-none"
                label="Main Hero Header"
              />

              {config.showHeroTab && (
                <span className="px-3.5 py-1 rounded-full bg-[#111111] text-white text-xs sm:text-sm font-mono-numbers font-bold uppercase tracking-wider">
                  <EditableText
                    value={config.heroTabText}
                    onChange={(val) => updateConfig('heroTabText', val)}
                    label="Header Tab"
                  />
                </span>
              )}
            </div>

            {config.showHeroSubheadline && (
              <div className="mt-4 sm:mt-5 max-w-2xl">
                <EditableText
                  as="p"
                  value={config.heroSubheadline}
                  onChange={(val) => updateConfig('heroSubheadline', val)}
                  className="text-sm sm:text-base md:text-lg text-[#111111] font-mono-numbers leading-snug font-bold"
                  label="Hero Subheadline"
                />
              </div>
            )}
          </motion.div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'lineup-apps-marquee') {
      if (!config.showHeroAppMarquee) return null;
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="lineup"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="relative px-6 lg:px-12 bg-transparent"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className="mt-5 sm:mt-6 max-w-5xl bg-transparent"
          >
            <div
              className="relative overflow-hidden py-2.5"
              style={{
                WebkitMaskImage:
                  'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
                maskImage:
                  'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
              }}
            >
              <motion.div
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                  duration: 26,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="flex items-center gap-8 sm:gap-12 w-max pr-8 sm:pr-12"
              >
                {marqueeApps.map((app, idx) => (
                  <motion.div
                    key={`${app.id}-${idx}`}
                    draggable={isBuilderMode}
                    onDragStart={(e: any) => {
                      if (!isBuilderMode) return;
                      if (e.dataTransfer) {
                        e.dataTransfer.effectAllowed = 'copy';
                      }
                      setDraggedItem({ type: 'app', appId: app.id });
                    }}
                    onDragEnd={() => setDraggedItem(null)}
                    animate={{
                      y: [0, -3, 0],
                    }}
                    transition={{
                      duration: 2.6 + (idx % 5) * 0.35,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    whileHover={{ scale: 1.08, y: -4 }}
                    onMouseEnter={() => soundFx.playTick()}
                    className={`flex items-center gap-2.5 shrink-0 select-none group ${
                      isBuilderMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
                    }`}
                    title={
                      isBuilderMode
                        ? `Drag ${app.name} onto any Workflow Stage or Workshop below`
                        : app.name
                    }
                  >
                    <div className="flex items-center justify-center transition-transform duration-200">
                      <PlatformLogo platform={app.id} size={22} />
                    </div>
                    <span className="text-xs sm:text-sm font-mono-numbers font-bold text-[#111111] group-hover:text-black transition-colors tracking-tight">
                      {app.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'lineup-employees-runway') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="lineup"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="relative py-2 w-full px-12 sm:px-16 lg:px-24 bg-transparent"
        >
          {/* Left/Right Runway Scroll Controls in the outer gutter */}
          <div className="pointer-events-none absolute inset-y-0 left-1.5 sm:left-3 lg:left-7 right-1.5 sm:right-3 lg:right-7 z-30 flex items-center justify-between">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollByEmployee(-1);
              }}
              aria-label="Scroll employees left"
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/95 hover:bg-[#111111] text-[#111111] hover:text-white border border-black/10 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                scrollByEmployee(1);
              }}
              aria-label="Scroll employees right"
              className="pointer-events-auto h-10 w-10 rounded-full bg-white/95 hover:bg-[#111111] text-[#111111] hover:text-white border border-black/10 shadow-md flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`employee-runway-track w-full overflow-x-auto no-scrollbar pb-0 pt-2 bg-transparent ${
              isDragging
                ? 'cursor-grabbing select-none'
                : 'scroll-smooth snap-x snap-mandatory cursor-grab'
            }`}
          >
            {candidates.map((candidate, index) => {
              const isDrafted = isShortlisted(candidate.id);
              const isHovered = hoveredCandidate?.id === candidate.id;

              return (
                <div
                  key={candidate.id}
                  id={`candidate-${candidate.id}`}
                  data-employee-card="true"
                  className="w-full min-w-0 max-w-full snap-start bg-transparent"
                >
                  <SoftwareEmployeeCutout
                    candidate={candidate}
                    index={index}
                    totalCount={candidates.length}
                    isHovered={isHovered}
                    isShortlisted={isDrafted}
                    onHover={onHoverCandidate}
                    onSelect={onOpenDossier}
                    onToggleShortlist={onToggleShortlist}
                  />
                </div>
              );
            })}
          </div>
        </SectionPartWrapper>
      );
    }

    return null;
  };

  return (
    <section
      id="lineup"
      className="relative pt-20 sm:pt-24 pb-0 flex flex-col justify-start overflow-hidden bg-transparent"
    >
      {/* Seamless full-section ambient light gradient without any sharp divide */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,rgba(16,185,129,0.055)_0%,rgba(250,250,250,0.4)_65%,rgba(250,250,250,0)_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <SectionBuilderBar
        sectionId="lineup"
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        label="Hero & Employees"
      />

      {visibleParts.map((partId, idx) => renderPart(partId, idx))}
    </section>
  );
};
