import React, { useState } from 'react';
import {
  Sparkles,
  Play,
  RotateCcw,
  ArrowRight,
  Check,
  Plus,
  FileText,
  Zap,
  GripVertical,
  X,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Candidate } from '../data/talent';
import { PlatformLogo, SOFTWARE_APPLICATIONS } from './PlatformLogo';
import { FloatingEmployeeSprite } from './FloatingEmployeeSprite';
import { SectionBuilderBar } from './SectionBuilderBar';
import { SectionPartWrapper } from './SectionPartWrapper';
import { EditableText } from './EditableText';
import { PartId, useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface WorkflowExperienceProps {
  shortlist: Candidate[];
  onToggleShortlist: (candidate: Candidate) => void;
  onOpenDossier: (candidate: Candidate) => void;
  onOpenShortlistModal: () => void;
  currency: 'EUR' | 'USD' | 'GBP';
  sectionIndex?: number;
  totalSections?: number;
}

export const WorkflowExperience: React.FC<WorkflowExperienceProps> = ({
  shortlist,
  onToggleShortlist,
  onOpenDossier,
  onOpenShortlistModal,
  sectionIndex = 1,
  totalSections = 4,
}) => {
  const {
    isBuilderMode,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    setActiveSection,
    candidates,
    config,
    updateConfig,
    sectionParts,
    hiddenParts,
    workflowStages,
    updateWorkflowStage,
    deleteWorkflowStage,
    reorderWorkflowStages,
    dropAppOnStage,
    removeAppFromStage,
    dropEmployeeOnStage,
    draggedItem,
    setDraggedItem,
  } = useStudioBuilder();

  const [activeStageIdx, setActiveStageIdx] = useState<number>(0);
  const [isExecuted, setIsExecuted] = useState<boolean>(false);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [dragOverStageIdx, setDragOverStageIdx] = useState<number | null>(null);
  const [openAppPickerStageIdx, setOpenAppPickerStageIdx] = useState<number | null>(null);

  const isShortlisted = (id: string) => shortlist.some((item) => item.id === id);

  const effectiveStageIdx =
    selectedTarget?.kind === 'stage' &&
    selectedTarget.stageIndex >= 0 &&
    selectedTarget.stageIndex < workflowStages.length
      ? selectedTarget.stageIndex
      : Math.min(activeStageIdx, Math.max(0, workflowStages.length - 1));

  const handleRunWorkflowSimulation = () => {
    soundFx.playHireChime();
    setIsExecuted(true);
    setCompletedStages(workflowStages.map((_, idx) => idx));

    const logs = [
      '[00:00.0] WORKPLAY STUDIO ENGINE: Initializing autonomous 6-employee application pipeline...',
      ...workflowStages.map((stage, idx) => {
        const candidate =
          candidates.find((c) => c.id === stage.candidateId) ||
          candidates[idx % candidates.length];
        return `[00:0${idx + 1}.0] ${stage.stageNumber} · ${candidate.role} (${candidate.name}): ${stage.action} → ${stage.outcome}`;
      }),
      '✓ WORKFLOW COMPLETE: All 6 Software Employees executed across 9 connected apps with 0 human handoffs ($704k/yr payroll saved).',
    ];
    setSimulationLogs(logs);
  };

  const handleResetSimulation = () => {
    soundFx.playTick();
    setIsExecuted(false);
    setCompletedStages([]);
    setSimulationLogs([]);
    setActiveStageIdx(0);
  };

  const activeStage = workflowStages[effectiveStageIdx] || workflowStages[0];
  const activeCandidate =
    candidates.find((c) => c.id === activeStage?.candidateId) || candidates[0];

  const totalSquadSalary = candidates.reduce((acc, c) => acc + c.annualSalaryUsd, 0);
  const totalTraditionalSalary = candidates.reduce(
    (acc, c) => acc + c.traditionalSalaryUsd,
    0
  );
  const totalSavings = totalTraditionalSalary - totalSquadSalary;

  const visibleParts = (sectionParts.workflow || []).filter(
    (partId) => !hiddenParts.includes(partId)
  );

  const renderPart = (partId: PartId, partIdx: number) => {
    if (partId === 'workflow-header') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workflow"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-neutral-100 via-emerald-50/60 to-neutral-100 border border-neutral-200/70 text-xs font-mono-numbers uppercase tracking-wider text-neutral-700 font-bold mb-3 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                <EditableText
                  value={config.workflowBadge}
                  onChange={(val) => updateConfig('workflowBadge', val)}
                  label="Workflow Badge"
                />
              </div>

              <EditableText
                as="h2"
                value={config.workflowHeadline}
                onChange={(val) => updateConfig('workflowHeadline', val)}
                className="font-brand text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#111111] leading-none block"
                label="Workflow Headline"
              />

              <div className="mt-3">
                <EditableText
                  as="p"
                  multiline
                  value={config.workflowSubheadline}
                  onChange={(val) => updateConfig('workflowSubheadline', val)}
                  className="text-sm sm:text-base text-neutral-600 font-mono-numbers"
                  label="Workflow Subheadline"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start lg:self-end">
              {simulationLogs.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetSimulation();
                  }}
                  className="px-4 py-2.5 rounded-full border border-neutral-200 hover:border-black text-xs font-mono-numbers font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRunWorkflowSimulation();
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#111111] to-neutral-800 text-white hover:from-neutral-800 hover:to-neutral-900 text-xs font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer shadow-sm border border-neutral-700"
              >
                {isExecuted ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Workflow Executed</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-emerald-400 text-emerald-400" />
                    <span>Execute Full App Workflow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'workflow-stages-grid') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workflow"
          partIndex={partIdx}
          totalParts={visibleParts.length}
          className="mb-10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {workflowStages.map((stage, index) => {
              const candidate =
                candidates.find((c) => c.id === stage.candidateId) ||
                candidates[index % candidates.length];
              const isSelected = effectiveStageIdx === index;
              const isBuilderStageSelected =
                isBuilderMode &&
                selectedTarget?.kind === 'stage' &&
                selectedTarget.stageIndex === index;
              const isCompleted = completedStages.includes(index);
              const drafted = isShortlisted(candidate.id);
              const isDragOver = dragOverStageIdx === index;

              return (
                <div
                  key={stage.id}
                  draggable={isBuilderMode}
                  onDragStart={(e) => {
                    if (!isBuilderMode) return;
                    e.stopPropagation();
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedItem({ type: 'stage', stageIndex: index });
                  }}
                  onDragEnd={() => {
                    setDraggedItem(null);
                    setDragOverStageIdx(null);
                  }}
                  onDragOver={(e) => {
                    if (!isBuilderMode) return;
                    if (
                      draggedItem?.type === 'app' ||
                      draggedItem?.type === 'employee' ||
                      (draggedItem?.type === 'stage' && draggedItem.stageIndex !== index)
                    ) {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragOverStageIdx(index);
                    }
                  }}
                  onDragLeave={() => setDragOverStageIdx(null)}
                  onDrop={(e) => {
                    if (!isBuilderMode) return;
                    e.preventDefault();
                    e.stopPropagation();
                    setDragOverStageIdx(null);

                    if (draggedItem?.type === 'app') {
                      soundFx.playPop();
                      dropAppOnStage(index, draggedItem.appId);
                    } else if (draggedItem?.type === 'employee') {
                      soundFx.playPop();
                      dropEmployeeOnStage(index, draggedItem.candidateId);
                    } else if (
                      draggedItem?.type === 'stage' &&
                      draggedItem.stageIndex !== index
                    ) {
                      soundFx.playPop();
                      reorderWorkflowStages(draggedItem.stageIndex, index);
                      setActiveStageIdx(index);
                    }
                    setDraggedItem(null);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    soundFx.playTick();
                    setActiveStageIdx(index);
                    if (isBuilderMode) {
                      setActiveSection('workflow');
                      setSelectedTarget({ kind: 'stage', stageIndex: index });
                    }
                  }}
                  className={`group/stage rounded-3xl border p-4 flex flex-col justify-between cursor-pointer transition-all relative ${
                    isDragOver
                      ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-500 scale-[1.02] shadow-lg'
                      : isBuilderStageSelected
                      ? 'border-emerald-500 bg-white ring-2 ring-emerald-500 shadow-md'
                      : isSelected
                      ? 'border-[#111111] bg-gradient-to-b from-white to-neutral-50 ring-2 ring-[#111111]/15 shadow-md'
                      : isCompleted
                      ? 'border-emerald-500/60 bg-gradient-to-b from-white to-emerald-50/20'
                      : 'border-neutral-200 bg-white hover:border-neutral-400'
                  }`}
                >
                  {/* Floating Edit & Delete Buttons on Each Stage Card Component */}
                  {isBuilderMode && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute -top-3 right-3 z-30 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111111] text-white text-[9px] font-mono-numbers font-bold uppercase shadow-md border border-white/15 transition-opacity ${
                        isBuilderStageSelected
                          ? 'opacity-100'
                          : 'opacity-0 group-hover/stage:opacity-100 pointer-events-none group-hover/stage:pointer-events-auto'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          soundFx.playPop();
                          selectAndEditTarget({ kind: 'stage', stageIndex: index });
                        }}
                        className="px-1.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] flex items-center gap-0.5 cursor-pointer"
                        title="Edit this stage component"
                      >
                        <Pencil className="h-2.5 w-2.5" />
                        <span>Edit</span>
                      </button>

                      {workflowStages.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            soundFx.playTick();
                            deleteWorkflowStage(index);
                          }}
                          className="px-1.5 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center gap-0.5 cursor-pointer"
                          title="Delete this stage component"
                        >
                          <Trash2 className="h-2.5 w-2.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  )}

                  <div>
                    {/* Stage Pill & Capacity */}
                    <div className="flex items-center justify-between text-[10px] font-mono-numbers font-bold pb-2.5 border-b border-neutral-100">
                      <div className="flex items-center gap-1">
                        {isBuilderMode && (
                          <span title="Drag to reorder stage" className="flex items-center">
                            <GripVertical className="h-3.5 w-3.5 text-neutral-400 cursor-grab" />
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-[#111111] text-white'
                              : isCompleted
                              ? 'bg-emerald-500 text-white'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {stage.stageNumber}
                        </span>
                      </div>
                      <span className="text-emerald-600 font-bold">
                        {candidate.capacityMultiplier}
                      </span>
                    </div>

                    {/* Employee Floating Cutout & Role */}
                    <div className="mt-3 flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-neutral-50 border border-neutral-200 shrink-0 flex items-end justify-center">
                        <FloatingEmployeeSprite
                          src={candidate.imageSrc}
                          alt={candidate.name}
                          className="h-full w-full object-contain object-bottom"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-brand text-xs font-black uppercase text-[#111111] leading-tight truncate">
                          {candidate.role}
                        </h3>
                        <p className="text-[10px] font-mono-numbers text-neutral-500 truncate mt-0.5">
                          {candidate.name}
                        </p>
                        <div className="flex items-center gap-1 text-[10px] font-mono-numbers mt-0.5">
                          <span className="font-bold text-[#111111]">
                            ${Math.round(candidate.annualSalaryUsd / 1000)}k/yr
                          </span>
                          <span className="line-through text-neutral-400 text-[9px]">
                            ${Math.round(candidate.traditionalSalaryUsd / 1000)}k
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Connected Apps Row */}
                    <div className="mt-3 pt-2.5 border-t border-neutral-100">
                      <div className="flex items-center justify-between text-[9px] font-mono-numbers uppercase tracking-wider text-neutral-400 font-bold mb-1.5">
                        <span>Apps Operated</span>
                        {isBuilderMode && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              soundFx.playTick();
                              setOpenAppPickerStageIdx(
                                openAppPickerStageIdx === index ? null : index
                              );
                            }}
                            className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer"
                          >
                            {openAppPickerStageIdx === index ? 'Done' : '+ App'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {stage.apps.map((appId) => (
                          <div key={appId} className="relative group/app">
                            <span
                              className="h-6 w-6 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-2xs"
                              title={appId}
                            >
                              <PlatformLogo platform={appId} size={13} />
                            </span>
                            {isBuilderMode && stage.apps.length > 1 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  soundFx.playTick();
                                  removeAppFromStage(index, appId);
                                }}
                                className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#111111] text-white flex items-center justify-center opacity-0 group-hover/app:opacity-100 transition-opacity cursor-pointer"
                                title={`Remove ${appId}`}
                              >
                                <X className="h-2 w-2" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {isBuilderMode && openAppPickerStageIdx === index && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 p-2 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-wrap gap-1"
                        >
                          {SOFTWARE_APPLICATIONS.map((app) => {
                            const hasApp = stage.apps.includes(app.id);
                            return (
                              <button
                                key={app.id}
                                type="button"
                                onClick={() => {
                                  soundFx.playTick();
                                  if (hasApp && stage.apps.length > 1) {
                                    removeAppFromStage(index, app.id);
                                  } else if (!hasApp) {
                                    dropAppOnStage(index, app.id);
                                  }
                                }}
                                className={`p-1 rounded-lg border flex items-center gap-1 text-[9px] font-mono-numbers font-bold cursor-pointer ${
                                  hasApp
                                    ? 'bg-[#111111] text-white border-[#111111]'
                                    : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'
                                }`}
                              >
                                <PlatformLogo platform={app.id} size={11} />
                                <span>{app.name.split(' ')[0]}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 text-[11px] text-neutral-600 leading-relaxed">
                      <EditableText
                        as="p"
                        multiline
                        value={stage.action}
                        onChange={(val) => updateWorkflowStage(index, { action: val })}
                        className="line-clamp-3"
                        label="Stage Action"
                      />
                    </div>
                  </div>

                  {/* Card Footer: Resume & Hire Buttons */}
                  <div className="mt-4 pt-2.5 border-t border-neutral-100 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        soundFx.playPop();
                        onOpenDossier(candidate);
                      }}
                      className="flex-1 py-1.5 px-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <FileText className="h-3 w-3" />
                      <span>Resume</span>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!drafted) {
                          soundFx.playHireChime();
                        } else {
                          soundFx.playTick();
                        }
                        onToggleShortlist(candidate);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-full text-[10px] font-mono-numbers font-bold uppercase flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        drafted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-[#111111] text-white hover:bg-neutral-800'
                      }`}
                    >
                      {drafted ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Hired</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3 w-3" />
                          <span>Hire</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionPartWrapper>
      );
    }

    if (partId === 'workflow-roi-console') {
      return (
        <SectionPartWrapper
          key={partId}
          partId={partId}
          sectionId="workflow"
          partIndex={partIdx}
          totalParts={visibleParts.length}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left 7 cols: Active Stage Deep-Dive & Live Execution Log */}
            <SectionPartWrapper
              partId="workflow-playbook-card"
              sectionId="workflow"
              className="lg:col-span-7 flex"
            >
              <div className="w-full rounded-3xl border border-neutral-200 bg-gradient-to-br from-white via-[#FAFAFA] to-neutral-50 p-6 sm:p-8 flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#111111] text-white text-[10px] font-mono-numbers font-bold uppercase tracking-wider">
                        {activeStage?.stageNumber} · LIVE APP PLAYBOOK
                      </span>
                      <span className="font-brand text-sm font-black uppercase text-[#111111]">
                        {activeCandidate.role} ({activeCandidate.name})
                      </span>
                    </div>
                    <span className="text-xs font-mono-numbers font-bold text-emerald-600 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5" />
                      <EditableText
                        value={activeStage?.outcome || ''}
                        onChange={(val) =>
                          updateWorkflowStage(effectiveStageIdx, { outcome: val })
                        }
                        label="Stage Outcome"
                      />
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                      <div className="text-[10px] font-mono-numbers uppercase tracking-wider text-neutral-400 font-bold">
                        App Trigger Event
                      </div>
                      <div className="mt-1 text-xs sm:text-sm font-bold text-[#111111]">
                        <EditableText
                          value={activeStage?.trigger || ''}
                          onChange={(val) =>
                            updateWorkflowStage(effectiveStageIdx, { trigger: val })
                          }
                          label="App Trigger Event"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-2xs">
                      <div className="text-[10px] font-mono-numbers uppercase tracking-wider text-neutral-400 font-bold">
                        Autonomous Cross-App Execution
                      </div>
                      <div className="mt-1 text-xs sm:text-sm text-neutral-700 leading-snug">
                        <EditableText
                          multiline
                          value={activeStage?.action || ''}
                          onChange={(val) =>
                            updateWorkflowStage(effectiveStageIdx, { action: val })
                          }
                          label="Cross-App Execution"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Connected App Pipeline Badges */}
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {(activeStage?.apps || []).map((appId, idx) => (
                      <React.Fragment key={appId}>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs">
                          <PlatformLogo platform={appId} size={16} />
                          <span className="text-xs font-mono-numbers font-bold capitalize text-[#111111]">
                            {appId.replace('-', ' ')}
                          </span>
                        </div>
                        {idx < (activeStage?.apps.length || 0) - 1 && (
                          <ArrowRight className="h-3.5 w-3.5 text-neutral-400" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Live Execution Terminal Output */}
                {simulationLogs.length > 0 && (
                  <div className="mt-6 rounded-2xl bg-gradient-to-b from-[#111111] to-[#0c0c0c] border border-neutral-800 text-white p-4 font-mono-numbers text-[11px] space-y-1.5 max-h-44 overflow-y-auto">
                    {simulationLogs.map((log, i) => (
                      <div
                        key={i}
                        className={
                          log.startsWith('✓')
                            ? 'text-emerald-400 font-bold pt-1 border-t border-neutral-800'
                            : 'text-neutral-300'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </SectionPartWrapper>

            {/* Right 5 cols: Total Software Squad Capacity & Payroll Savings Summary */}
            <SectionPartWrapper
              partId="workflow-roi-card"
              sectionId="workflow"
              className="lg:col-span-5 flex"
            >
              <div className="w-full rounded-3xl bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0c0c0c] border border-neutral-800 text-white p-6 sm:p-8 flex flex-col justify-between shadow-xl">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                    <EditableText
                      value={config.workflowRoiTitle}
                      onChange={(val) => updateConfig('workflowRoiTitle', val)}
                      className="font-brand text-base font-black uppercase tracking-tight"
                      label="ROI Card Title"
                    />
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-numbers font-bold shadow-xs">
                      <EditableText
                        value={config.workflowRoiBadge}
                        onChange={(val) => updateConfig('workflowRoiBadge', val)}
                        label="ROI Badge"
                      />
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 font-mono-numbers text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Traditional 6-Manager Payroll:</span>
                      <span className="line-through">
                        ${totalTraditionalSalary.toLocaleString()} / yr
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-white text-sm font-bold">
                      <span>6 Software Employees Payroll:</span>
                      <span className="text-emerald-400">
                        ${totalSquadSalary.toLocaleString()} / yr
                      </span>
                    </div>

                    <div className="pt-3 mt-2 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-emerald-950/20 p-3.5 rounded-2xl border border-emerald-500/25 flex items-center justify-between text-sm font-bold">
                      <span className="text-emerald-300">Annual Net Salary Saved:</span>
                      <span className="text-emerald-400 text-base">
                        ${totalSavings.toLocaleString()} / yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playPop();
                      onOpenDossier(activeCandidate);
                    }}
                    className="w-full sm:w-auto flex-1 py-3 px-4 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-mono-numbers font-bold uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Inspect {activeCandidate.role.split(' ')[0]} Resume
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      soundFx.playPop();
                      onOpenShortlistModal();
                    }}
                    className="w-full sm:w-auto flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-[#111111] text-xs font-mono-numbers font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <span>Open Hiring Squad ({shortlist.length})</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </SectionPartWrapper>
          </div>
        </SectionPartWrapper>
      );
    }

    return null;
  };

  return (
    <section
      id="workflow"
      className="relative py-24 border-y border-neutral-200 bg-gradient-to-b from-white via-neutral-50/40 to-white overflow-hidden"
    >
      <div
        className="absolute top-0 inset-x-0 h-64 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(16,185,129,0.06),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <SectionBuilderBar
        sectionId="workflow"
        sectionIndex={sectionIndex}
        totalSections={totalSections}
        label="6-Stage Workflow"
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {visibleParts.map((partId, idx) => renderPart(partId, idx))}
      </div>
    </section>
  );
};
