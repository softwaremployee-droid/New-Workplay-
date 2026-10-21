import React, { useState, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Candidate, CANDIDATES } from '../data/talent';
import { CandidateCard } from './CandidateCard';

interface CandidateDirectoryProps {
  shortlist: Candidate[];
  onToggleShortlist: (candidate: Candidate) => void;
  onOpenDossier: (candidate: Candidate) => void;
  currency: 'EUR' | 'USD' | 'GBP';
}

export const CandidateDirectory: React.FC<CandidateDirectoryProps> = ({
  shortlist,
  onToggleShortlist,
  onOpenDossier,
  currency,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');

  const specializations = [
    'All',
    'Client Onboarding',
    'Enterprise Sales',
    'Funnel & Growth',
    'Operations & RevOps',
    'Team Leadership',
    'Customer Support',
  ];

  const filteredCandidates = useMemo(() => {
    return CANDIDATES.filter((candidate) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.role.toLowerCase().includes(query) ||
        candidate.skills.some((s) => s.toLowerCase().includes(query)) ||
        candidate.specialization.toLowerCase().includes(query);

      const matchesSpec =
        selectedSpecialization === 'All' ||
        candidate.specialization === selectedSpecialization;

      return matchesSearch && matchesSpec;
    });
  }, [searchQuery, selectedSpecialization]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialization('All');
  };

  const isShortlisted = (id: string) => shortlist.some((item) => item.id === id);

  return (
    <section id="directory" className="py-20 border-b border-neutral-200 bg-[#F8F9FA]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2 font-mono-numbers">
              <span>SOFTWARE EMPLOYEES ROSTER</span>
              <span aria-hidden="true">/</span>
              <span>MANAGEMENT CADRE</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#0A0A0A]">
              Directory of Software Employees
            </h2>
            <p className="mt-2 text-base text-neutral-600 max-w-2xl">
              Inspect verified leadership profiles, playbooks, and direct compensation. Schedule direct screens with zero placement markups.
            </p>
          </div>

          <div className="font-mono-numbers text-xs text-neutral-500">
            Showing <span className="font-bold text-black">{filteredCandidates.length}</span> of {CANDIDATES.length} vetted managers
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="border border-neutral-200 bg-white p-4 rounded-xl space-y-4 mb-8 shadow-sm">
          {/* Search Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, skill or name (e.g. Onboarding, Sales, Funnel, Operations, Support)..."
                className="w-full pl-10 pr-4 py-2.5 text-xs border border-neutral-200 rounded-md focus:border-black focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-black cursor-pointer font-mono-numbers"
                >
                  Clear
                </button>
              )}
            </div>

            {searchQuery && (
              <button
                onClick={handleResetFilters}
                className="p-2.5 border border-neutral-200 rounded-md text-neutral-600 hover:text-black hover:bg-neutral-50 transition-colors cursor-pointer self-start sm:self-auto"
                title="Reset filters"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Specialization Segmented Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {specializations.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-[11px] font-mono-numbers font-medium ${
                  selectedSpecialization === spec
                    ? 'bg-black text-white font-semibold'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isShortlisted={isShortlisted(candidate.id)}
              onToggleShortlist={onToggleShortlist}
              onOpenDossier={onOpenDossier}
              currency={currency}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
