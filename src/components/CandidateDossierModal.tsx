import React, { useRef, useState } from 'react';
import {
  X,
  FileText,
  Upload,
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Candidate } from '../data/talent';
import { EMPLOYEE_WORKFLOWS } from '../data/employeeWorkflows';
import { PlatformLogo } from './PlatformLogo';
import { useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface CandidateDossierModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  isShortlisted: boolean;
  onToggleShortlist: (candidate: Candidate) => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  currency: 'EUR' | 'USD' | 'GBP';
}

export const CandidateDossierModal: React.FC<CandidateDossierModalProps> = ({
  candidate,
  onClose,
  isShortlisted,
  onToggleShortlist,
  onSelectCandidate,
}) => {
  const { candidates, updateCandidate } = useStudioBuilder();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!candidate) return null;

  const currentIndex = candidates.findIndex((c) => c.id === candidate.id);
  const resumeProfile =
    EMPLOYEE_WORKFLOWS.find((w) => w.id === candidate.id) ||
    EMPLOYEE_WORKFLOWS[0];

  const handleCycleCandidate = (dir: -1 | 1) => {
    if (!onSelectCandidate || candidates.length === 0) return;
    soundFx.playTick();
    const nextIdx =
      (currentIndex + dir + candidates.length) % candidates.length;
    onSelectCandidate(candidates[nextIdx]);
  };

  const handleResumeFile = (file: File) => {
    setIsUploading(true);
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
      setIsUploading(false);
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = () => {
    soundFx.playTick();
    updateCandidate(candidate.id, {
      resumeUrl: undefined,
      resumeFileName: undefined,
      resumeMimeType: undefined,
    });
  };

  const isImageResume =
    Boolean(candidate.resumeUrl) &&
    (candidate.resumeMimeType?.startsWith('image/') ||
      candidate.resumeUrl?.startsWith('data:image/'));

  const isPdfResume =
    Boolean(candidate.resumeUrl) &&
    (candidate.resumeMimeType === 'application/pdf' ||
      candidate.resumeUrl?.startsWith('data:application/pdf') ||
      candidate.resumeFileName?.toLowerCase().endsWith('.pdf'));

  const savingsPercent = Math.round(
    (1 -
      candidate.annualSalaryUsd /
        Math.max(1, candidate.traditionalSalaryUsd)) *
      100
  );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-neutral-200 shadow-2xl flex flex-col"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/*,.doc,.docx"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleResumeFile(file);
            e.target.value = '';
          }}
          className="hidden"
        />

        {/* Top Header Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={candidate.imageSrc}
              alt={candidate.name}
              className="h-9 w-9 rounded-full object-cover object-top bg-neutral-100 border border-neutral-200"
            />
            <div>
              <div className="font-brand text-xs sm:text-sm font-black uppercase text-[#111111]">
                {candidate.role}
              </div>
              <div className="text-[11px] font-mono-numbers text-neutral-500">
                {candidate.name} ·{' '}
                {candidate.resumeFileName || 'Official Software Employee Resume'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Upload / Replace Resume Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-[#111111] hover:bg-emerald-600 text-white text-[10px] font-mono-numbers font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="h-3 w-3" />
              <span>
                {isUploading
                  ? 'Uploading...'
                  : candidate.resumeUrl
                  ? 'Replace Resume'
                  : 'Upload Resume'}
              </span>
            </button>

            {candidate.resumeUrl && (
              <>
                <a
                  href={candidate.resumeUrl}
                  download={
                    candidate.resumeFileName ||
                    `${candidate.name.replace(/\s+/g, '_')}_Resume`
                  }
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-[#111111] text-[10px] font-mono-numbers font-bold uppercase transition-colors flex items-center gap-1"
                  title="Download uploaded resume"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={handleRemoveResume}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-500 text-rose-600 hover:text-white transition-colors cursor-pointer"
                  title="Remove uploaded resume"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => onToggleShortlist(candidate)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono-numbers font-bold uppercase transition-colors cursor-pointer flex items-center gap-1 ${
                isShortlisted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-[#111111]'
              }`}
            >
              {isShortlisted ? (
                <span>Hired</span>
              ) : (
                <>
                  <Plus className="h-3 w-3" />
                  <span>Hire</span>
                </>
              )}
            </button>

            {onSelectCandidate && candidates.length > 1 && (
              <div className="flex items-center gap-0.5 bg-neutral-100 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => handleCycleCandidate(-1)}
                  className="p-1.5 rounded-md hover:bg-white text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  title="Previous Employee"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="px-1.5 text-[10px] font-mono-numbers font-bold text-neutral-700">
                  {currentIndex + 1}/{candidates.length}
                </span>
                <button
                  type="button"
                  onClick={() => handleCycleCandidate(1)}
                  className="p-1.5 rounded-md hover:bg-white text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  title="Next Employee"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                soundFx.playTick();
                onClose();
              }}
              className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
              aria-label="Close resume modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Uploaded Resume Viewer OR Locked Official Software Employee Resume */}
        <div className="p-6 flex-1 flex flex-col gap-6">
          {candidate.resumeUrl ? (
            <div className="w-full flex flex-col items-center">
              {isImageResume ? (
                <img
                  src={candidate.resumeUrl}
                  alt={`${candidate.name} Resume`}
                  className="max-w-full h-auto rounded-2xl border border-neutral-200 shadow-xs"
                />
              ) : isPdfResume ? (
                <iframe
                  src={candidate.resumeUrl}
                  title={`${candidate.name} Resume`}
                  className="w-full h-[74vh] rounded-2xl border border-neutral-200 bg-neutral-50"
                />
              ) : (
                <div className="w-full py-16 px-6 rounded-2xl border border-neutral-200 bg-neutral-50 flex flex-col items-center justify-center text-center">
                  <FileText className="h-12 w-12 text-emerald-600 mb-3" />
                  <p className="font-brand text-base font-black text-[#111111]">
                    {candidate.resumeFileName || 'Uploaded Resume Document'}
                  </p>
                  <p className="text-xs font-mono-numbers text-neutral-500 mt-1">
                    Resume uploaded for {candidate.name} ({candidate.role})
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <a
                      href={candidate.resumeUrl}
                      download={
                        candidate.resumeFileName ||
                        `${candidate.name.replace(/\s+/g, '_')}_Resume`
                      }
                      className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-mono-numbers font-bold uppercase hover:bg-emerald-600 transition-colors flex items-center gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Resume</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-[#111111] text-xs font-mono-numbers font-bold uppercase hover:bg-neutral-100 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload New File</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6 font-mono-numbers">
              {/* Official Locked Employee Resume Header */}
              <div className="rounded-2xl border border-neutral-200 bg-[#FAFAFA] p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={candidate.imageSrc}
                  alt={candidate.name}
                  className="h-28 w-28 rounded-2xl object-contain object-bottom bg-white border border-neutral-200 shrink-0"
                />
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-[#111111] text-white text-[10px] font-bold uppercase">
                      {candidate.role}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 text-[10px] font-bold">
                      {candidate.capacityMultiplier}
                    </span>
                  </div>
                  <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold text-[#111111] tracking-tight">
                    {candidate.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm text-neutral-600">
                    {resumeProfile.tagline}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs">
                    <span className="text-neutral-500">
                      Salary:{' '}
                      <span className="line-through text-neutral-400">
                        ${candidate.traditionalSalaryUsd.toLocaleString()}/yr
                      </span>
                    </span>
                    <span className="font-bold text-emerald-700">
                      Price: ${candidate.annualSalaryUsd.toLocaleString()} (-
                      {savingsPercent}%)
                    </span>
                  </div>
                </div>

                {/* Connected Resume Apps */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
                  {resumeProfile.workflowSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-[11px] font-bold text-[#111111]"
                    >
                      <PlatformLogo platform={step.platform} size={14} />
                      <span className="capitalize">
                        {step.platform.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* About Me & Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="text-[11px] font-bold uppercase text-neutral-400 mb-1.5">
                    01 · EXECUTIVE SUMMARY
                  </div>
                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
                    {candidate.bio || resumeProfile.aboutMe}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                  <div className="text-[11px] font-bold uppercase text-neutral-400 mb-1.5">
                    02 · CORE CAPABILITIES & APPS
                  </div>
                  <p className="text-xs sm:text-sm text-[#111111] leading-relaxed">
                    {resumeProfile.skillsParagraph1}
                  </p>
                </div>
              </div>

              {/* 4-Step Autonomous App Execution Workflow */}
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase text-neutral-400">
                    03 · CONNECTED RESUME APP WORKFLOW
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700">
                    24/7 Autonomous Execution
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resumeProfile.workflowSteps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="rounded-xl border border-neutral-200 bg-[#FAFAFA] p-3.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] font-bold text-neutral-400">
                            {step.stepNumber}
                          </span>
                          <PlatformLogo platform={step.platform} size={15} />
                          <span className="text-xs font-bold text-[#111111] truncate">
                            {step.actionTitle}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 text-[10px] font-bold shrink-0">
                          {step.metricBadge}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[11px] text-neutral-600 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience & Education */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-200 bg-white p-5 space-y-3">
                  <div className="text-[11px] font-bold uppercase text-neutral-400">
                    04 · PRODUCTION TRACK RECORD
                  </div>
                  {resumeProfile.employmentHistory.map((job, idx) => (
                    <div
                      key={idx}
                      className="pb-3 last:pb-0 border-b last:border-b-0 border-neutral-100"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#111111]">
                          {job.role}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {job.period}
                        </span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        {job.company} · {job.location}
                      </div>
                      <ul className="mt-1.5 space-y-1 text-[11px] text-neutral-600 list-disc list-inside">
                        {job.bullets.map((b, bIdx) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-white p-5 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <div className="text-[11px] font-bold uppercase text-neutral-400">
                      05 · ARCHITECTURE & CERTIFICATIONS
                    </div>
                    {resumeProfile.education.map((edu, idx) => (
                      <div
                        key={idx}
                        className="pb-2.5 last:pb-0 border-b last:border-b-0 border-neutral-100"
                      >
                        <div className="text-xs font-bold text-[#111111]">
                          {edu.degree}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {edu.institution} · {edu.period}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Compact Custom File Upload Dropzone */}
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(true);
                    }}
                    onDragLeave={() => setIsDraggingOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleResumeFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 rounded-xl border border-dashed transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isDraggingOver
                        ? 'border-emerald-500 bg-emerald-50/50'
                        : 'border-neutral-300 hover:border-[#111111] bg-[#FAFAFA]'
                    }`}
                  >
                    <div className="text-left">
                      <div className="text-xs font-bold text-[#111111]">
                        Have a custom PDF or image resume for {candidate.name}?
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        Upload once — permanently locked & saved across page refreshes.
                      </div>
                    </div>
                    <span className="px-3 py-1.5 rounded-lg bg-[#111111] text-white text-[10px] font-bold uppercase shrink-0 inline-flex items-center gap-1.5">
                      <Upload className="h-3 w-3 text-emerald-400" />
                      <span>Upload</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

