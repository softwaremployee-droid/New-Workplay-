import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Terminal,
  Layers,
  Check,
  GripVertical,
  X,
  Pencil,
  Trash2,
} from 'lucide-react';
import { PlatformLogo, SOFTWARE_APPLICATIONS, PlatformType } from './PlatformLogo';
import { ConfettiCanvas } from './ConfettiCanvas';
import { SectionBuilderBar } from './SectionBuilderBar';
import { SectionPartWrapper } from './SectionPartWrapper';
import { EditableText } from './EditableText';
import {
  PartId,
  useStudioBuilder,
  WorkshopTrackItem,
} from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface WorkshopsSectionProps {
  sectionIndex?: number;
  totalSections?: number;
}

export const WorkshopsSection: React.FC<WorkshopsSectionProps> = ({
  sectionIndex = 2,
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
    workshopTracks,
    updateWorkshopTrack,
    deleteWorkshopTrack,
    reorderWorkshopTracks,
    dropAppOnWorkshop,
    removeAppFromWorkshop,
    draggedItem,
    setDraggedItem,
  } = useStudioBuilder();

  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>(
    workshopTracks[0]?.id || 'workshop-funnel-onboarding'
  );
  const [selectedApps, setSelectedApps] = useState<PlatformType[]>([
    'typeform',
    'hubspot',
    'stripe',
    'slack',
  ]);
  const [workEmail, setWorkEmail] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [reserved, setReserved] = useState<boolean>(false);
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [dragOverTrackIdx, setDragOverTrackIdx] = useState<number | null>(null);
  const [openAppPickerIdx, setOpenAppPickerIdx] = useState<number | null>(null);

  const activeWorkshop =
    workshopTracks.find((w) => w.id === selectedWorkshopId) || workshopTracks[0];

  const handleSelectWorkshop = (track: WorkshopTrackItem, idx: number) => {
    soundFx.playTick();
    setSelectedWorkshopId(track.id);
    setSelectedApps((prev) => {
      const merged = new Set([...prev, ...track.apps]);
      return Array.from(merged);
    });
    if (isBuilderMode) {
      setActiveSection('workshops');
      setSelectedTarget({ kind: 'workshop', workshopIndex: idx });
    }
  };

  const handleToggleApp = (appId: PlatformType) => {
    soundFx.playTick();
    setSelectedApps((prev) =>
      prev.includes(appId) ? prev.filter((id) => id !== appId) : [...prev, appId]
    );
  };

  const handleStartBuildSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workEmail) return;
    soundFx.playHireChime();
    setConfettiKey(Date.now());
    setReserved(true);
  };

  const visibleParts = (sectionParts.workshops || []).filter(
    (partId) => !hiddenParts.includes(partId)
  );

  const renderPart = (partId: PartId, partIdx: number) => {
    if (partId === 'workshops-header') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workshops"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mb-14"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-[#111111] text-white text-xs font-mono-numbers uppercase tracking-widest font-bold mb-3">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <EditableText
                  value={config.workshopsBadge}
                  onChange={(val) => updateConfig('workshopsBadge', val)}
                  label="Workshops Badge"
                />
              </div>

              <EditableText
                as="h2"
                value={config.workshopsHeadline}
                onChange={(val) => updateConfig('workshopsHeadline', val)}
                className="font-brand text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] leading-none block"
                label="Workshops Headline"
              />

              <div className="mt-4 max-w-2xl">
                <EditableText
                  as="p"
                  multiline
                  value={config.workshopsSubheadline}
                  onChange={(val) => updateConfig('workshopsSubheadline', val)}
                  className="text-sm sm:text-base text-neutral-600 leading-relaxed"
                  label="Workshops Subheadline"
                />
              </div>
            </div>

            <div className="shrink-0">
              <a
                href="#build-cta-card"
                onClick={() => soundFx.playPop()}
                className="inline-flex items-center gap-3 bg-[#111111] text-white hover:bg-neutral-800 px-6 py-3.5 rounded-full text-xs font-mono-numbers font-bold uppercase tracking-widest shadow-lg transition-all active:scale-95"
              >
                <Terminal className="h-4 w-4 text-emerald-400" />
                <span>Launch Build Workshop</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'workshops-tracks-grid') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workshops"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {workshopTracks.map((track, idx) => {
              const isSelected = track.id === selectedWorkshopId;
              const isBuilderSelected =
                isBuilderMode &&
                selectedTarget?.kind === 'workshop' &&
                selectedTarget.workshopIndex === idx;
              const isDragOver = dragOverTrackIdx === idx;
              return (
                <div
                  key={track.id}
                  draggable={isBuilderMode}
                  onDragStart={(e) => {
                    if (!isBuilderMode) return;
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedItem({ type: 'workshop', workshopIndex: idx });
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null);
                    setDragOverTrackIdx(null);
                  }}
                  onDragOver={(e) => {
                    if (!isBuilderMode) return;
                    if (
                      draggedItem?.type === 'app' ||
                      (draggedItem?.type === 'workshop' &&
                        draggedItem.workshopIndex !== idx)
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverTrackIdx(idx);
                    }
                  }}
                  onDragLeave={() => setDragOverTrackIdx(null)}
                  onDrop={(e) => {
                    if (!isBuilderMode) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverTrackIdx(null);

                    if (draggedItem?.type === 'app') {
                      soundFx.playPop();
                      dropAppOnWorkshop(idx, draggedItem.appId);
                    } else if (
                      draggedItem?.type === 'workshop' &&
                      draggedItem.workshopIndex !== idx
                    ) {
                      soundFx.playPop();
                      reorderWorkshopTracks(draggedItem.workshopIndex, idx);
                    }
                    setDraggedItem(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectWorkshop(track, idx);
                  }}
                  className={`group/track relative cursor-pointer rounded-2xl p-6 sm:p-7 transition-all border flex flex-col justify-between ${
                    isDragOver
                      ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500 scale-[1.01] shadow-xl'
                      : isBuilderSelected
                      ? 'bg-white border-emerald-500 ring-2 ring-emerald-500 shadow-xl'
                      : isSelected
                      ? 'bg-white border-[#111111] ring-2 ring-[#111111] shadow-xl'
                      : 'bg-white/90 hover:bg-white border-neutral-200 hover:border-neutral-400 shadow-xs'
                  }`}
                >
                  {/* Floating Edit & Delete Buttons on Each Workshop Track Card */}
                  {isBuilderMode && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute -top-3 right-4 z-30 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#111111] text-white text-[9px] font-mono-numbers font-bold uppercase shadow-md border border-white/15 transition-opacity ${
                        isBuilderSelected
                          ? 'opacity-100'
                          : 'opacity-0 group-hover/track:opacity-100 pointer-events-none group-hover/track:pointer-events-auto'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playPop();
                          selectAndEditTarget({ kind: 'workshop', workshopIndex: idx });
                        }}
                        className="px-1.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] flex items-center gap-0.5 cursor-pointer"
                        title="Edit this workshop component"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                        <span>Edit</span>
                      </button>

                      {workshopTracks.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playTick();
                            deleteWorkshopTrack(idx);
                          }}
                          className="px-1.5 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center gap-0.5 cursor-pointer"
                          title="Delete this workshop component"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    {/* Top Meta Row */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-1.5">
                        {isBuilderMode && (
                          <span title="Drag to reorder workshop track" className="flex items-center">
                            <GripVertical className="h-3.5 w-3.5 text-neutral-400 cursor-grab" />
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-mono-numbers font-bold uppercase px-3 py-1 rounded-full tracking-wider ${
                            isSelected
                              ? 'bg-[#111111] text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          {track.code}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono-numbers font-bold text-emerald-600 flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        {track.seatsLeft} Seats Left
                      </span>
                    </div>

                    {/* Workshop Title & Description */}
                    <EditableText
                      as="h3"
                      value={track.title}
                      onChange={(val) => updateWorkshopTrack(idx, { title: val })}
                      className="font-brand text-xl sm:text-2xl font-black uppercase tracking-tight text-[#111111] block"
                      label="Workshop Title"
                    />

                    <div className="mt-1.5">
                      <EditableText
                        as="p"
                        multiline
                        value={track.subtitle}
                        onChange={(val) => updateWorkshopTrack(idx, { subtitle: val })}
                        className="text-xs sm:text-sm text-neutral-600 leading-relaxed"
                        label="Workshop Subtitle"
                      />
                    </div>

                    {/* Powered By App Logos Row */}
                    <div className="mt-5 pt-4 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-[10px] font-mono-numbers font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                        <span>Software Apps Used in Workshop:</span>
                        {isBuilderMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playTick();
                              setOpenAppPickerIdx(openAppPickerIdx === idx ? null : idx);
                            }}
                            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
                          >
                            {openAppPickerIdx === idx ? 'Done' : '+ Add App'}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {track.apps.map((appId) => {
                          const appObj = SOFTWARE_APPLICATIONS.find(
                            (a) => a.id === appId
                          );
                          return (
                            <div
                              key={appId}
                              className="relative group/wapp flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-200/80"
                            >
                              <PlatformLogo platform={appId} size={16} />
                              <span className="text-xs font-mono-numbers font-bold text-[#111111]">
                                {appObj?.name}
                              </span>
                              {isBuilderMode && track.apps.length > 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    soundFx.playTick();
                                    removeAppFromWorkshop(idx, appId);
                                  }}
                                  className="ml-0.5 text-neutral-400 hover:text-[#111111] cursor-pointer"
                                  title={`Remove ${appObj?.name}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {isBuilderMode && openAppPickerIdx === idx && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2.5 p-2 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-wrap gap-1.5"
                        >
                          {SOFTWARE_APPLICATIONS.map((app) => {
                            const hasApp = track.apps.includes(app.id);
                            return (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => {
                                  soundFx.playTick();
                                  if (hasApp && track.apps.length > 1) {
                                    removeAppFromWorkshop(idx, app.id);
                                  } else if (!hasApp) {
                                    dropAppOnWorkshop(idx, app.id);
                                  }
                                }}
                                className={`px-2 py-1 rounded-lg border flex items-center gap-1 text-[10px] font-mono-numbers font-bold cursor-pointer ${
                                  hasApp
                                    ? 'bg-[#111111] text-white border-[#111111]'
                                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                                }`}
                              >
                                <PlatformLogo platform={app.id} size={12} />
                                <span>{app.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Workshop Curriculum Outcomes */}
                    <ul className="mt-5 space-y-2">
                      {track.outcomes.map((outcome, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-xs text-neutral-600 leading-relaxed"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <EditableText
                            value={outcome}
                            onChange={(val) => {
                              const nextOutcomes = [...track.outcomes];
                              nextOutcomes[i] = val;
                              updateWorkshopTrack(idx, { outcomes: nextOutcomes });
                            }}
                            label={`Curriculum Outcome ${i + 1}`}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Bottom Schedule & Select CTA */}
                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div className="text-[11px] font-mono-numbers text-neutral-500">
                      <div className="font-bold text-[#111111] flex items-center gap-1.5">
                        <Calendar className="h-3 w-3 text-neutral-500" />
                        <EditableText
                          value={track.schedule}
                          onChange={(val) => updateWorkshopTrack(idx, { schedule: val })}
                          label="Schedule"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock className="h-3 w-3 text-neutral-400" />
                        <EditableText
                          value={track.duration}
                          onChange={(val) => updateWorkshopTrack(idx, { duration: val })}
                          label="Duration"
                        />
                      </div>
                    </div>

                    <span
                      className={`px-3.5 py-2 rounded-full text-[10px] font-mono-numbers font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#111111] text-white'
                          : 'bg-neutral-100 text-[#111111] group-hover:bg-neutral-200'
                      }`}
                    >
                      <span>{isSelected ? 'Selected for Build' : 'Select Track'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'workshops-build-card') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workshops"
          partIndex={partIdx}
          totalParts={visibleParts.length}
        >
          <div
            id="build-cta-card"
            className="rounded-3xl bg-gradient-to-br from-[#111111] via-[#18181b] to-[#09090b] text-white p-8 sm:p-12 shadow-2xl border border-neutral-800 relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Build Value Prop & Interactive App Stack Picker */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono-numbers font-bold uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  <EditableText
                    value={config.buildCardBadge}
                    onChange={(val) => updateConfig('buildCardBadge', val)}
                    label="Build Card Badge"
                  />
                </div>

                <EditableText
                  as="h3"
                  value={config.buildCardHeadline}
                  onChange={(val) => updateConfig('buildCardHeadline', val)}
                  className="font-brand text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight block"
                  label="Build Card Headline"
                />

                <div className="max-w-xl">
                  <EditableText
                    as="p"
                    multiline
                    value={config.buildCardSubheadline}
                    onChange={(val) => updateConfig('buildCardSubheadline', val)}
                    className="text-sm text-neutral-300 leading-relaxed"
                    label="Build Card Subheadline"
                  />
                </div>

                {/* Interactive Software Apps Stack Selector for Build */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-400 uppercase tracking-wider mb-3">
                    <span>
                      1. Select Software Apps to Connect in Build ({selectedApps.length})
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playTick();
                        setSelectedApps(SOFTWARE_APPLICATIONS.map((a) => a.id));
                      }}
                      className="text-emerald-400 hover:underline cursor-pointer text-[11px] font-bold"
                    >
                      Select All 9 Apps
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {SOFTWARE_APPLICATIONS.map((app) => {
                      const active = selectedApps.includes(app.id);
                      return (
                        <button
                          key={app.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleApp(app.id);
                          }}
                          className={`px-3.5 py-2 rounded-xl text-xs font-mono-numbers font-bold flex items-center gap-2 transition-all cursor-pointer border ${
                            active
                              ? 'bg-white text-[#111111] border-white shadow-md scale-[1.02]'
                              : 'bg-neutral-900/90 text-neutral-300 border-neutral-700 hover:border-neutral-500'
                          }`}
                        >
                          <div className="bg-white rounded-md p-1 flex items-center justify-center">
                            <PlatformLogo platform={app.id} size={15} />
                          </div>
                          <span>{app.name}</span>
                          {active && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Workshop Summary Pill */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono-numbers text-neutral-400">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-emerald-400" />
                    <span>
                      Active Track:{' '}
                      <strong className="text-white">{activeWorkshop?.title}</strong>
                    </span>
                  </div>
                  <span>·</span>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400" />
                    <span>Live 1-on-1 Architect Guidance Included</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Action Form for Build */}
              <div className="lg:col-span-5">
                <div className="bg-white text-[#111111] rounded-2xl p-6 sm:p-8 shadow-xl">
                  <AnimatePresence mode="wait">
                    {reserved ? (
                      <motion.div
                        key="reserved"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-6 space-y-4"
                      >
                        <div className="mx-auto h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div className="text-[11px] font-mono-numbers font-bold uppercase tracking-widest text-emerald-600">
                          BUILD WORKSHOP SEAT CONFIRMED
                        </div>
                        <h4 className="font-brand text-2xl font-black uppercase text-[#111111]">
                          You’re Registered for Build!
                        </h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">
                          We’ve sent your calendar invite and pre-configured{' '}
                          <strong className="text-[#111111]">
                            {activeWorkshop?.title}
                          </strong>{' '}
                          sandbox to <strong className="text-[#111111]">{workEmail}</strong>{' '}
                          with{' '}
                          <strong className="text-[#111111]">
                            {selectedApps.length} connected apps
                          </strong>
                          .
                        </p>
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={() => {
                              soundFx.playTick();
                              setReserved(false);
                            }}
                            className="w-full py-3 rounded-full bg-[#111111] text-white text-xs font-mono-numbers font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors cursor-pointer"
                          >
                            Configure Another Build Workshop
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.form
                        key="form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleStartBuildSubmit}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                          <div>
                            <div className="text-[10px] font-mono-numbers font-bold uppercase tracking-widest text-emerald-600">
                              CALL TO ACTION · BUILD
                            </div>
                            <EditableText
                              as="h4"
                              value={config.buildFormTitle}
                              onChange={(val) => updateConfig('buildFormTitle', val)}
                              className="font-brand text-xl font-black uppercase text-[#111111] mt-0.5 block"
                              label="Form Title"
                            />
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-[10px] font-mono-numbers font-bold uppercase text-[#111111]">
                            Free Live Seat
                          </span>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-numbers font-bold uppercase text-neutral-600 mb-1">
                            Selected Workshop Cohort
                          </label>
                          <select
                            value={selectedWorkshopId}
                            onChange={(e) => {
                              const idx = workshopTracks.findIndex(
                                (w) => w.id === e.target.value
                              );
                              if (idx >= 0) handleSelectWorkshop(workshopTracks[idx], idx);
                            }}
                            className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-xs font-mono-numbers font-bold text-[#111111] focus:border-black focus:outline-none"
                          >
                            {workshopTracks.map((w) => (
                              <option key={w.id} value={w.id}>
                                {w.code}: {w.title} ({w.schedule})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-numbers font-bold uppercase text-neutral-600 mb-1">
                            Company / Workspace Name
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Acme Studio"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-mono-numbers text-[#111111] placeholder:text-neutral-400 focus:border-black focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono-numbers font-bold uppercase text-neutral-600 mb-1">
                            Work Email *
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="founder@company.com"
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                            className="w-full rounded-xl border border-neutral-300 px-3.5 py-2.5 text-xs font-mono-numbers text-[#111111] placeholder:text-neutral-400 focus:border-black focus:outline-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 px-5 rounded-full bg-[#111111] hover:bg-neutral-800 text-white font-mono-numbers text-xs font-bold uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                        >
                          <Sparkles className="h-4 w-4 text-emerald-400" />
                          <span>Launch Build & Reserve Workshop</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <p className="text-[11px] font-mono-numbers text-neutral-500 text-center">
                          Includes pre-built templates for {selectedApps.length} selected
                          Software Apps.
                        </p>
                      </motion.form>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </SectionPartWrapper>
      );
    }

    return null;
  };

  return (
    <section
      id="workshops"
      className="relative py-24 border-b border-neutral-200 bg-gradient-to-b from-white via-[#FAFAFA] to-[#F3F3F1] overflow-hidden"
    >
      <ConfettiCanvas triggerKey={confettiKey} />

      <SectionBuilderBar
        sectionId="workshops"
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        label="Live Build Workshops"
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {visibleParts.map((partId, idx) => renderPart(partId, idx))}
      </div>
    </section>
  );
};
