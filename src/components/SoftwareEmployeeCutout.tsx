import React, { useRef, useState } from 'react';
import {
  FileText,
  Plus,
  GripVertical,
  Upload,
  ArrowLeft,
  ArrowRight,
  Pencil,
  Trash2,
  Copy,
} from 'lucide-react';
import { Candidate } from '../data/talent';
import { useStudioBuilder } from '../context/StudioBuilderContext';
import { EditableText } from './EditableText';
import { processSingleHeadshotFile } from '../utils/imageCutoutClient';
import { soundFx } from '../utils/sound';

interface SoftwareEmployeeCutoutProps {
  candidate: Candidate;
  index?: number;
  totalCount?: number;
  isHovered: boolean;
  isShortlisted: boolean;
  onHover: (candidate: Candidate | null) => void;
  onSelect: (candidate: Candidate) => void;
  onToggleShortlist: (candidate: Candidate) => void;
}

export const SoftwareEmployeeCutout: React.FC<SoftwareEmployeeCutoutProps> = ({
  candidate,
  index = 0,
  totalCount = 6,
  isShortlisted,
  onHover,
  onSelect,
  onToggleShortlist,
}) => {
  const {
    isBuilderMode,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    setActiveSection,
    updateCandidate,
    deleteCandidate,
    duplicateCandidate,
    reorderCandidates,
    draggedItem,
    setDraggedItem,
  } = useStudioBuilder();

  const [isDragOverCard, setIsDragOverCard] = useState(false);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const isSelectedInBuilder =
    isBuilderMode &&
    selectedTarget?.kind === 'employee' &&
    selectedTarget.candidateId === candidate.id;

  const hasUploadedResume = Boolean(candidate.resumeUrl);

  const handlePhotoUpload = async (file: File) => {
    setIsProcessingPhoto(true);
    try {
      soundFx.playTick();
      const cutoutDataUrl = await processSingleHeadshotFile(file, true);
      updateCandidate(candidate.id, { imageSrc: cutoutDataUrl });
      soundFx.playHireChime();
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleResumeUpload = (file: File) => {
    setIsUploadingResume(true);
    soundFx.playTick();
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (result) {
        updateCandidate(candidate.id, {
          resumeUrl: result,
          resumeFileName: file.name,
          resumeMimeType: file.type || 'application/octet-stream',
        });
        soundFx.playHireChime();
      }
      setIsUploadingResume(false);
    };
    reader.onerror = () => {
      setIsUploadingResume(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      draggable={isBuilderMode}
      onDragStart={(e) => {
        if (!isBuilderMode) return;
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem({
          type: 'employee',
          candidateId: candidate.id,
          fromIndex: index,
        });
      }}
      onDragEnd={() => {
        setDraggedItem(null);
        setIsDragOverCard(false);
      }}
      onDragOver={(e) => {
        if (!isBuilderMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverCard(true);
      }}
      onDragLeave={() => setIsDragOverCard(false)}
      onDrop={async (e) => {
        if (!isBuilderMode) return;
        e.preventDefault();
        e.stopPropagation();
        setIsDragOverCard(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
          if (
            droppedFile.type === 'application/pdf' ||
            droppedFile.name.toLowerCase().endsWith('.pdf') ||
            droppedFile.name.toLowerCase().endsWith('.doc') ||
            droppedFile.name.toLowerCase().endsWith('.docx')
          ) {
            handleResumeUpload(droppedFile);
            return;
          }
          if (droppedFile.type.startsWith('image/')) {
            await handlePhotoUpload(droppedFile);
            return;
          }
        }

        if (
          draggedItem?.type === 'employee' &&
          draggedItem.fromIndex !== undefined &&
          draggedItem.fromIndex !== index
        ) {
          soundFx.playPop();
          reorderCandidates(draggedItem.fromIndex, index);
        }
        setDraggedItem(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        soundFx.playPop();
        if (isBuilderMode) {
          setActiveSection('lineup');
          setSelectedTarget({
            kind: 'employee',
            candidateId: candidate.id,
            index,
          });
        } else {
          onSelect(candidate);
        }
      }}
      onMouseEnter={() => {
        soundFx.playTick();
        onHover(candidate);
      }}
      onMouseLeave={() => onHover(null)}
      className={`w-full min-w-0 max-w-full relative flex flex-col items-center group cursor-pointer select-none rounded-2xl p-2 transition-colors duration-200 ${
        isDragOverCard
          ? 'ring-2 ring-emerald-500 bg-emerald-500/5'
          : isSelectedInBuilder
          ? 'ring-2 ring-emerald-500 bg-emerald-500/[0.03]'
          : isBuilderMode
          ? 'hover:ring-1 hover:ring-black/15'
          : ''
      }`}
    >
      {/* Hidden File Input for Resume Upload */}
      <input
        ref={resumeInputRef}
        type="file"
        accept=".pdf,image/*,.doc,.docx"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleResumeUpload(file);
          }
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Grounded Corporate Headshot Cutout (No Floating Animation, No Top Section, No Checkmarks) */}
      <div className="relative w-full h-[27vh] sm:h-[31vh] md:h-[35vh] max-h-[330px] min-h-[220px] mx-auto flex items-end justify-center border-b border-black/10 group-hover:border-[#111111]/40 transition-colors duration-200">
        <img
          src={candidate.imageSrc}
          alt={candidate.name}
          referrerPolicy="no-referrer"
          draggable={false}
          className="h-full w-full object-contain object-bottom select-none origin-bottom drop-shadow-[0_14px_20px_rgba(0,0,0,0.12)] group-hover:drop-shadow-[0_20px_28px_rgba(0,0,0,0.18)] group-hover:scale-[1.015] transition-all duration-200"
        />

        {/* Compact Builder Action Pill (Only shown when selected in Builder Mode, tucked at bottom of figure so it never blocks header view) */}
        {isBuilderMode && isSelectedInBuilder && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#111111]/95 text-white text-[9px] font-mono-numbers font-bold uppercase shadow-lg z-30 whitespace-nowrap border border-white/15"
          >
            <GripVertical className="h-2.5 w-2.5 text-neutral-400 cursor-grab" />
            <button
              type="button"
              disabled={index === 0}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playTick();
                reorderCandidates(index, index - 1);
              }}
              className="hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
              title="Move left"
            >
              <ArrowLeft className="h-2.5 w-2.5" />
            </button>
            <span className="text-neutral-300">#{index + 1}</span>
            <button
              type="button"
              disabled={index === totalCount - 1}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playTick();
                reorderCandidates(index, index + 1);
              }}
              className="hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
              title="Move right"
            >
              <ArrowRight className="h-2.5 w-2.5" />
            </button>

            <span className="text-white/25">|</span>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playPop();
                selectAndEditTarget({
                  kind: 'employee',
                  candidateId: candidate.id,
                  index,
                });
              }}
              className="px-1.5 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] flex items-center gap-0.5 cursor-pointer"
              title="Open employee inspector"
            >
              <Pencil className="h-2.5 w-2.5" />
              <span>Edit</span>
            </button>

            <label
              onClick={(e) => e.stopPropagation()}
              className="px-1.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center gap-0.5 cursor-pointer"
              title="Upload corporate headshot (auto-removes background)"
            >
              <Upload className="h-2.5 w-2.5 text-emerald-400" />
              <span>{isProcessingPhoto ? '...' : 'Photo'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file);
                  e.target.value = '';
                }}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resumeInputRef.current?.click();
              }}
              className="px-1.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center gap-0.5 cursor-pointer"
              title="Upload resume file for this employee"
            >
              <Upload className="h-2.5 w-2.5 text-emerald-400" />
              <span>{isUploadingResume ? '...' : 'Resume'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                duplicateCandidate(candidate.id);
              }}
              className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              title="Clone employee"
            >
              <Copy className="h-2.5 w-2.5" />
            </button>

            {totalCount > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundFx.playTick();
                  deleteCandidate(candidate.id);
                }}
                className="p-1 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white cursor-pointer"
                title="Delete employee"
              >
                <Trash2 className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Clean, Grounded Employee Identity, ROI Metrics & Functional Actions */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (isBuilderMode) {
            setActiveSection('lineup');
            setSelectedTarget({
              kind: 'employee',
              candidateId: candidate.id,
              index,
            });
          }
        }}
        className="w-full pt-3 flex flex-col items-center text-center"
      >
        {/* Role Title */}
        <EditableText
          as="span"
          value={candidate.role}
          onChange={(val) => updateCandidate(candidate.id, { role: val })}
          className="font-brand text-xs sm:text-sm font-black text-[#111111] uppercase tracking-tight leading-snug"
          label="Role Title"
        />

        {/* Candidate Name */}
        <div className="text-[11px] sm:text-xs font-mono-numbers text-neutral-700 mt-0.5 flex items-center justify-center gap-1 max-w-full truncate">
          <EditableText
            value={candidate.name}
            onChange={(val) => updateCandidate(candidate.id, { name: val })}
            className="font-semibold text-[#111111]"
            label="Employee Name"
          />
        </div>

        {/* Salary ($XX,XXX/yr) & Price ($X,XXX) — 90% Savings */}
        <div className="mt-1 flex flex-col items-center justify-center gap-0.5 text-[10px] sm:text-[11px] font-mono-numbers whitespace-nowrap">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-neutral-500">
              Salary:{' '}
              <span className="line-through text-neutral-400">
                ${candidate.traditionalSalaryUsd.toLocaleString()}/yr
              </span>
            </span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span className="font-bold text-emerald-700">
              Price: ${candidate.annualSalaryUsd.toLocaleString()}
            </span>
            <span className="text-emerald-700 font-bold text-[10px]">
              (-
              {Math.round(
                (1 -
                  candidate.annualSalaryUsd /
                    Math.max(1, candidate.traditionalSalaryUsd)) *
                  100
              )}
              %)
            </span>
          </div>
        </div>

        {/* Functional Action Buttons: Resume (View / Upload) + Hire */}
        <div className="mt-3 flex items-center justify-center gap-1.5 w-full">
          <div className="flex-1 max-w-[112px] flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playPop();
                onSelect(candidate);
              }}
              title={
                hasUploadedResume
                  ? `View uploaded resume (${candidate.resumeFileName || 'Resume'})`
                  : `View resume for ${candidate.name}`
              }
              className={`flex-1 py-1.5 px-2.5 rounded-lg text-[10px] font-mono-numbers font-bold uppercase border transition-colors cursor-pointer flex items-center justify-center gap-1 ${
                hasUploadedResume
                  ? 'bg-emerald-50/80 hover:bg-emerald-100/80 text-[#111111] border-emerald-500/40'
                  : 'bg-white hover:bg-neutral-100 text-[#111111] border-black/15'
              }`}
            >
              <FileText
                className={`h-3 w-3 shrink-0 ${
                  hasUploadedResume ? 'text-emerald-600' : 'text-neutral-600'
                }`}
              />
              <span>{isUploadingResume ? '...' : 'Resume'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resumeInputRef.current?.click();
              }}
              title={
                hasUploadedResume
                  ? 'Replace uploaded resume file'
                  : `Upload custom resume file for ${candidate.name}`
              }
              className="p-1.5 rounded-lg bg-white hover:bg-neutral-100 text-neutral-600 hover:text-[#111111] border border-black/15 transition-colors cursor-pointer shrink-0"
            >
              <Upload className="h-3 w-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playHireChime();
              onToggleShortlist(candidate);
            }}
            title={`Customize and hire ${candidate.name} in the Onboarding Studio`}
            className={`flex-1 max-w-[96px] py-1.5 px-3 rounded-lg text-[10px] font-mono-numbers font-bold uppercase transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              isShortlisted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600'
                : 'bg-[#111111] text-white hover:bg-emerald-600 border border-[#111111] hover:border-emerald-600'
            }`}
          >
            <Plus className="h-3 w-3 shrink-0" />
            <span>Hire</span>
          </button>
        </div>
      </div>
    </div>
  );
};
