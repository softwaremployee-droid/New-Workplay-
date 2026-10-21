import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  Activity, 
  Trash2, 
  UserPlus
} from 'lucide-react';
import { Candidate, CANDIDATES } from '../data/talent';
import { soundFx } from '../utils/sound';

interface SquadBuildingExperienceProps {
  shortlist: Candidate[];
  onToggleShortlist: (candidate: Candidate) => void;
  onOpenDossier: (candidate: Candidate) => void;
  onOpenShortlistModal: () => void;
  currency: 'EUR' | 'USD' | 'GBP';
}

interface SquadRoleSlot {
  id: string;
  title: string;
  salaryUsd: number;
  recommendedSkill: string;
  candidateId: string | null;
}

export const SquadBuildingExperience: React.FC<SquadBuildingExperienceProps> = ({
  shortlist,
  onToggleShortlist,
  onOpenDossier,
  onOpenShortlistModal,
  currency,
}) => {
  // 6 Dedicated Slots matching the 6 Software Employee Positions
  const [slots, setSlots] = useState<SquadRoleSlot[]>([
    { id: 'slot-1', title: 'Onboarding Manager', salaryUsd: 90000, recommendedSkill: 'TTV & User Activation', candidateId: 'employee-1-onboarding' },
    { id: 'slot-2', title: 'Sales Manager', salaryUsd: 100000, recommendedSkill: 'Pipeline & Enterprise Closing', candidateId: 'employee-2-sales' },
    { id: 'slot-3', title: 'Funnel Manager', salaryUsd: 90000, recommendedSkill: 'CRO & Acquisition Funnels', candidateId: 'employee-3-funnel' },
    { id: 'slot-4', title: 'Operations Manager', salaryUsd: 110000, recommendedSkill: 'RevOps & Systems Automation', candidateId: 'employee-4-operations' },
    { id: 'slot-5', title: 'Team Manager', salaryUsd: 110000, recommendedSkill: 'Sprint Leadership & Retention', candidateId: 'employee-5-team' },
    { id: 'slot-6', title: 'Support Manager', salaryUsd: 75000, recommendedSkill: 'CSAT & Fast SLA Resolution', candidateId: 'employee-6-support' },
  ]);

  // Simulation State
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [simulationSuccess, setSimulationSuccess] = useState<boolean>(false);

  const handleAssignToSlot = (slotId: string, candidateId: string) => {
    soundFx.playPop();
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, candidateId } : s))
    );
  };

  const handleClearSlot = (slotId: string) => {
    soundFx.playTick();
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, candidateId: null } : s))
    );
  };

  const assignedCandidates = slots
    .map((s) => CANDIDATES.find((c) => c.id === s.candidateId))
    .filter((c): c is Candidate => c !== undefined);

  // Financial calculations
  const totalAnnualPayrollUsd = assignedCandidates.reduce((acc, c) => acc + c.annualSalaryUsd, 0);
  const monthlyPayrollUsd = Math.round(totalAnnualPayrollUsd / 12);
  const totalDailyBurnUsd = assignedCandidates.reduce((acc, c) => acc + c.dayRateUsd, 0);
  const coveragePercent = Math.min(100, Math.round((assignedCandidates.length / 6) * 100));

  const formatUsd = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  // Run Playful GTM & Operations Growth Simulation
  const handleRunSimulation = () => {
    if (assignedCandidates.length === 0) return;
    setSimulating(true);
    setSimulationSuccess(false);
    setSimulationLogs(['[T-00:00] Product Launch Day: 10,000 new software signups hitting the platform!']);
    soundFx.playTick();

    const timeline = [
      { ms: 600, log: '📈 Funnel Manager (Linnea) detects drop-off and deploys 1-click progressive signup: Conversion jumps +44%!' },
      { ms: 1200, log: '💼 Sales Manager (Julian) qualifies 48 high-intent enterprise accounts and books $480k in demo pipeline!' },
      { ms: 1800, log: '⚙️ Operations Manager (Maya) auto-syncs Stripe billing and provisions enterprise access tokens seamlessly!' },
      { ms: 2400, log: '🚀 Onboarding Manager (Marcus) triggers customized 14-day adoption playbooks, locking Day-30 retention at 96%!' },
      { ms: 3000, log: '👥 Team Manager (David) keeps the squad aligned with async standups and zero employee burn-out!' },
      { ms: 3600, log: '🎧 Support Manager (Sophie) closes 240 tickets with a 4.2-minute response time and 99.4% CSAT rating!' },
      { ms: 4200, log: '🏆 FULL SCALE SUCCESS: $575k Talent Squad generated $2.4M ARR with 99.4% CSAT and zero team churn!' },
    ];

    timeline.forEach(({ ms, log }, index) => {
      setTimeout(() => {
        setSimulationLogs((prev) => [...prev, log]);
        soundFx.playTick();
        if (index === timeline.length - 1) {
          setSimulating(false);
          setSimulationSuccess(true);
          soundFx.playSuccess();
        }
      }, ms);
    });
  };

  return (
    <section id="builder" className="py-24 border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-numbers uppercase tracking-wider text-neutral-400 font-bold mb-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>SOFTWARE EMPLOYEES LAB</span>
              <span aria-hidden="true">/</span>
              <span>THE SQUAD BUILDING EXPERIENCE</span>
            </div>
            <h2 className="font-brand text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#0A0A0A]">
              Build Your High-Growth Software Team
            </h2>
            <p className="mt-3 text-sm text-neutral-600 max-w-2xl">
              Draft your 6 core managers into specialized leadership slots. Check live payroll budgets, team coverage, and run the 10,000-user growth simulation.
            </p>
          </div>

          <button
            onClick={() => {
              soundFx.playTick();
              setSlots((prev) => prev.map((s) => ({ ...s, candidateId: null })));
              setSimulationLogs([]);
              setSimulationSuccess(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-mono-numbers text-neutral-500 hover:text-black hover:border-black transition-colors cursor-pointer self-start md:self-end"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset Workbench</span>
          </button>
        </div>

        {/* 6-Slot Staging Deck (3 cols on tablet, 6 on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {slots.map((slot, index) => {
            const assigned = CANDIDATES.find((c) => c.id === slot.candidateId);

            return (
              <motion.div
                key={slot.id}
                layout
                className={`relative rounded-2xl border p-3 flex flex-col justify-between transition-all duration-300 min-h-[300px] ${
                  assigned
                    ? 'border-black bg-[#F8F9FA] shadow-md'
                    : 'border-dashed border-neutral-300 bg-neutral-50 hover:border-neutral-400'
                }`}
              >
                {/* Slot Header */}
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono-numbers font-bold text-neutral-400 pb-1.5 border-b border-neutral-200">
                    <span>ROLE 0{index + 1}</span>
                    {assigned && (
                      <button
                        onClick={() => handleClearSlot(slot.id)}
                        className="text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove from slot"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  <h3 className="font-display text-xs font-extrabold uppercase text-black mt-2 leading-tight">
                    {slot.title}
                  </h3>
                  <div className="text-[11px] font-mono-numbers font-bold text-neutral-900 mt-0.5">
                    ${Math.round(slot.salaryUsd / 1000)}k / year
                  </div>

                  {/* Assigned Employee inside Slot */}
                  {assigned ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="mt-3 text-center"
                    >
                      <div className="relative aspect-square w-20 mx-auto rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-sm mb-2">
                        <img
                          src={assigned.imageSrc}
                          alt={assigned.name}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover object-top"
                        />
                      </div>
                      <div className="font-display text-xs font-bold text-black truncate">
                        {assigned.name}
                      </div>
                      <div className="text-[10px] font-mono-numbers text-neutral-500 truncate mt-0.5">
                        {assigned.experienceYears}y exp · {assigned.code}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="h-28 flex flex-col items-center justify-center text-center p-2 text-neutral-400">
                      <div className="h-8 w-8 rounded-full border border-dashed border-neutral-300 flex items-center justify-center mb-1.5">
                        <UserPlus className="h-3.5 w-3.5 text-neutral-400" />
                      </div>
                      <span className="text-[10px] font-mono-numbers">Vacant</span>
                      <span className="text-[9px] text-neutral-400">Assign below</span>
                    </div>
                  )}
                </div>

                {/* Slot Action */}
                <div className="pt-2 border-t border-neutral-200">
                  {assigned ? (
                    <button
                      onClick={() => onOpenDossier(assigned)}
                      className="w-full py-1.5 rounded-full text-[10px] font-mono-numbers uppercase tracking-wider bg-black text-white hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      Dossier
                    </button>
                  ) : (
                    <div className="text-[10px] font-mono-numbers text-neutral-400 text-center py-1">
                      Ready to Assign
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Available Talent Bench to Click & Assign */}
        <div className="p-6 rounded-2xl border border-neutral-200 bg-[#F8F9FA] mb-12">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono-numbers text-xs font-bold uppercase tracking-wider text-black">
              Software Employees Bench (Click to Assign)
            </span>
            <span className="text-xs font-mono-numbers text-neutral-500">
              6 Defined Management Roles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CANDIDATES.map((candidate, index) => {
              const isAssigned = slots.some((s) => s.candidateId === candidate.id);

              return (
                <button
                  key={candidate.id}
                  onClick={() => {
                    // Match to correct slot
                    handleAssignToSlot(slots[index].id, candidate.id);
                  }}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    isAssigned
                      ? 'border-black bg-white shadow-sm ring-1 ring-black'
                      : 'border-neutral-200 bg-white/70 hover:border-black hover:bg-white'
                  }`}
                >
                  <img
                    src={candidate.imageSrc}
                    alt={candidate.name}
                    referrerPolicy="no-referrer"
                    className="h-12 w-12 rounded-lg object-cover object-top border border-neutral-200 mb-2"
                  />
                  <div className="font-display text-xs font-bold text-black flex items-center justify-center gap-1 w-full truncate">
                    <span>{candidate.role}</span>
                    {isAssigned && <CheckCircle2 className="h-3 w-3 text-emerald-600 shrink-0" />}
                  </div>
                  <div className="text-[11px] font-mono-numbers font-semibold text-neutral-900 mt-0.5">
                    ${Math.round(candidate.annualSalaryUsd / 1000)}k/yr
                  </div>
                  <div className="text-[10px] font-mono-numbers text-neutral-500 truncate w-full">
                    {candidate.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Squad Intelligence Dashboard & Stress Test Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Squad Metrics & Budgeting */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-neutral-200 bg-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <span className="font-display text-base font-bold uppercase text-black">
                Software Squad Payroll
              </span>
              <span className="text-xs font-mono-numbers font-bold text-emerald-600">
                {assignedCandidates.length}/6 Hired
              </span>
            </div>

            <div className="space-y-4 font-mono-numbers text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-neutral-500 uppercase">Operational Coverage</span>
                  <span className="font-bold text-black">{coveragePercent}%</span>
                </div>
                <div className="h-2.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black rounded-full"
                    animate={{ width: `${coveragePercent}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <div className="flex justify-between text-sm font-bold text-black">
                  <span>Total Annual Payroll:</span>
                  <span className="text-emerald-700">{formatUsd(totalAnnualPayrollUsd)} / yr</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Monthly Payroll Burn:</span>
                  <span className="font-bold text-black">{formatUsd(monthlyPayrollUsd)} / mo</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-600">
                  <span>Daily Blended Rate:</span>
                  <span className="font-bold text-black">{formatUsd(totalDailyBurnUsd)} / day</span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-600 font-semibold pt-1 border-t border-neutral-100">
                  <span>Placement & Agency Fees:</span>
                  <span>$0 (Zero Commissions)</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenShortlistModal}
              className="w-full py-3 rounded-full bg-black text-white text-xs font-mono-numbers font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-black/10"
            >
              <span>Export Squad & Request Direct Intros</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Interactive Incident Simulator Terminal */}
          <div className="lg:col-span-7 rounded-2xl border border-black bg-[#0A0A0A] text-white p-6 overflow-hidden flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2 text-xs font-mono-numbers font-bold text-white">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <span>SQUAD GROWTH CHAOS SIMULATOR</span>
                </div>
                <span className="text-[10px] font-mono-numbers text-neutral-500">
                  10,000 USER STRESS TEST
                </span>
              </div>

              <p className="text-xs text-neutral-400 mb-4">
                Simulate an explosive 10,000 enterprise user signup wave and observe how your 6 software managers orchestrate onboarding, sales, funnels, operations, team delivery, and 24/7 support.
              </p>

              {/* Terminal Logs Window */}
              <div className="rounded-xl bg-black border border-neutral-800 p-4 font-mono text-[11px] leading-relaxed min-h-[170px] space-y-1.5 text-neutral-300 overflow-y-auto max-h-[220px]">
                {simulationLogs.length === 0 ? (
                  <div className="text-neutral-600 flex items-center justify-center h-28">
                    Click "Run Growth Simulation" to test your 6 Software Managers under pressure...
                  </div>
                ) : (
                  simulationLogs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={
                        log.includes('🚨')
                          ? 'text-rose-400 font-bold'
                          : log.includes('🏆')
                          ? 'text-emerald-400 font-bold'
                          : log.includes('📈') || log.includes('💼')
                          ? 'text-amber-300'
                          : 'text-neutral-300'
                      }
                    >
                      {log}
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Launch Simulator Button */}
            <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
              <span className="text-[10px] font-mono-numbers text-neutral-500">
                {assignedCandidates.length} of 6 Managers Drafted
              </span>

              <button
                onClick={handleRunSimulation}
                disabled={simulating || assignedCandidates.length === 0}
                className="py-2.5 px-5 rounded-full bg-white text-black hover:bg-neutral-200 disabled:opacity-40 text-xs font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
              >
                {simulating ? (
                  <>
                    <span className="h-3 w-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    <span>Executing Growth Sim...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 fill-black" />
                    <span>Run Growth Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
