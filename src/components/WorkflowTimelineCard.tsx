import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Check, Zap } from 'lucide-react';
import { EmployeeWorkflowStep, WorkflowNodeIconType } from '../data/employeeWorkflows';
import { PlatformLogo } from './PlatformLogo';
import { soundFx } from '../utils/sound';

interface WorkflowTimelineCardProps {
  steps: EmployeeWorkflowStep[];
  activeStepIdx: number;
  onSelectStep: (idx: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  employeeName: string;
}

export const WorkflowStepNodeIcon: React.FC<{
  type: WorkflowNodeIconType;
  isActive: boolean;
}> = ({ type, isActive }) => {
  switch (type) {
    case 'typeform':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <circle cx="8" cy="12" r="3" fill="#111111" />
          <rect x="12.5" y="9" width="5.5" height="6" rx="1.5" fill="#111111" />
        </svg>
      );
    case 'stripe':
      return (
        <span className="font-brand font-black text-[14px] leading-none text-[#635BFF] select-none">
          S
        </span>
      );
    case 'hubspot':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <circle
            cx="13.5"
            cy="12.5"
            r="3"
            stroke="#FF7A59"
            strokeWidth="2.2"
          />
          <circle cx="13.5" cy="5.5" r="1.6" fill="#FF7A59" />
          <circle cx="19" cy="16" r="1.6" fill="#FF7A59" />
          <circle cx="6.5" cy="16" r="1.8" fill="#FF7A59" />
          <path
            d="M13.5 7.1V9.5M16.1 14.1L17.8 15.2M10.9 14.1L8.1 15.3"
            stroke="#FF7A59"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'email':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="4" y="6.5" width="16" height="11" rx="2" fill="#111111" />
          <path
            d="M5.5 8L12 12.5L18.5 8"
            stroke="#FFFFFF"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'handoff':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="4.5" y="10" width="3.5" height="3.5" rx="0.8" fill="#111111" />
          <rect x="10.25" y="10" width="3.5" height="3.5" rx="0.8" fill="#111111" />
          <rect x="16" y="10" width="3.5" height="3.5" rx="0.8" fill="#111111" />
          <path
            d="M8 11.75H10.25M13.75 11.75H16M6.25 10V7.5H12V10M12 13.5V16.5H17.75V13.5"
            stroke="#111111"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'report':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="4.5" y="5" width="15" height="14" rx="2.5" fill="#111111" />
          <rect x="7.5" y="12.5" width="2" height="3.5" rx="0.5" fill="#FFFFFF" />
          <rect x="11" y="10" width="2" height="6" rx="0.5" fill="#FFFFFF" />
          <rect x="14.5" y="8" width="2" height="8" rx="0.5" fill="#FFFFFF" />
        </svg>
      );
    case 'survey':
      return (
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
          <rect x="6" y="4.5" width="12" height="15" rx="2" fill="#111111" />
          <rect x="9" y="3.5" width="6" height="2.5" rx="1" fill="#111111" stroke="#FFFFFF" strokeWidth="0.8" />
          <path
            d="M9 9.5H15M9 12.5H15M9 15.5H13"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return (
        <div className={isActive ? 'scale-105 transition-transform' : ''}>
          <PlatformLogo platform={type} size={15} />
        </div>
      );
  }
};

export const LogicBrainBadgeIcon: React.FC = () => (
  <div className="h-11 w-11 rounded-full bg-[#111111] text-white flex items-center justify-center shrink-0 shadow-sm">
    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
      <path
        d="M9.5 4.5C7.5 4.5 6 6 6 8C4.8 8.6 4 9.8 4 11.3C4 12.9 5 14.2 6.4 14.7C6.2 15.3 6 16 6 16.7C6 18.5 7.5 20 9.5 20C10.4 20 11.1 19.5 11.4 18.7V5.8C11.1 5 10.4 4.5 9.5 4.5Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 4.5C16.5 4.5 18 6 18 8C19.2 8.6 20 9.8 20 11.3C20 12.9 19 14.2 17.6 14.7C17.8 15.3 18 16 18 16.7C18 18.5 16.5 20 14.5 20C13.6 20 12.9 19.5 12.6 18.7V5.8C12.9 5 13.6 4.5 14.5 4.5Z"
        stroke="white"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.5" cy="9.5" r="0.9" fill="#39D353" />
      <circle cx="15.5" cy="9.5" r="0.9" fill="#39D353" />
      <circle cx="8.5" cy="14" r="0.9" fill="#39D353" />
      <circle cx="15.5" cy="14" r="0.9" fill="#39D353" />
    </svg>
  </div>
);

export const WorkflowTimelineCard: React.FC<WorkflowTimelineCardProps> = ({
  steps,
  activeStepIdx,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  employeeName,
}) => {
  const activeStep = steps[activeStepIdx] || steps[0];
  const progressPercent = ((activeStepIdx + 1) / steps.length) * 100;

  return (
    <div className="bg-white rounded-[28px] border-[3px] border-[#111111] shadow-[8px_8px_0px_#111111] p-5 sm:p-6 flex flex-col justify-between">
      {/* Header Row: Bold Extended WORKFLOW Title + Live Automation Controls */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="font-brand text-2xl sm:text-3xl font-black uppercase tracking-wider text-[#111111] leading-none select-none">
          WORKFLOW
        </h3>

        <button
          type="button"
          onClick={() => {
            soundFx.playTick();
            onTogglePlay();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] hover:bg-neutral-800 text-white text-[10px] font-mono-numbers font-bold uppercase tracking-wider cursor-pointer transition-colors"
          title={isPlaying ? 'Pause live workflow animation' : 'Play live workflow animation'}
        >
          {isPlaying ? (
            <>
              <Pause className="w-3 h-3 fill-white" />
              <span>LIVE</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-white" />
              <span>RUN</span>
            </>
          )}
        </button>
      </div>

      {/* Vertical Timeline Spine & 10 Animated Steps (Modeled Directly on Reference Photo) */}
      <div className="relative pl-1 py-1">
        {/* Continuous Black Vertical Line */}
        <div className="absolute left-[18px] top-0 bottom-0 w-[3px] bg-[#111111]/20 rounded-full" />

        {/* Animated Active Progress Line */}
        <motion.div
          className="absolute left-[18px] top-0 w-[3px] bg-[#111111] rounded-full origin-top"
          animate={{ height: `${progressPercent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />

        <div className="relative z-10 space-y-2">
          {steps.map((step, idx) => {
            const isActive = idx === activeStepIdx;
            const isCompleted = idx < activeStepIdx;

            return (
              <motion.div
                key={step.id}
                onClick={() => {
                  soundFx.playTick();
                  onSelectStep(idx);
                }}
                whileHover={{ x: 3 }}
                className={`group flex items-center gap-3 py-0.5 pr-2 rounded-full cursor-pointer transition-all ${
                  isActive ? 'bg-emerald-50/90 ring-1 ring-emerald-500/40' : 'hover:bg-neutral-50'
                }`}
              >
                {/* Circular Bordered Step Icon Node */}
                <div className="relative flex items-center justify-center shrink-0">
                  {isActive && (
                    <motion.span
                      layoutId="workflow-active-ring"
                      className="absolute -inset-1 rounded-full bg-emerald-400/35 animate-ping"
                    />
                  )}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.12 : 1,
                      borderColor: isActive ? '#10B981' : '#111111',
                    }}
                    transition={{ duration: 0.2 }}
                    className="relative h-8 w-8 rounded-full bg-white border-[2.5px] border-[#111111] flex items-center justify-center shadow-2xs"
                  >
                    <WorkflowStepNodeIcon type={step.iconType} isActive={isActive} />
                  </motion.div>
                </div>

                {/* Action Copy with Bold App Name */}
                <div className="flex-1 min-w-0 flex items-center justify-between gap-2">
                  <p
                    className={`text-xs sm:text-[13.5px] leading-snug truncate transition-colors ${
                      isActive ? 'text-[#111111] font-semibold' : 'text-[#111111]/90 font-normal'
                    }`}
                  >
                    <span>{step.prefix}</span>
                    {step.boldApp && <strong className="font-extrabold text-[#111111]">{step.boldApp}</strong>}
                    {step.suffix && <span>{step.suffix}</span>}
                  </p>

                  {/* Animated Status Indicator on Right */}
                  <div className="shrink-0 flex items-center gap-1">
                    {isActive ? (
                      <motion.span
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#111111] text-[#39D353] text-[9px] font-mono-numbers font-bold uppercase"
                      >
                        <Zap className="w-2.5 h-2.5 fill-current" />
                        <span>{step.latency}</span>
                      </motion.span>
                    ) : isCompleted ? (
                      <span className="h-4 w-4 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    ) : null}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Live Real-World Automation Telemetry Footer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${employeeName}-${activeStep.id}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="mt-3.5 pt-3 border-t-2 border-[#111111]/10 flex items-center justify-between gap-2 text-[11px] font-mono-numbers"
        >
          <div className="flex items-center gap-2 min-w-0">
            <PlatformLogo platform={activeStep.platform} size={16} />
            <span className="text-[#111111] font-bold truncate">{activeStep.liveMetric}</span>
          </div>
          <span className="shrink-0 text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Step {activeStep.id}/10
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
