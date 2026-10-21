import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { Candidate } from '../data/talent';
import { EMPLOYEE_RESUME_PROFILES } from '../data/employeeWorkflows';
import { WorkflowTimelineCard, LogicBrainBadgeIcon } from './WorkflowTimelineCard';
import { soundFx } from '../utils/sound';

interface EmployeeResumeShowcaseCardProps {
  candidate: Candidate;
  isShortlisted: boolean;
  onToggleShortlist: (candidate: Candidate) => void;
  onPrevEmployee?: () => void;
  onNextEmployee?: () => void;
  autoPlayWorkflow?: boolean;
  onToggleAutoPlay?: () => void;
}

export const EmployeeResumeShowcaseCard: React.FC<EmployeeResumeShowcaseCardProps> = ({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onPrevEmployee,
  onNextEmployee,
  autoPlayWorkflow = true,
  onToggleAutoPlay,
}) => {
  const profile =
    EMPLOYEE_RESUME_PROFILES[candidate.id] || EMPLOYEE_RESUME_PROFILES['employee-2-sales'];
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [internalPlaying, setInternalPlaying] = useState<boolean>(autoPlayWorkflow);

  const isPlaying = onToggleAutoPlay ? autoPlayWorkflow : internalPlaying;
  const handleTogglePlay = () => {
    if (onToggleAutoPlay) {
      onToggleAutoPlay();
    } else {
      setInternalPlaying((prev) => !prev);
    }
  };

  // Reset step to 0 when switching candidate
  useEffect(() => {
    setActiveStepIdx(0);
  }, [candidate.id]);

  // Animate through all 10 workflow steps for the active software employee
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStepIdx((prev) => (prev + 1) % profile.workflowSteps.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isPlaying, profile.workflowSteps.length, candidate.id]);

  const nameParts = candidate.name.toUpperCase().split(' ');
  const firstName = nameParts[0] || candidate.name.toUpperCase();
  const lastName = nameParts.slice(1).join(' ');
  const annualSavings = Math.round((candidate.traditionalSalaryUsd - candidate.annualSalaryUsd) / 1000);

  return (
    <div
      className="relative rounded-[36px] overflow-hidden border-[3px] border-[#111111] shadow-[10px_10px_0px_#111111] bg-[#5E6AD2] text-[#111111] select-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }}
    >
      <div className="relative flex flex-row">
        {/* Left Vertical Spine Banner: SYSTEMIZE <DEPT> WITH SOFTWARE EMPLOYEES */}
        <div className="hidden sm:flex w-12 md:w-14 shrink-0 border-r border-white/20 items-center justify-center py-8">
          <div
            className="font-brand font-black text-base md:text-lg lg:text-xl tracking-widest uppercase text-white whitespace-nowrap select-none"
            style={{
              writingMode: 'vertical-rl',
              transform: 'rotate(180deg)',
            }}
          >
            <span>SYSTEMIZE </span>
            <span className="text-[#39D353]">{profile.spineDepartment}</span>
            <span> WITH SOFTWARE EMPLOYEES</span>
          </div>
        </div>

        {/* Main Resume & Animated Workflow Canvas */}
        <div className="flex-1 p-5 sm:p-8 lg:p-10">
          {/* Top Header Row: Giant Name + Role on Left, HIRE ME Pill Button on Right */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-8">
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <h3 className="font-brand text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white leading-[0.95] tracking-wider drop-shadow-xs">
                    <span className="block">{firstName}</span>
                    {lastName && <span className="block">{lastName}</span>}
                  </h3>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3">
                    <span className="font-brand text-lg sm:text-2xl font-black uppercase text-white tracking-wide">
                      {candidate.role}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#111111]/80 text-[#39D353] text-xs font-mono-numbers font-bold uppercase tracking-wider">
                      {candidate.capacityMultiplier}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Controls: Optional Prev/Next + Big White "HIRE ME" Capsule Button */}
            <div className="flex items-center gap-3 self-start">
              {onPrevEmployee && onNextEmployee && (
                <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-xs border border-white/25 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      onPrevEmployee();
                    }}
                    className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-[#111111] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    aria-label="Previous Software Employee"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      soundFx.playTick();
                      onNextEmployee();
                    }}
                    className="h-9 w-9 rounded-full bg-white/90 hover:bg-white text-[#111111] flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
                    aria-label="Next Software Employee"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  if (!isShortlisted) {
                    soundFx.playHireChime();
                  } else {
                    soundFx.playTick();
                  }
                  onToggleShortlist(candidate);
                }}
                className={`px-7 sm:px-9 py-3.5 sm:py-4 rounded-full border-[3px] border-[#111111] shadow-[6px_6px_0px_#111111] font-brand text-lg sm:text-2xl font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  isShortlisted
                    ? 'bg-[#39D353] text-[#111111]'
                    : 'bg-white hover:bg-[#39D353] text-[#111111]'
                }`}
              >
                {isShortlisted ? (
                  <>
                    <Check className="w-6 h-6 stroke-[3]" />
                    <span>HIRED</span>
                  </>
                ) : (
                  <span>HIRE ME</span>
                )}
              </motion.button>
            </div>
          </div>

          {/* 2-Column Bento Grid: Left (SALARY SAVINGS, ABOUT ME, SKILLS & CAPABILITIES) | Right (Headshot + LOGIC, Animated WORKFLOW) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-8 items-start">
            {/* LEFT COLUMN (6 cols) */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* 1. SALARY SAVINGS Card */}
              <div className="bg-white rounded-[28px] border-[3px] border-[#111111] shadow-[8px_8px_0px_#111111] p-6">
                <h4 className="font-brand text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111111] leading-tight">
                  SALARY
                  <br />
                  SAVINGS
                </h4>
                <p className="mt-2.5 text-sm sm:text-base font-bold italic text-[#111111]">
                  {profile.avgYearlySalaryLabel}
                </p>
                <div className="mt-3 pt-3 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs font-mono-numbers">
                  <span className="font-bold text-[#111111]">
                    Software Employee Rate: ${Math.round(candidate.annualSalaryUsd / 1000)}k/yr
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Saves ${annualSavings}k/yr (-82%)
                  </span>
                </div>
              </div>

              {/* 2. ABOUT ME Card */}
              <div className="bg-white rounded-[28px] border-[3px] border-[#111111] shadow-[8px_8px_0px_#111111] p-6">
                <h4 className="font-brand text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111111]">
                  ABOUT ME
                </h4>
                <p className="mt-3 text-sm sm:text-base text-[#111111] leading-relaxed font-medium">
                  {profile.aboutMe}
                </p>
              </div>

              {/* 3. SKILLS & CAPABILITIES Card */}
              <div className="bg-white rounded-[28px] border-[3px] border-[#111111] shadow-[8px_8px_0px_#111111] p-6 flex flex-col justify-between">
                <div>
                  <h4 className="font-brand text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111111]">
                    SKILLS
                  </h4>
                  <p className="mt-3 text-sm sm:text-base text-[#111111] leading-relaxed font-medium">
                    {profile.skillsParagraph1}
                  </p>
                  <p className="mt-3.5 text-sm sm:text-base text-[#111111] leading-relaxed font-medium">
                    {profile.skillsParagraph2}
                  </p>

                  <h4 className="mt-6 font-brand text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111111]">
                    CAPABILITIES
                  </h4>
                  <p className="mt-2.5 text-sm sm:text-base text-[#111111] leading-relaxed font-medium">
                    {profile.capabilitiesText}
                  </p>
                </div>

                {/* Bottom 3-Column Metrics Row: 24/7 Availability | Automations | 99.9% Uptime */}
                <div className="mt-6 pt-4 border-t border-neutral-200 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-brand text-lg sm:text-xl font-black text-[#111111]">
                      {profile.stats.availability}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium mt-0.5">Availability</div>
                  </div>
                  <div>
                    <div className="font-brand text-lg sm:text-xl font-black text-[#111111]">
                      {profile.stats.automations}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium mt-0.5">Automations</div>
                  </div>
                  <div>
                    <div className="font-brand text-lg sm:text-xl font-black text-[#111111]">
                      {profile.stats.uptime}
                    </div>
                    <div className="text-xs text-neutral-600 font-medium mt-0.5">Uptime</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (6 cols): Circular Headshot + LOGIC Card + Animated WORKFLOW Card */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              {/* Top Card: Circular Employee Headshot Overlapping LOGIC / WORKWARE OS Card */}
              <div className="relative pt-20 sm:pt-24">
                {/* Circular Studio Headshot Overlapping Top of Card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <motion.div
                    key={candidate.imageSrc}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.28 }}
                    className="h-40 w-40 sm:h-48 sm:w-48 rounded-full bg-neutral-100 border-4 border-white shadow-xl overflow-hidden flex items-end justify-center"
                  >
                    <img
                      src={candidate.imageSrc}
                      alt={candidate.name}
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-contain object-bottom select-none pt-2"
                    />
                  </motion.div>
                </div>

                {/* LOGIC Card Body */}
                <div className="bg-white rounded-[28px] border-[3px] border-[#111111] shadow-[8px_8px_0px_#111111] pt-24 sm:pt-28 px-6 pb-6">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="font-brand text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111111]">
                      LOGIC
                    </h4>
                    <LogicBrainBadgeIcon />
                  </div>

                  <div className="mt-2">
                    <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#111111]">
                      WORKWARE OPERATING SYSTEM
                    </div>
                    <div className="text-lg sm:text-2xl font-normal text-[#111111] mt-0.5">
                      Modular Architecture
                    </div>
                  </div>

                  {/* 4 Black Architecture Capsules */}
                  <div className="mt-4 space-y-2.5">
                    <div className="w-full py-2.5 px-4 rounded-full bg-[#111111] text-white text-center text-xs sm:text-sm font-bold tracking-wide">
                      {profile.logicPills.topFull}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="py-2.5 px-3 rounded-full bg-[#111111] text-white text-center text-xs sm:text-sm font-bold tracking-wide truncate">
                        {profile.logicPills.middleLeft}
                      </div>
                      <div className="py-2.5 px-3 rounded-full bg-[#111111] text-white text-center text-xs sm:text-sm font-bold tracking-wide truncate">
                        {profile.logicPills.middleRight}
                      </div>
                    </div>
                    <div className="w-full py-2.5 px-4 rounded-full bg-[#111111] text-white text-center text-xs sm:text-sm font-bold tracking-wide">
                      {profile.logicPills.bottomFull}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card: Animated 10-Step WORKFLOW Card */}
              <WorkflowTimelineCard
                steps={profile.workflowSteps}
                activeStepIdx={activeStepIdx}
                onSelectStep={setActiveStepIdx}
                isPlaying={isPlaying}
                onTogglePlay={handleTogglePlay}
                employeeName={candidate.name}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
