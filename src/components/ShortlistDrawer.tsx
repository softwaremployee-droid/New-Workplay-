import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Send,
  Plus,
  Briefcase,
  UserPlus,
} from 'lucide-react';
import { Candidate, CANDIDATES } from '../data/talent';
import { ConfettiCanvas } from './ConfettiCanvas';
import { FloatingEmployeeSprite } from './FloatingEmployeeSprite';
import { soundFx } from '../utils/sound';

interface ShortlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  shortlist: Candidate[];
  onRemoveFromShortlist: (id: string) => void;
  onAddToShortlist: (candidate: Candidate) => void;
  currency: 'EUR' | 'USD' | 'GBP';
  onClearShortlist: () => void;
}

export const ShortlistDrawer: React.FC<ShortlistDrawerProps> = ({
  isOpen,
  onClose,
  shortlist,
  onRemoveFromShortlist,
  onAddToShortlist,
  onClearShortlist,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [projectTimeline, setProjectTimeline] = useState('Immediate');
  const [confettiKey, setConfettiKey] = useState<number>(0);
  const [justHiredName, setJustHiredName] = useState<string | null>(null);

  const handleHireCandidate = (candidate: Candidate) => {
    soundFx.playHireChime();
    setConfettiKey(Date.now());
    setJustHiredName(`${candidate.role} (${candidate.name})`);
    onAddToShortlist(candidate);

    setTimeout(() => {
      setJustHiredName(null);
    }, 2800);
  };

  if (!isOpen) return null;

  const totalAnnualSalaryUsd = shortlist.reduce((acc, curr) => acc + curr.annualSalaryUsd, 0);
  const totalTraditionalUsd = shortlist.reduce((acc, curr) => acc + curr.traditionalSalaryUsd, 0);
  const totalSavedUsd = totalTraditionalUsd - totalAnnualSalaryUsd;
  const monthlyPayrollUsd = Math.round(totalAnnualSalaryUsd / 12);

  const availableCandidates = CANDIDATES.filter(
    (c) => !shortlist.some((item) => item.id === c.id)
  );

  const formatSalary = (amount: number) => {
    return `$${amount.toLocaleString()}`;
  };

  const handleSubmitIntro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    soundFx.playHireChime();
    setConfettiKey(Date.now());
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-8">
        <div className="relative w-screen max-w-lg bg-white border-l border-neutral-200 flex flex-col justify-between shadow-2xl overflow-hidden">
          <ConfettiCanvas triggerKey={confettiKey} />

          {/* Top Bar */}
          <div className="p-6 border-b border-neutral-200 flex items-center justify-between bg-[#FAFAFA] relative z-10">
            <div className="flex items-center gap-2.5">
              <Briefcase className="h-5 w-5 text-[#111111]" />
              <span className="font-brand text-xl font-black uppercase tracking-tight text-[#111111]">
                HIRING SQUAD
              </span>
              <span className="font-mono-numbers text-xs bg-[#111111] text-white px-2.5 py-0.5 rounded-full font-bold">
                {shortlist.length} / {CANDIDATES.length} HIRED
              </span>
            </div>

            <button
              onClick={() => {
                soundFx.playTick();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-neutral-200 text-neutral-600 transition-colors cursor-pointer"
              aria-label="Close Hiring Squad drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Floating Just-Hired Celebration Toast */}
          <AnimatePresence>
            {justHiredName && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-20 inset-x-6 z-30 p-3 rounded-full bg-[#111111] text-white shadow-xl flex items-center justify-between text-xs font-mono-numbers px-4"
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  <span>
                    <strong className="text-emerald-300">{justHiredName}</strong> added to Hiring Squad!
                  </span>
                </div>
                <span className="text-[10px] uppercase text-neutral-400">Hired</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 text-center space-y-4"
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#111111]">
                  Software Employee Squad Dispatched!
                </h3>
                <p className="text-xs text-neutral-600 max-w-sm mx-auto leading-relaxed">
                  App connection keys, Resumes, and instant launch blueprints for your{' '}
                  <strong>{shortlist.length} Software Employees</strong> have been sent to{' '}
                  <span className="font-mono text-[#111111] font-bold">{email}</span>.
                </p>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left font-mono-numbers text-xs space-y-1.5 max-w-sm mx-auto">
                  <div className="text-neutral-400 uppercase text-[10px]">
                    Squad Payroll & Capacity Impact
                  </div>
                  <div className="font-bold text-[#111111]">{companyName || 'Your Workspace'}</div>
                  <div className="text-neutral-600">
                    Software Squad Rate: {formatSalary(totalAnnualSalaryUsd)} / yr
                  </div>
                  <div className="text-emerald-700 font-bold">
                    Annual Salary Saved: {formatSalary(totalSavedUsd)} / yr (-82%)
                  </div>
                  <div className="text-neutral-500">Launch Window: {projectTimeline}</div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      onClearShortlist();
                      onClose();
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#111111] text-white text-xs font-mono-numbers font-bold uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                  >
                    Done & Return to Studio
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                {/* Active Hired Squad Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono-numbers text-neutral-400 uppercase tracking-wider font-bold">
                    <span>Active Software Employees ({shortlist.length})</span>
                    <span>Rate vs Human Salary</span>
                  </div>

                  {shortlist.length === 0 ? (
                    <div className="py-8 px-4 text-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 space-y-2">
                      <p className="text-xs font-mono-numbers text-neutral-500">
                        Your Hiring Squad is empty. Add Software Employees below to multiply capacity 15× and slash payroll!
                      </p>
                    </div>
                  ) : (
                    <AnimatePresence initial={false}>
                      {shortlist.map((candidate, idx) => (
                        <motion.div
                          key={candidate.id}
                          layout
                          initial={{ opacity: 0, scale: 0.92, y: 8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, x: 20 }}
                          transition={{ duration: 0.2 }}
                          className="p-3.5 rounded-2xl border border-neutral-200 bg-white shadow-2xs flex items-center justify-between gap-3 group hover:border-black transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-10 flex items-end justify-center bg-transparent">
                              <FloatingEmployeeSprite
                                src={candidate.imageSrc}
                                alt={candidate.name}
                                index={idx}
                                floatAmplitude={4}
                                showShadow={false}
                                className="h-full w-full"
                                imageClassName="h-full w-full"
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[10px] font-mono-numbers font-bold text-emerald-600">
                                  {candidate.capacityMultiplier}
                                </span>
                                <span className="text-xs font-bold text-[#111111]">
                                  {candidate.role}
                                </span>
                              </div>
                              <div className="text-[11px] text-neutral-500 font-mono-numbers">
                                {candidate.name} · {candidate.location.replace('Lives in ', '')}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right font-mono-numbers">
                              <div className="text-xs font-bold text-[#111111]">
                                ${Math.round(candidate.annualSalaryUsd / 1000)}k/yr
                              </div>
                              <div className="text-[10px] line-through text-neutral-400">
                                ${Math.round(candidate.traditionalSalaryUsd / 1000)}k/yr
                              </div>
                            </div>
                            <button
                              onClick={() => onRemoveFromShortlist(candidate.id)}
                              className="p-1.5 rounded-full text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors cursor-pointer"
                              aria-label={`Remove ${candidate.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>

                {/* Quick-Add Available Managers */}
                {availableCandidates.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500 uppercase tracking-wider font-bold">
                      <span className="flex items-center gap-1.5">
                        <UserPlus className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Available Software Employees (Click to Hire)</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {availableCandidates.map((candidate, idx) => (
                        <div
                          key={candidate.id}
                          className="p-2.5 rounded-2xl border border-neutral-200/80 bg-neutral-50/70 hover:bg-white hover:border-neutral-300 flex items-center justify-between gap-3 transition-all"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="h-10 w-8 flex items-end justify-center bg-transparent">
                              <FloatingEmployeeSprite
                                src={candidate.imageSrc}
                                alt={candidate.name}
                                index={idx}
                                floatAmplitude={3}
                                showShadow={false}
                                className="h-full w-full"
                                imageClassName="h-full w-full"
                              />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#111111] leading-tight">
                                {candidate.role}{' '}
                                <span className="text-[10px] font-mono-numbers text-emerald-600">
                                  ({candidate.capacityMultiplier})
                                </span>
                              </div>
                              <div className="text-[10px] font-mono-numbers text-neutral-500">
                                ${Math.round(candidate.annualSalaryUsd / 1000)}k/yr vs $
                                {Math.round(candidate.traditionalSalaryUsd / 1000)}k human
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleHireCandidate(candidate)}
                            className="px-3.5 py-1.5 rounded-full bg-white border border-neutral-300 hover:bg-[#111111] hover:text-white hover:border-[#111111] text-[10px] font-mono-numbers font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Hire</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compensation & Salary Savings Breakdown */}
                {shortlist.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-neutral-200 space-y-3 font-mono-numbers">
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>Traditional Human Payroll ({shortlist.length} Roles)</span>
                      <span className="line-through text-neutral-400">
                        {formatSalary(totalTraditionalUsd)} / yr
                      </span>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-600">
                      <span>Monthly Software Squad Rate</span>
                      <span className="font-bold text-[#111111]">
                        {formatSalary(monthlyPayrollUsd)} / mo
                      </span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-baseline">
                      <div>
                        <span className="text-xs font-bold uppercase text-[#111111] block">
                          Annual Software Squad Rate
                        </span>
                        <span className="text-[11px] text-emerald-700 font-bold">
                          You Save {formatSalary(totalSavedUsd)}/yr in Salary Overhead
                        </span>
                      </div>
                      <span className="text-xl font-bold text-[#111111]">
                        {formatSalary(totalAnnualSalaryUsd)}/yr
                      </span>
                    </div>
                  </div>
                )}

                {/* Direct Dispatch Form */}
                {shortlist.length > 0 && (
                  <form
                    onSubmit={handleSubmitIntro}
                    className="space-y-4 pt-2 border-t border-neutral-200"
                  >
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#111111] font-mono-numbers">
                      Deploy Squad Into Your Software Apps
                    </h4>

                    <div>
                      <label className="block text-[11px] font-mono-numbers uppercase text-neutral-500 mb-1">
                        Company / Workspace Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Acme Technologies Inc."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-mono-numbers rounded-full border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-numbers uppercase text-neutral-500 mb-1">
                        Work Email for App Keys & Resumes
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="founder@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs font-mono-numbers rounded-full border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono-numbers uppercase text-neutral-500 mb-1">
                        Target App Deployment Window
                      </label>
                      <div className="grid grid-cols-3 gap-2 font-mono-numbers text-xs">
                        {['Immediate', 'Within 14 Days', 'Next Month'].map((t) => (
                          <button
                            type="button"
                            key={t}
                            onClick={() => {
                              soundFx.playTick();
                              setProjectTimeline(t);
                            }}
                            className={`py-2 px-2 rounded-full border text-center transition-all cursor-pointer ${
                              projectTimeline === t
                                ? 'border-[#111111] bg-[#111111] text-white font-bold'
                                : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-full bg-[#111111] text-white text-xs font-mono-numbers font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Launch Software Squad ({shortlist.length})</span>
                    </button>
                  </form>
                )}
              </>
            )}
          </div>

          {/* Footer Guarantee */}
          <div className="p-4 border-t border-neutral-200 bg-[#FAFAFA] flex items-center justify-center gap-2 text-[11px] font-mono-numbers text-neutral-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>15× Capacity · -82% Salary · Powered by Your Software Apps</span>
          </div>
        </div>
      </div>
    </div>
  );
};
