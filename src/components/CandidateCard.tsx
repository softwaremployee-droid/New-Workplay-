import React from 'react';
import { ArrowUpRight, Check, Plus, Bookmark } from 'lucide-react';
import { Candidate } from '../data/talent';

interface CandidateCardProps {
  candidate: Candidate;
  isShortlisted: boolean;
  onToggleShortlist: (candidate: Candidate) => void;
  onOpenDossier: (candidate: Candidate) => void;
  currency: 'EUR' | 'USD' | 'GBP';
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isShortlisted,
  onToggleShortlist,
  onOpenDossier,
  currency,
}) => {
  const formatSalary = (salaryUsd: number) => {
    return `$${Math.round(salaryUsd / 1000)}k / year`;
  };

  const formatDayRate = (dayRateUsd: number) => {
    return `$${dayRateUsd} / day`;
  };

  return (
    <div className="group relative flex flex-col justify-between border border-neutral-200 bg-white p-5 transition-all duration-300 hover:border-black hover:shadow-xl rounded-sm">
      {/* Header bar within card: Code & Availability */}
      <div>
        <div className="flex items-center justify-between text-[11px] font-mono-numbers text-neutral-500 pb-3 border-b border-neutral-100">
          <span className="font-bold tracking-widest text-black">{candidate.code}</span>
          <span className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 rounded-full ${candidate.availability === 'Immediate' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{candidate.availability}</span>
          </span>
        </div>

        {/* Headshot Portrait on Clean White Background */}
        <div 
          onClick={() => onOpenDossier(candidate)}
          className="relative mt-4 aspect-square overflow-hidden bg-neutral-50 cursor-pointer rounded-lg"
        >
          <img
            src={candidate.imageSrc}
            alt={candidate.name}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />

          {/* Quick dossier hover indicator */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 backdrop-blur-sm text-black text-[11px] font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1 font-mono-numbers">
              <span>View Dossier</span>
              <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
        </div>

        {/* Meta details */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 
              onClick={() => onOpenDossier(candidate)}
              className="font-display text-lg font-bold text-[#0A0A0A] hover:underline cursor-pointer"
            >
              {candidate.role}
            </h3>
            <span className="text-[11px] font-mono-numbers text-neutral-500 shrink-0">
              {candidate.experienceYears}y exp
            </span>
          </div>

          <p className="mt-0.5 text-xs font-mono-numbers text-neutral-500">
            {candidate.name} · {candidate.specialization}
          </p>

          <p className="mt-2 text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {candidate.bio}
          </p>

          {/* Skills */}
          <div className="mt-3 flex flex-wrap gap-1">
            {candidate.skills.slice(0, 3).map((skill, i) => (
              <span
                key={i}
                className="text-[10px] text-neutral-500 border border-neutral-200 px-1.5 py-0.5 rounded font-mono-numbers"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Rates & Shortlist Action */}
      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
        <div>
          <div className="font-mono-numbers text-sm font-bold text-black">
            {formatSalary(candidate.annualSalaryUsd)}
          </div>
          <div className="font-mono-numbers text-[10px] text-neutral-400">
            {formatDayRate(candidate.dayRateUsd)} contract equiv
          </div>
        </div>

        <button
          onClick={() => onToggleShortlist(candidate)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer font-mono-numbers ${
            isShortlisted
              ? 'bg-neutral-900 text-white'
              : 'border border-neutral-300 bg-white text-black hover:border-black'
          }`}
        >
          {isShortlisted ? (
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
};
