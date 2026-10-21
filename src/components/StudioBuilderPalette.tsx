import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  Check,
  Upload,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  MousePointerClick,
  Plus,
  Trash2,
  Pencil,
  Undo2,
  Redo2,
  Zap,
  Play,
  Copy,
  History,
  Lock,
  Unlock,
  BookmarkCheck,
  Download,
  FileUp,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  PartId,
  PART_DEFINITIONS,
  SectionId,
  EntranceEffect,
  HoverEffect,
  ClickInteraction,
  SurfaceStyle,
  PaddingScale,
  TextAlignOption,
  getTargetInteractionKey,
  useStudioBuilder,
} from '../context/StudioBuilderContext';
import { PlatformLogo, SOFTWARE_APPLICATIONS } from './PlatformLogo';
import {
  processSingleHeadshotFile,
  splitGridImageIntoSixCutouts,
} from '../utils/imageCutoutClient';
import { soundFx } from '../utils/sound';

const SECTION_META: Record<SectionId, { code: string; label: string; anchor: string }> = {
  lineup: { code: '01', label: 'Hero & Employees', anchor: 'lineup' },
  workflow: { code: '02', label: '6-Stage Workflow', anchor: 'workflow' },
  workshops: { code: '03', label: 'Build Workshops', anchor: 'workshops' },
  faq: { code: '04', label: 'Direct Hire FAQ', anchor: 'faq' },
};

export const StudioBuilderPalette: React.FC = () => {
  const {
    isBuilderMode,
    setIsBuilderMode,
    isBarVisible,
    hidePreviewBar,
    showPreviewBar,
    isInspectorOpen,
    setIsInspectorOpen,
    activeSection,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    sectionOrder,
    moveSection,
    hiddenSections,
    toggleSectionVisibility,
    sectionParts,
    movePartInSection,
    hiddenParts,
    togglePartVisibility,
    deletePart,
    config,
    updateConfig,
    candidates,
    updateCandidate,
    deleteCandidate,
    duplicateCandidate,
    reorderCandidates,
    replaceAllCandidatePhotos,
    workflowStages,
    updateWorkflowStage,
    deleteWorkflowStage,
    duplicateWorkflowStage,
    addWorkflowStage,
    dropAppOnStage,
    removeAppFromStage,
    dropEmployeeOnStage,
    workshopTracks,
    updateWorkshopTrack,
    deleteWorkshopTrack,
    duplicateWorkshopTrack,
    addWorkshopTrack,
    dropAppOnWorkshop,
    removeAppFromWorkshop,
    faqs,
    updateFaq,
    addFaq,
    duplicateFaq,
    deleteFaq,
    getInteractionForKey,
    updateInteractionForKey,
    triggerInteractionPreview,
    undo,
    redo,
    canUndo,
    canRedo,
    historyPast,
    revertToSnapshot,
    savedVersions,
    saveCurrentVersion,
    restoreSavedVersion,
    deleteSavedVersion,
    exportCurrentVersionJson,
    importVersionJson,
    setDraggedItem,
    resetAllToDefaults,
    lastSavedMessage,
  } = useStudioBuilder();

  const [viewMode, setViewMode] = useState<
    'inspector' | 'interactions' | 'parts' | 'versions' | 'drag'
  >('inspector');
  const [inspectorSubTab, setInspectorSubTab] = useState<'content' | 'style'>('content');
  const [versionNameInput, setVersionNameInput] = useState<string>('');
  const [partSearchQuery, setPartSearchQuery] = useState<string>('');
  const [isProcessingPhoto, setIsProcessingPhoto] = useState<boolean>(false);

  const handleSinglePhotoUpload = async (candidateId: string, file: File) => {
    setIsProcessingPhoto(true);
    try {
      soundFx.playTick();
      const cutout = await processSingleHeadshotFile(file, true);
      updateCandidate(candidateId, { imageSrc: cutout });
      soundFx.playHireChime();
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleGridUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessingPhoto(true);
    try {
      soundFx.playTick();
      const cutouts = await splitGridImageIntoSixCutouts(file, true);
      if (cutouts.length === 6) {
        replaceAllCandidatePhotos(cutouts);
        soundFx.playHireChime();
      }
    } finally {
      setIsProcessingPhoto(false);
      e.target.value = '';
    }
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        importVersionJson(reader.result);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const jumpToPart = (sectionId: SectionId, partId: PartId) => {
    soundFx.playTick();
    selectAndEditTarget({ kind: 'part', sectionId, partId });
    setViewMode('inspector');
    const el =
      document.getElementById(`part-${partId}`) || document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleDeleteCurrentTarget = () => {
    if (!selectedTarget) return;
    soundFx.playTick();
    if (selectedTarget.kind === 'part') {
      deletePart(selectedTarget.partId);
    } else if (selectedTarget.kind === 'employee') {
      deleteCandidate(selectedTarget.candidateId);
    } else if (selectedTarget.kind === 'stage') {
      deleteWorkflowStage(selectedTarget.stageIndex);
    } else if (selectedTarget.kind === 'workshop') {
      deleteWorkshopTrack(selectedTarget.workshopIndex);
    } else if (selectedTarget.kind === 'faq') {
      deleteFaq(selectedTarget.faqIndex);
    }
  };

  const handleCloneCurrentTarget = () => {
    if (!selectedTarget) return;
    soundFx.playPop();
    if (selectedTarget.kind === 'employee') {
      duplicateCandidate(selectedTarget.candidateId);
    } else if (selectedTarget.kind === 'stage') {
      duplicateWorkflowStage(selectedTarget.stageIndex);
    } else if (selectedTarget.kind === 'workshop') {
      duplicateWorkshopTrack(selectedTarget.workshopIndex);
    } else if (selectedTarget.kind === 'faq') {
      duplicateFaq(selectedTarget.faqIndex);
    }
  };

  const canCloneTarget =
    selectedTarget &&
    (selectedTarget.kind === 'employee' ||
      selectedTarget.kind === 'stage' ||
      selectedTarget.kind === 'workshop' ||
      selectedTarget.kind === 'faq');

  const getSelectionTitle = (): string => {
    if (!selectedTarget) return 'Select any site component';
    if (selectedTarget.kind === 'part') {
      return PART_DEFINITIONS[selectedTarget.partId]?.label || 'Selected Part';
    }
    if (selectedTarget.kind === 'employee') {
      const emp =
        candidates.find((c) => c.id === selectedTarget.candidateId) ||
        candidates[selectedTarget.index];
      return emp ? `Employee #${selectedTarget.index + 1}: ${emp.role}` : 'Employee';
    }
    if (selectedTarget.kind === 'stage') {
      const st = workflowStages[selectedTarget.stageIndex];
      return st ? `${st.stageNumber}: ${st.title}` : 'Workflow Stage';
    }
    if (selectedTarget.kind === 'workshop') {
      const tr = workshopTracks[selectedTarget.workshopIndex];
      return tr ? `${tr.code}: ${tr.title}` : 'Workshop Track';
    }
    if (selectedTarget.kind === 'faq') {
      return `FAQ Question #${selectedTarget.faqIndex + 1}`;
    }
    return 'Selected Component';
  };

  const getActiveInteractionKey = (): { key: string; label: string } => {
    if (!selectedTarget) {
      return {
        key: 'part:lineup-headline',
        label: 'Hero Headline & Tagline',
      };
    }
    if (selectedTarget.kind === 'part') {
      return {
        key: `part:${selectedTarget.partId}`,
        label: PART_DEFINITIONS[selectedTarget.partId]?.label || selectedTarget.partId,
      };
    }
    if (selectedTarget.kind === 'employee') {
      return {
        key: 'part:lineup-employees-runway',
        label: 'Software Employees Runway',
      };
    }
    if (selectedTarget.kind === 'stage') {
      return {
        key: 'part:workflow-stages-grid',
        label: '6-Stage Pipeline Grid',
      };
    }
    if (selectedTarget.kind === 'workshop') {
      return {
        key: 'part:workshops-tracks-grid',
        label: '3 Live Workshop Tracks',
      };
    }
    if (selectedTarget.kind === 'faq') {
      return {
        key: 'part:faq-accordion-list',
        label: 'FAQ Questions & Answers List',
      };
    }
    return {
      key: getTargetInteractionKey(selectedTarget),
      label: getSelectionTitle(),
    };
  };

  const renderInteractionsEditor = () => {
    const { key, label } = getActiveInteractionKey();
    const interaction = getInteractionForKey(key);

    const entranceOptions: { id: EntranceEffect; label: string }[] = [
      { id: 'none', label: 'None (Static)' },
      { id: 'fade-up', label: 'Fade Up' },
      { id: 'scale-in', label: 'Scale In' },
      { id: 'slide-left', label: 'Slide Left' },
      { id: 'slide-right', label: 'Slide Right' },
      { id: 'spring-pop', label: 'Spring Pop' },
    ];

    const hoverOptions: { id: HoverEffect; label: string }[] = [
      { id: 'none', label: 'None' },
      { id: 'lift', label: 'Lift & Shadow' },
      { id: 'scale', label: 'Subtle Zoom (1.02×)' },
      { id: 'glow-emerald', label: 'Emerald Glow Ring' },
      { id: 'border-highlight', label: 'Contrast Border' },
    ];

    const clickOptions: { id: ClickInteraction; label: string }[] = [
      { id: 'none', label: 'Default Behavior' },
      { id: 'scroll-workshops', label: 'Scroll → Live Workshops' },
      { id: 'scroll-workflow', label: 'Scroll → 6-Stage Workflow' },
      { id: 'scroll-faq', label: 'Scroll → Direct Hire FAQ' },
      { id: 'scroll-top', label: 'Scroll → Top Hero' },
    ];

    const surfaceOptions: { id: SurfaceStyle; label: string }[] = [
      { id: 'default', label: 'Default Transparent' },
      { id: 'card-white', label: 'Elevated White Card' },
      { id: 'glass', label: 'Frosted Glass' },
      { id: 'emerald-tint', label: 'Emerald Studio Tint' },
      { id: 'dark-contrast', label: 'Dark Contrast (#111)' },
    ];

    const paddingOptions: { id: PaddingScale; label: string }[] = [
      { id: 'compact', label: 'Compact' },
      { id: 'default', label: 'Default' },
      { id: 'spacious', label: 'Spacious' },
    ];

    const alignOptions: { id: TextAlignOption; label: string }[] = [
      { id: 'default', label: 'Auto' },
      { id: 'left', label: 'Left' },
      { id: 'center', label: 'Center' },
      { id: 'right', label: 'Right' },
    ];

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1.5">
              <Zap className="h-3 w-3" />
              <span>Target: {label}</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => triggerInteractionPreview(key)}
              className="px-3 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Play / Test Animation</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFx.playTick();
                updateInteractionForKey(key, { locked: !interaction.locked });
              }}
              className={`px-2.5 py-1 rounded-full text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                interaction.locked
                  ? 'bg-amber-400 text-[#111111]'
                  : 'bg-white/10 hover:bg-white/20 text-neutral-300'
              }`}
            >
              {interaction.locked ? (
                <>
                  <Lock className="h-3 w-3" />
                  <span>Locked</span>
                </>
              ) : (
                <>
                  <Unlock className="h-3 w-3" />
                  <span>Unlocked</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Entrance Animation */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 block">
              Entrance Motion Effect
            </span>
            <div className="flex flex-wrap gap-1">
              {entranceOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    updateInteractionForKey(key, { entrance: opt.id });
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    interaction.entrance === opt.id
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-black/40 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Hover Interaction */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 block">
              Hover Micro-Interaction
            </span>
            <div className="flex flex-wrap gap-1">
              {hoverOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    updateInteractionForKey(key, { hover: opt.id });
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    interaction.hover === opt.id
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-black/40 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Click Trigger */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-1.5">
            <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 block">
              Click Action Trigger
            </span>
            <div className="flex flex-wrap gap-1">
              {clickOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundFx.playPop();
                    updateInteractionForKey(key, { clickAction: opt.id });
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    interaction.clickAction === opt.id
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-black/40 text-neutral-300 hover:bg-white/10'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Surface Style, Spacing & Alignment */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 space-y-2">
            <div>
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 block mb-1">
                Surface & Layout Tuning
              </span>
              <div className="flex flex-wrap gap-1">
                {surfaceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      updateInteractionForKey(key, { surface: opt.id });
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-mono-numbers font-bold cursor-pointer transition-all ${
                      interaction.surface === opt.id
                        ? 'bg-emerald-500 text-[#111111]'
                        : 'bg-black/40 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Spacing
              </span>
              <div className="flex items-center gap-1">
                {paddingOptions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      updateInteractionForKey(key, { paddingScale: p.id })
                    }
                    className={`px-2 py-0.5 rounded text-[9px] font-mono-numbers font-bold cursor-pointer ${
                      (interaction.paddingScale || 'default') === p.id
                        ? 'bg-white text-[#111111]'
                        : 'bg-black/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Align
              </span>
              <div className="flex items-center gap-1">
                {alignOptions.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() =>
                      updateInteractionForKey(key, { textAlign: a.id })
                    }
                    className={`px-2 py-0.5 rounded text-[9px] font-mono-numbers font-bold cursor-pointer ${
                      (interaction.textAlign || 'default') === a.id
                        ? 'bg-white text-[#111111]'
                        : 'bg-black/40 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFocusedEditor = () => {
    if (!selectedTarget) {
      return (
        <div className="space-y-2.5">
          <div className="text-xs font-mono-numbers text-neutral-300 flex flex-wrap items-center justify-between gap-2">
            <span>
              Click any component on the page to edit it, or jump directly to a component
              below:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => saveCurrentVersion()}
                className="px-2.5 py-1 rounded-full bg-emerald-500 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
              >
                <BookmarkCheck className="h-3 w-3" />
                <span>Save Current Version (⌘S)</span>
              </button>
            </div>
          </div>

          {/* Quick-Select Component Strip */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => jumpToPart('lineup', 'lineup-headline')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              Hero Headline
            </button>
            <button
              type="button"
              onClick={() => jumpToPart('lineup', 'lineup-employees-runway')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              Employees Runway ({candidates.length})
            </button>
            <button
              type="button"
              onClick={() => jumpToPart('workflow', 'workflow-stages-grid')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              Workflow Stages ({workflowStages.length})
            </button>
            <button
              type="button"
              onClick={() => jumpToPart('workshops', 'workshops-tracks-grid')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              Workshop Tracks ({workshopTracks.length})
            </button>
            <button
              type="button"
              onClick={() => jumpToPart('faq', 'faq-header')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              FAQ Text Header
            </button>
            <button
              type="button"
              onClick={() => jumpToPart('faq', 'faq-accordion-list')}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-mono-numbers font-bold text-white cursor-pointer"
            >
              FAQ Questions ({faqs.length})
            </button>
          </div>
        </div>
      );
    }

    // Sub-tab switcher inside Inspector (Content & Copy vs. Style & Interactions)
    const subTabHeader = (
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 mb-2.5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setInspectorSubTab('content')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase cursor-pointer transition-colors ${
              inspectorSubTab === 'content'
                ? 'bg-emerald-500 text-[#111111]'
                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
            }`}
          >
            Content & Copy
          </button>
          <button
            type="button"
            onClick={() => setInspectorSubTab('style')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
              inspectorSubTab === 'style'
                ? 'bg-emerald-500 text-[#111111]'
                : 'bg-white/10 text-neutral-300 hover:bg-white/20'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            <span>Style, Layout & Motion</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => saveCurrentVersion()}
            className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-emerald-500 hover:text-[#111111] text-emerald-300 text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
            title="Save this version checkpoint (⌘S)"
          >
            <BookmarkCheck className="h-3 w-3" />
            <span>Save Version</span>
          </button>
        </div>
      </div>
    );

    if (inspectorSubTab === 'style') {
      return (
        <div>
          {subTabHeader}
          {renderInteractionsEditor()}
        </div>
      );
    }

    // 1. EMPLOYEE EDITOR
    if (
      selectedTarget.kind === 'employee' ||
      (selectedTarget.kind === 'part' &&
        selectedTarget.partId === 'lineup-employees-runway')
    ) {
      const activeIdx =
        selectedTarget.kind === 'employee'
          ? Math.min(selectedTarget.index, candidates.length - 1)
          : 0;
      const emp = candidates[activeIdx] || candidates[0];

      return (
        <div className="space-y-3">
          {subTabHeader}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {candidates.map((c, idx) => {
                const isSelected = c.id === emp.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setSelectedTarget({
                        kind: 'employee',
                        candidateId: c.id,
                        index: idx,
                      });
                    }}
                    className={`pl-1.5 pr-2.5 py-1 rounded-full text-[10px] font-mono-numbers font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                      isSelected
                        ? 'bg-emerald-500 text-[#111111]'
                        : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                    }`}
                  >
                    <img
                      src={c.imageSrc}
                      alt={c.name}
                      className="h-4 w-4 rounded-full object-cover object-top bg-white"
                    />
                    <span>
                      #{idx + 1} {c.role.replace(' Manager', '')}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={activeIdx === 0}
                onClick={() => {
                  soundFx.playTick();
                  reorderCandidates(activeIdx, activeIdx - 1);
                  setSelectedTarget({
                    kind: 'employee',
                    candidateId: emp.id,
                    index: activeIdx - 1,
                  });
                }}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3 w-3" /> Move Left
              </button>
              <button
                type="button"
                disabled={activeIdx === candidates.length - 1}
                onClick={() => {
                  soundFx.playTick();
                  reorderCandidates(activeIdx, activeIdx + 1);
                  setSelectedTarget({
                    kind: 'employee',
                    candidateId: emp.id,
                    index: activeIdx + 1,
                  });
                }}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                Move Right <ArrowRight className="h-3 w-3" />
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  duplicateCandidate(emp.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
                title="Clone this employee"
              >
                <Copy className="h-3 w-3" />
                <span>Clone</span>
              </button>

              <label className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer">
                <Upload className="h-3 w-3" />
                <span>{isProcessingPhoto ? 'Processing...' : 'Upload Cutout Photo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleSinglePhotoUpload(emp.id, f);
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>

              <label className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer">
                <Upload className="h-3 w-3 text-emerald-400" />
                <span>{emp.resumeUrl ? 'Replace Resume' : 'Upload Resume'}</span>
                <input
                  type="file"
                  accept=".pdf,image/*,.doc,.docx"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      soundFx.playTick();
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result =
                          typeof reader.result === 'string' ? reader.result : '';
                        if (result) {
                          updateCandidate(emp.id, {
                            resumeUrl: result,
                            resumeFileName: f.name,
                            resumeMimeType: f.type || 'application/octet-stream',
                          });
                          soundFx.playHireChime();
                        }
                      };
                      reader.readAsDataURL(f);
                    }
                    e.target.value = '';
                  }}
                  className="hidden"
                />
              </label>

              {emp.resumeUrl && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    updateCandidate(emp.id, {
                      resumeUrl: undefined,
                      resumeFileName: undefined,
                      resumeMimeType: undefined,
                    });
                  }}
                  className="px-2 py-1 rounded-lg bg-white/10 hover:bg-rose-500/30 text-neutral-300 hover:text-rose-200 text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                  title={`Remove ${emp.resumeFileName || 'uploaded resume'}`}
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Remove Resume</span>
                </button>
              )}

              <label className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer">
                <Upload className="h-3 w-3 text-emerald-400" />
                <span>Batch 3×2 Grid</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleGridUpload}
                  className="hidden"
                />
              </label>

              {candidates.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    deleteCandidate(emp.id);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Role Title
              </span>
              <input
                type="text"
                value={emp.role}
                onChange={(e) => updateCandidate(emp.id, { role: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Employee Name
              </span>
              <input
                type="text"
                value={emp.name}
                onChange={(e) => updateCandidate(emp.id, { name: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Capacity Multiplier
              </span>
              <input
                type="text"
                value={emp.capacityMultiplier || ''}
                onChange={(e) =>
                  updateCandidate(emp.id, { capacityMultiplier: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono-numbers font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Software Cost ($/yr)
              </span>
              <input
                type="number"
                value={emp.annualSalaryUsd ?? 24000}
                onChange={(e) =>
                  updateCandidate(emp.id, {
                    annualSalaryUsd: Number(e.target.value) || 0,
                  })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                City / Hub
              </span>
              <input
                type="text"
                value={emp.location}
                onChange={(e) => updateCandidate(emp.id, { location: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>
        </div>
      );
    }

    // 2. HERO HEADLINE PART
    if (
      selectedTarget.kind === 'part' &&
      (selectedTarget.partId === 'lineup-headline' ||
        selectedTarget.partId === 'lineup-subheadline')
    ) {
      return (
        <div>
          {subTabHeader}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Main Hero Headline
              </span>
              <input
                type="text"
                value={config.heroHeadline}
                onChange={(e) => updateConfig('heroHeadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Subheadline Copy
              </span>
              <input
                type="text"
                value={config.heroSubheadline}
                onChange={(e) => updateConfig('heroSubheadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => updateConfig('showHeroBadge', !config.showHeroBadge)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono-numbers font-bold border cursor-pointer ${
                  config.showHeroBadge
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                Top Copy: {config.showHeroBadge ? 'Shown' : 'Hidden'}
              </button>
              <button
                type="button"
                onClick={() => updateConfig('showHeroTab', !config.showHeroTab)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-mono-numbers font-bold border cursor-pointer ${
                  config.showHeroTab
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-neutral-400'
                }`}
              >
                Header Tab: {config.showHeroTab ? 'Shown' : 'Hidden'}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // 3. HERO APPS MARQUEE PART
    if (
      selectedTarget.kind === 'part' &&
      selectedTarget.partId === 'lineup-apps-marquee'
    ) {
      return (
        <div>
          {subTabHeader}
          <div className="flex items-center justify-between gap-4 py-1">
            <div className="text-xs font-mono-numbers text-neutral-300">
              Animated 9-App Marquee Strip (Typeform, HubSpot, Stripe, Slack, Google Sheets,
              Mailchimp, AirCall, Salesforce, Intercom)
            </div>
            <button
              type="button"
              onClick={() =>
                updateConfig('showHeroAppMarquee', !config.showHeroAppMarquee)
              }
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase cursor-pointer"
            >
              {config.showHeroAppMarquee ? 'Hide Marquee' : 'Show Marquee'}
            </button>
          </div>
        </div>
      );
    }

    // 4. WORKFLOW STAGE EDITOR
    if (
      selectedTarget.kind === 'stage' ||
      (selectedTarget.kind === 'part' &&
        selectedTarget.partId === 'workflow-stages-grid')
    ) {
      const stageIdx =
        selectedTarget.kind === 'stage'
          ? Math.min(selectedTarget.stageIndex, workflowStages.length - 1)
          : 0;
      const stage = workflowStages[stageIdx] || workflowStages[0];

      return (
        <div className="space-y-3">
          {subTabHeader}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {workflowStages.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    setSelectedTarget({ kind: 'stage', stageIndex: idx });
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    idx === stageIdx
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  {s.stageNumber}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  addWorkflowStage();
                }}
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#111111] text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Stage
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono-numbers text-neutral-400">
                Assigned Employee:
              </span>
              <select
                value={stage.candidateId}
                onChange={(e) => dropEmployeeOnStage(stageIdx, e.target.value)}
                className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-[11px] font-mono-numbers text-emerald-400 font-bold focus:outline-none"
              >
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.role} ({c.name})
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  duplicateWorkflowStage(stageIdx);
                }}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Clone</span>
              </button>

              {workflowStages.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    deleteWorkflowStage(stageIdx);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Stage Title
              </span>
              <input
                type="text"
                value={stage.title}
                onChange={(e) =>
                  updateWorkflowStage(stageIdx, { title: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Trigger Event
              </span>
              <input
                type="text"
                value={stage.trigger}
                onChange={(e) =>
                  updateWorkflowStage(stageIdx, { trigger: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Execution Action
              </span>
              <input
                type="text"
                value={stage.action}
                onChange={(e) =>
                  updateWorkflowStage(stageIdx, { action: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Outcome Metric
              </span>
              <input
                type="text"
                value={stage.outcome}
                onChange={(e) =>
                  updateWorkflowStage(stageIdx, { outcome: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono-numbers font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 mr-1">
              Connected Apps (Click to toggle):
            </span>
            {SOFTWARE_APPLICATIONS.map((app) => {
              const active = stage.apps.includes(app.id);
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    if (active) {
                      removeAppFromStage(stageIdx, app.id);
                    } else {
                      dropAppOnStage(stageIdx, app.id);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                    active
                      ? 'bg-white text-[#111111] border-white'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                  }`}
                >
                  <PlatformLogo platform={app.id} size={12} />
                  <span>{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 5. WORKFLOW HEADER OR ROI CONSOLE PART
    if (
      selectedTarget.kind === 'part' &&
      (selectedTarget.partId === 'workflow-header' ||
        selectedTarget.partId === 'workflow-roi-console' ||
        selectedTarget.partId === 'workflow-playbook-card' ||
        selectedTarget.partId === 'workflow-roi-card')
    ) {
      return (
        <div>
          {subTabHeader}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Workflow Headline
              </span>
              <input
                type="text"
                value={config.workflowHeadline}
                onChange={(e) => updateConfig('workflowHeadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Workflow Subheadline
              </span>
              <input
                type="text"
                value={config.workflowSubheadline}
                onChange={(e) => updateConfig('workflowSubheadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                ROI Console Title
              </span>
              <input
                type="text"
                value={config.workflowRoiTitle}
                onChange={(e) => updateConfig('workflowRoiTitle', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>
        </div>
      );
    }

    // 6. WORKSHOP TRACK EDITOR
    if (
      selectedTarget.kind === 'workshop' ||
      (selectedTarget.kind === 'part' &&
        selectedTarget.partId === 'workshops-tracks-grid')
    ) {
      const trackIdx =
        selectedTarget.kind === 'workshop'
          ? Math.min(selectedTarget.workshopIndex, workshopTracks.length - 1)
          : 0;
      const track = workshopTracks[trackIdx] || workshopTracks[0];

      return (
        <div className="space-y-3">
          {subTabHeader}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5">
              {workshopTracks.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    setSelectedTarget({ kind: 'workshop', workshopIndex: idx });
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    idx === trackIdx
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  {t.code}: {t.title}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  addWorkshopTrack();
                }}
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#111111] text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add Track
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  duplicateWorkshopTrack(trackIdx);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3 w-3" />
                <span>Clone</span>
              </button>

              {workshopTracks.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    deleteWorkshopTrack(trackIdx);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Delete Track</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Workshop Title
              </span>
              <input
                type="text"
                value={track.title}
                onChange={(e) =>
                  updateWorkshopTrack(trackIdx, { title: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Subtitle
              </span>
              <input
                type="text"
                value={track.subtitle}
                onChange={(e) =>
                  updateWorkshopTrack(trackIdx, { subtitle: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Schedule
              </span>
              <input
                type="text"
                value={track.schedule}
                onChange={(e) =>
                  updateWorkshopTrack(trackIdx, { schedule: e.target.value })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Employee Role Built
              </span>
              <input
                type="text"
                value={track.employeeRoleBuilt}
                onChange={(e) =>
                  updateWorkshopTrack(trackIdx, {
                    employeeRoleBuilt: e.target.value,
                  })
                }
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono-numbers font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[9px] font-mono-numbers uppercase text-neutral-400 mr-1">
              Workshop Apps:
            </span>
            {SOFTWARE_APPLICATIONS.map((app) => {
              const active = track.apps.includes(app.id);
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    if (active) {
                      removeAppFromWorkshop(trackIdx, app.id);
                    } else {
                      dropAppOnWorkshop(trackIdx, app.id);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold flex items-center gap-1.5 border cursor-pointer transition-all ${
                    active
                      ? 'bg-white text-[#111111] border-white'
                      : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                  }`}
                >
                  <PlatformLogo platform={app.id} size={12} />
                  <span>{app.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 7. WORKSHOPS HEADER OR BUILD CARD PART
    if (
      selectedTarget.kind === 'part' &&
      (selectedTarget.partId === 'workshops-header' ||
        selectedTarget.partId === 'workshops-build-card')
    ) {
      return (
        <div>
          {subTabHeader}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Workshops Headline
              </span>
              <input
                type="text"
                value={config.workshopsHeadline}
                onChange={(e) => updateConfig('workshopsHeadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Build Card Headline
              </span>
              <input
                type="text"
                value={config.buildCardHeadline}
                onChange={(e) => updateConfig('buildCardHeadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Registration Form Title
              </span>
              <input
                type="text"
                value={config.buildFormTitle}
                onChange={(e) => updateConfig('buildFormTitle', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>
        </div>
      );
    }

    // 8. FAQ ITEM EDITOR
    if (
      selectedTarget.kind === 'faq' ||
      (selectedTarget.kind === 'part' &&
        selectedTarget.partId === 'faq-accordion-list')
    ) {
      const faqIdx =
        selectedTarget.kind === 'faq'
          ? Math.min(selectedTarget.faqIndex, faqs.length - 1)
          : 0;
      const faq = faqs[faqIdx] || faqs[0];

      return (
        <div className="space-y-3">
          {subTabHeader}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {faqs.map((f, idx) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    setSelectedTarget({ kind: 'faq', faqIndex: idx });
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-mono-numbers font-bold cursor-pointer transition-all ${
                    idx === faqIdx
                      ? 'bg-emerald-500 text-[#111111]'
                      : 'bg-white/10 text-neutral-300 hover:bg-white/20'
                  }`}
                >
                  Q{idx + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  addFaq();
                  setSelectedTarget({ kind: 'faq', faqIndex: faqs.length });
                }}
                className="px-2.5 py-1 rounded-full bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-[#111111] text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Add FAQ
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  soundFx.playPop();
                  duplicateFaq(faqIdx);
                }}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
              >
                <Copy className="h-3 w-3" /> Clone
              </button>
              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playTick();
                    deleteFaq(faqIdx);
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white text-[10px] font-mono-numbers font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="h-3 w-3" /> Delete Q{faqIdx + 1}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Question
              </span>
              <input
                type="text"
                value={faq.q}
                onChange={(e) => updateFaq(faqIdx, { q: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Answer
              </span>
              <input
                type="text"
                value={faq.a}
                onChange={(e) => updateFaq(faqIdx, { a: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Highlight Pill
              </span>
              <input
                type="text"
                value={faq.highlight || ''}
                onChange={(e) => updateFaq(faqIdx, { highlight: e.target.value })}
                className="mt-0.5 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-mono-numbers font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>
        </div>
      );
    }

    // 9. FAQ HEADER OR GUARANTEE BANNER PART
    if (
      selectedTarget.kind === 'part' &&
      (selectedTarget.partId === 'faq-header' ||
        selectedTarget.partId === 'faq-guarantee-banner')
    ) {
      return (
        <div>
          {subTabHeader}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                FAQ Text Header
              </span>
              <input
                type="text"
                value={config.faqTitle || 'FAQ'}
                onChange={(e) => updateConfig('faqTitle', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                FAQ Secondary Headline
              </span>
              <input
                type="text"
                value={config.faqHeadline}
                onChange={(e) => updateConfig('faqHeadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                FAQ Subheadline
              </span>
              <input
                type="text"
                value={config.faqSubheadline}
                onChange={(e) => updateConfig('faqSubheadline', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono-numbers focus:outline-none focus:border-emerald-400"
              />
            </label>
            <label className="block">
              <span className="text-[9px] font-mono-numbers uppercase text-neutral-400">
                Guarantee Banner Title
              </span>
              <input
                type="text"
                value={config.faqGuaranteeTitle}
                onChange={(e) => updateConfig('faqGuaranteeTitle', e.target.value)}
                className="mt-1 w-full bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
              />
            </label>
          </div>
        </div>
      );
    }

    return (
      <div>
        {subTabHeader}
        {renderInteractionsEditor()}
      </div>
    );
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {lastSavedMessage && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-16 right-4 z-50 pointer-events-auto px-3.5 py-1.5 rounded-full bg-[#111111] text-white border border-emerald-500/40 shadow-lg flex items-center gap-2 text-[11px] font-mono-numbers font-bold"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>{lastSavedMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATE 1: Completely Hidden Bar (Hover bottom-right corner or press ⌘E to restore) */}
      {!isBarVisible && (
        <div className="fixed bottom-3 right-3 z-50 group">
          <button
            type="button"
            onClick={() => showPreviewBar()}
            className="px-3 py-1.5 rounded-full bg-[#111111]/85 hover:bg-[#111111] text-white border border-white/15 shadow-lg text-[10px] font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-1.5 opacity-35 hover:opacity-100 transition-opacity cursor-pointer"
            title="Show Builder (Command-E)"
          >
            <Eye className="h-3 w-3 text-emerald-400" />
            <span>Builder</span>
          </button>
        </div>
      )}

      {/* STATE 2: Builder OFF — Compact Corner Toggle (Never blocks Header or Runway view) */}
      {isBarVisible && !isBuilderMode && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-1.5 p-1 rounded-full bg-[#111111]/95 backdrop-blur-md border border-white/15 text-white shadow-xl">
          <button
            type="button"
            onClick={() => {
              soundFx.playPop();
              setIsBuilderMode(true);
            }}
            className="px-3 py-1 rounded-full bg-white/10 hover:bg-emerald-500 text-white hover:text-[#111111] text-[10px] font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all"
            title="Turn Builder Mode ON to edit sections & components"
          >
            <span className="h-2 w-2 rounded-full bg-neutral-400" />
            <span>Builder: Off</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white/15 text-[9px]">
              Turn On
            </span>
          </button>

          {canUndo && (
            <button
              type="button"
              onClick={() => undo()}
              className="p-1.5 rounded-full text-neutral-300 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
              title="Undo last change (⌘Z)"
            >
              <Undo2 className="h-3.5 w-3.5 text-emerald-400" />
            </button>
          )}

          <button
            type="button"
            onClick={() => hidePreviewBar()}
            className="p-1.5 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            title="Hide builder button completely (⌘E)"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* STATE 3: Builder ON — Streamlined Bottom Studio Bar */}
      {isBarVisible && isBuilderMode && (
        <div className="fixed bottom-0 inset-x-0 z-50 pointer-events-none">
          <div className="pointer-events-auto mx-auto max-w-5xl px-3 sm:px-6 pb-2.5">
            <div className="rounded-2xl bg-[#111111]/95 backdrop-blur-xl border border-white/15 text-white shadow-2xl overflow-hidden">
              {/* Compact Single-Row Control Bar */}
              <div className="px-3 py-1.5 flex flex-wrap items-center justify-between gap-2">
                {/* Left: Builder ON/OFF Switch, Undo/Redo, Save Version & Active Selection */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Builder ON/OFF Switch Button */}
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playPop();
                      setIsInspectorOpen(false);
                      setIsBuilderMode(false);
                    }}
                    className="pl-2.5 pr-2 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all"
                    title="Click to turn Builder OFF so it doesn't block the view"
                  >
                    <span className="h-2 w-2 rounded-full bg-[#111111]" />
                    <span>Builder: On</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-black/15 text-[9px]">
                      Turn Off
                    </span>
                  </button>

                  {/* Undo / Redo (⌘Z) */}
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-0.5">
                    <button
                      type="button"
                      disabled={!canUndo}
                      onClick={() => undo()}
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold flex items-center gap-1 text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      title="Undo last change (Command-Z)"
                    >
                      <Undo2 className="h-3 w-3 text-emerald-400" />
                      <span className="hidden sm:inline">Undo</span>
                      <kbd className="px-1 bg-white/10 rounded text-[9px] text-neutral-300">
                        ⌘Z
                      </kbd>
                    </button>

                    <button
                      type="button"
                      disabled={!canRedo}
                      onClick={() => redo()}
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-mono-numbers font-bold flex items-center text-neutral-300 hover:text-white hover:bg-white/15 disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
                      title="Redo change (Shift+Command+Z)"
                    >
                      <Redo2 className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Active Selection Pill + Quick Actions */}
                  <div className="flex items-center gap-1 pl-1 border-l border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        soundFx.playTick();
                        setViewMode('inspector');
                        setIsInspectorOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-[10px] font-mono-numbers font-bold text-white flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <MousePointerClick className="h-3 w-3 text-emerald-400 shrink-0" />
                      <span className="truncate max-w-[140px] sm:max-w-[190px]">
                        {getSelectionTitle()}
                      </span>
                    </button>

                    {selectedTarget && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            soundFx.playPop();
                            setViewMode('inspector');
                            setIsInspectorOpen(true);
                          }}
                          className="px-2 py-1 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors"
                          title="Edit selected component"
                        >
                          <Pencil className="h-2.5 w-2.5" />
                          <span>Edit</span>
                        </button>

                        {canCloneTarget && (
                          <button
                            type="button"
                            onClick={handleCloneCurrentTarget}
                            className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                            title="Duplicate selected component"
                          >
                            <Copy className="h-3 w-3" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={handleDeleteCurrentTarget}
                          className="p-1 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white cursor-pointer transition-colors"
                          title="Delete selected component (⌘Z to undo)"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Streamlined Mode Tabs & Bar Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setViewMode('inspector');
                      setIsInspectorOpen(true);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase cursor-pointer transition-colors ${
                      isInspectorOpen && viewMode === 'inspector'
                        ? 'bg-white text-[#111111]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    Inspector
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setViewMode('interactions');
                      setIsInspectorOpen(true);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                      isInspectorOpen && viewMode === 'interactions'
                        ? 'bg-emerald-500 text-[#111111]'
                        : 'bg-white/5 text-emerald-300 hover:bg-white/10'
                    }`}
                  >
                    <Zap className="h-3 w-3" />
                    <span className="hidden sm:inline">Motion</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setViewMode('parts');
                      setIsInspectorOpen(true);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase cursor-pointer transition-colors ${
                      isInspectorOpen && viewMode === 'parts'
                        ? 'bg-white text-[#111111]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    Parts
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setViewMode('versions');
                      setIsInspectorOpen(true);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                      isInspectorOpen && viewMode === 'versions'
                        ? 'bg-white text-[#111111]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    <History className="h-3 w-3" />
                    <span className="hidden md:inline">Versions</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setViewMode('drag');
                      setIsInspectorOpen(true);
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono-numbers font-bold uppercase cursor-pointer transition-colors ${
                      isInspectorOpen && viewMode === 'drag'
                        ? 'bg-white text-[#111111]'
                        : 'bg-white/5 text-neutral-300 hover:bg-white/10'
                    }`}
                  >
                    Palette
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      resetAllToDefaults();
                    }}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
                    title="Reset all changes to defaults"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      setIsInspectorOpen(!isInspectorOpen);
                    }}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                    title={isInspectorOpen ? 'Collapse editor drawer' : 'Expand editor drawer'}
                  >
                    {isInspectorOpen ? (
                      <ChevronDown className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronUp className="h-3.5 w-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => hidePreviewBar()}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white cursor-pointer"
                    title="Hide builder bar completely (⌘E)"
                  >
                    <EyeOff className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Expandable Drawer Content (Capped height so it never blocks header view) */}
              <AnimatePresence initial={false}>
                {isInspectorOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10 px-4 py-3 bg-black/40 max-h-[38vh] overflow-y-auto"
                  >
                {/* MODE 1: FOCUSED PART INSPECTOR */}
                {viewMode === 'inspector' && renderFocusedEditor()}

                {/* MODE 2: INTERACTIONS & MOTION STUDIO */}
                {viewMode === 'interactions' && renderInteractionsEditor()}

                {/* MODE 3: 12-PART BREAKDOWN BY SECTION WITH FILTER */}
                {viewMode === 'parts' && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Filter sections or parts..."
                          value={partSearchQuery}
                          onChange={(e) => setPartSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1 bg-black/50 border border-white/15 rounded-lg text-xs font-mono-numbers text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400"
                        />
                      </div>
                      <span className="text-[10px] font-mono-numbers text-neutral-400">
                        Click any part to jump & edit · Use arrows to reorder · Click Trash
                        to delete/restore
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {sectionOrder.map((secId, secIdx) => {
                        const meta = SECTION_META[secId];
                        const parts = (sectionParts[secId] || []).filter((pId) => {
                          if (!partSearchQuery.trim()) return true;
                          const q = partSearchQuery.toLowerCase();
                          const def = PART_DEFINITIONS[pId];
                          return (
                            pId.toLowerCase().includes(q) ||
                            def?.label.toLowerCase().includes(q) ||
                            meta.label.toLowerCase().includes(q)
                          );
                        });
                        const isSecHidden = hiddenSections.includes(secId);

                        return (
                          <div
                            key={secId}
                            className={`rounded-xl border p-2.5 transition-all ${
                              activeSection === secId
                                ? 'border-emerald-500/50 bg-white/[0.06]'
                                : 'border-white/10 bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 pb-2 mb-2 border-b border-white/10">
                              <span className="text-[11px] font-mono-numbers font-bold text-white">
                                {meta.code}. {meta.label}
                              </span>
                              <div className="flex items-center gap-0.5">
                                <button
                                  type="button"
                                  disabled={secIdx === 0}
                                  onClick={() => moveSection(secIdx, secIdx - 1)}
                                  className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-25 cursor-pointer"
                                  title="Move section up"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={secIdx === sectionOrder.length - 1}
                                  onClick={() => moveSection(secIdx, secIdx + 1)}
                                  className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-25 cursor-pointer"
                                  title="Move section down"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => toggleSectionVisibility(secId)}
                                  className="p-0.5 text-neutral-400 hover:text-emerald-400 cursor-pointer"
                                  title={
                                    isSecHidden ? 'Restore section' : 'Delete section'
                                  }
                                >
                                  {isSecHidden ? (
                                    <EyeOff className="h-3 w-3 text-rose-400" />
                                  ) : (
                                    <Eye className="h-3 w-3 text-emerald-400" />
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1">
                              {parts.map((partId, pIdx) => {
                                const pDef = PART_DEFINITIONS[partId];
                                const isHidden = hiddenParts.includes(partId);
                                const isSelected =
                                  selectedTarget?.kind === 'part' &&
                                  selectedTarget.partId === partId;

                                return (
                                  <div
                                    key={partId}
                                    className={`flex items-center justify-between gap-1 px-2 py-1 rounded-lg text-[10px] font-mono-numbers transition-all ${
                                      isSelected
                                        ? 'bg-emerald-500 text-[#111111] font-bold'
                                        : isHidden
                                        ? 'bg-white/5 text-neutral-500 line-through'
                                        : 'bg-black/40 text-neutral-200 hover:bg-white/10'
                                    }`}
                                  >
                                    <button
                                      type="button"
                                      onClick={() => jumpToPart(secId, partId)}
                                      className="truncate text-left flex-1 cursor-pointer"
                                    >
                                      {pIdx + 1}. {pDef?.label || partId}
                                    </button>
                                    <div className="flex items-center gap-0.5 shrink-0">
                                      <button
                                        type="button"
                                        disabled={pIdx === 0}
                                        onClick={() =>
                                          movePartInSection(secId, pIdx, pIdx - 1)
                                        }
                                        className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
                                        title="Move part up"
                                      >
                                        <ArrowUp className="h-2.5 w-2.5" />
                                      </button>
                                      <button
                                        type="button"
                                        disabled={pIdx === parts.length - 1}
                                        onClick={() =>
                                          movePartInSection(secId, pIdx, pIdx + 1)
                                        }
                                        className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
                                        title="Move part down"
                                      >
                                        <ArrowDown className="h-2.5 w-2.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => togglePartVisibility(partId)}
                                        className="p-0.5 hover:text-rose-400 cursor-pointer"
                                        title={isHidden ? 'Restore part' : 'Delete part'}
                                      >
                                        {isHidden ? (
                                          <EyeOff className="h-2.5 w-2.5 text-rose-400" />
                                        ) : (
                                          <Trash2 className="h-2.5 w-2.5 opacity-80" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MODE 4: SAVED VERSIONS (⌘S) & COMMAND-Z TIMELINE */}
                {viewMode === 'versions' && (
                  <div className="space-y-3">
                    {/* Save New Version Checkpoint Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          saveCurrentVersion(versionNameInput);
                          setVersionNameInput('');
                        }}
                        className="flex items-center gap-2 flex-1 max-w-md"
                      >
                        <input
                          type="text"
                          placeholder="Name this version (e.g., Launch Layout V1)..."
                          value={versionNameInput}
                          onChange={(e) => setVersionNameInput(e.target.value)}
                          className="flex-1 bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs font-mono-numbers text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-400"
                        />
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                        >
                          <BookmarkCheck className="h-3.5 w-3.5" />
                          <span>Save This Version (⌘S)</span>
                        </button>
                      </form>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={exportCurrentVersionJson}
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                          title="Download current version as a .json backup file"
                        >
                          <Download className="h-3 w-3 text-emerald-400" />
                          <span>Export JSON</span>
                        </button>

                        <label
                          className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono-numbers font-bold uppercase flex items-center gap-1 cursor-pointer"
                          title="Import a previously exported .json version file"
                        >
                          <FileUp className="h-3 w-3 text-emerald-400" />
                          <span>Import JSON</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportJsonFile}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Saved Checkpoints List */}
                    <div>
                      <div className="text-[10px] font-mono-numbers uppercase text-emerald-400 font-bold mb-1.5 flex items-center justify-between">
                        <span>Saved Version Checkpoints ({savedVersions.length})</span>
                        <span className="text-neutral-400 font-normal">
                          Click any saved version to restore it immediately
                        </span>
                      </div>

                      {savedVersions.length === 0 ? (
                        <div className="py-3 px-4 text-xs font-mono-numbers text-neutral-400 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                          <span>
                            No saved checkpoints yet. Click{' '}
                            <strong className="text-white">Save Version (⌘S)</strong> to
                            lock in your current site version.
                          </span>
                          <button
                            type="button"
                            onClick={() => saveCurrentVersion('Saved Studio Version #1')}
                            className="px-3 py-1 rounded-lg bg-emerald-500 text-[#111111] text-[10px] font-bold uppercase cursor-pointer shrink-0"
                          >
                            Save Current Version Now
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                          {savedVersions.map((ver, idx) => (
                            <div
                              key={ver.id}
                              className={`px-3 py-2 rounded-xl border flex items-center gap-3 shrink-0 transition-all ${
                                idx === 0
                                  ? 'bg-emerald-500/15 border-emerald-500/50'
                                  : 'bg-white/5 border-white/10 hover:border-white/25'
                              }`}
                            >
                              <div>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono-numbers font-bold text-white">
                                  <BookmarkCheck className="h-3.5 w-3.5 text-emerald-400" />
                                  <span>{ver.name}</span>
                                  {idx === 0 && (
                                    <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-[#111111] text-[8px] uppercase font-black">
                                      Latest
                                    </span>
                                  )}
                                </div>
                                <div className="text-[9px] font-mono-numbers text-neutral-400 mt-0.5">
                                  Saved {ver.savedAt}
                                </div>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => restoreSavedVersion(ver.id)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase cursor-pointer"
                                >
                                  Restore
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteSavedVersion(ver.id)}
                                  className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-300 cursor-pointer"
                                  title="Delete saved version"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Automatic Undo History Timeline (⌘Z) */}
                    {historyPast.length > 0 && (
                      <div className="pt-2 border-t border-white/10">
                        <div className="text-[10px] font-mono-numbers uppercase text-neutral-400 font-bold mb-1.5">
                          Recent Edit History (⌘Z Undo Stack · {historyPast.length} steps)
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                          {[...historyPast].reverse().map((snap, revIdx) => {
                            const originalIdx = historyPast.length - 1 - revIdx;
                            return (
                              <button
                                key={snap.id}
                                type="button"
                                onClick={() => revertToSnapshot(originalIdx)}
                                className="px-2.5 py-1 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-left shrink-0 cursor-pointer transition-all"
                              >
                                <div className="text-[10px] font-mono-numbers font-bold text-neutral-200 flex items-center gap-1">
                                  <Undo2 className="h-2.5 w-2.5 text-emerald-400" />
                                  <span>{snap.label}</span>
                                </div>
                                <div className="text-[8px] font-mono-numbers text-neutral-500">
                                  {snap.timestamp}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* MODE 5: DRAG-AND-DROP APPS & EMPLOYEES PALETTE */}
                {viewMode === 'drag' && (
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-mono-numbers uppercase text-neutral-400 mr-1">
                        Drag Apps to Stages/Workshops:
                      </span>
                      {SOFTWARE_APPLICATIONS.map((app) => (
                        <div
                          key={app.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'copy';
                            setDraggedItem({ type: 'app', appId: app.id });
                          }}
                          onDragEnd={() => setDraggedItem(null)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-[10px] font-mono-numbers font-bold"
                        >
                          <GripVertical className="h-2.5 w-2.5 text-neutral-400" />
                          <PlatformLogo platform={app.id} size={13} />
                          <span>{app.name}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/10">
                      <span className="text-[10px] font-mono-numbers uppercase text-neutral-400 mr-1">
                        Drag Employees to Stages:
                      </span>
                      {candidates.map((emp, idx) => (
                        <div
                          key={emp.id}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'copyMove';
                            setDraggedItem({
                              type: 'employee',
                              candidateId: emp.id,
                              fromIndex: idx,
                            });
                          }}
                          onDragEnd={() => setDraggedItem(null)}
                          onClick={() => {
                            setSelectedTarget({
                              kind: 'employee',
                              candidateId: emp.id,
                              index: idx,
                            });
                            setViewMode('inspector');
                          }}
                          className="pl-1.5 pr-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-1.5 cursor-grab active:cursor-grabbing text-[10px] font-mono-numbers font-bold"
                        >
                          <img
                            src={emp.imageSrc}
                            alt={emp.name}
                            className="h-4 w-4 rounded-full object-cover object-top bg-white"
                          />
                          <span>{emp.role.replace(' Manager', '')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
