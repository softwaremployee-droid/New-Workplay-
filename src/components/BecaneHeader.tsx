import React from 'react';
import { Candidate } from '../data/talent';
import { useStudioBuilder } from '../context/StudioBuilderContext';

interface BecaneHeaderProps {
  shortlistCount?: number;
  shortlist?: Candidate[];
  onToggleShortlist?: (candidate: Candidate) => void;
  onOpenShortlist?: () => void;
  hoveredCandidate?: Candidate | null;
  onHoverCandidate?: (candidate: Candidate | null) => void;
  onSelectCandidate?: (candidate: Candidate) => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onActionClick?: (action: 'hire' | 'build' | 'clone') => void;
  activeView?: 'lineup' | 'workflow';
  onSelectView?: (view: 'lineup' | 'workflow') => void;
  onOpenWorkshops?: () => void;
}

export const BecaneHeader: React.FC<BecaneHeaderProps> = () => {
  const { config, hiddenParts } = useStudioBuilder();

  return (
    <header className="fixed top-0 inset-x-0 z-40 pointer-events-none select-none">
      {/* Static Company Pill: WorkPlay Studio */}
      {config.showHeaderBrandPill && !hiddenParts.includes('header-brand') && (
        <div className="px-4 sm:px-6 lg:px-10 py-3.5 flex items-center justify-start">
          <div className="bg-white/95 backdrop-blur-md border border-black/10 rounded-full px-4 sm:px-5 py-2 shadow-xs flex items-center">
            <span className="font-brand text-xs sm:text-sm font-black tracking-tight text-[#111111]">
              {config.headerBrandText}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
