/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BecaneHeader } from './components/BecaneHeader';
import { LineupSection } from './components/LineupSection';
import { CandidateDossierModal } from './components/CandidateDossierModal';
import { ShortlistDrawer } from './components/ShortlistDrawer';
import { StudioBuilderPalette } from './components/StudioBuilderPalette';
import { CustomSectionBlocks } from './components/CustomSectionBlocks';
import {
  SoftwareEmployeeConfigurator,
  EmployeeConfigurationState,
  createInitialConfigFromCandidate,
} from './components/SoftwareEmployeeConfigurator';
import {
  StudioBuilderProvider,
  useStudioBuilder,
} from './context/StudioBuilderContext';
import { Candidate, CANDIDATES } from './data/talent';
import { idbGet, idbSet } from './utils/persistentStorage';
import { soundFx } from './utils/sound';

const SAVED_CONFIGS_KEY = 'workplay_saved_employee_configs_v7';

function StudioWorkspaceContent() {
  const { hiddenSections, candidates, isBarVisible, updateCandidate } =
    useStudioBuilder();

  const [shortlist, setShortlist] = useState<Candidate[]>([
    CANDIDATES[0],
    CANDIDATES[1],
  ]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null
  );
  const [hoveredCandidateId, setHoveredCandidateId] = useState<string | null>(
    CANDIDATES[0].id
  );
  const [isShortlistOpen, setIsShortlistOpen] = useState<boolean>(false);
  const [currency] = useState<'EUR' | 'USD' | 'GBP'>('USD');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'lineup' | 'workflow'>('lineup');

  // Page routing state: 'lineup' (main page) vs 'configurator' (new Hire onboarding page)
  const [currentPage, setCurrentPage] = useState<'lineup' | 'configurator'>(
    'lineup'
  );
  const [configuringCandidate, setConfiguringCandidate] =
    useState<Candidate | null>(null);
  // Persisted configurator state per candidate ID
  const [savedConfigsByCandidateId, setSavedConfigsByCandidateId] = useState<
    Record<string, EmployeeConfigurationState>
  >(() => {
    try {
      const raw = localStorage.getItem(SAVED_CONFIGS_KEY);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // ignore storage errors
    }
    return {};
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const idbConfigs = await idbGet<Record<string, EmployeeConfigurationState>>(
        SAVED_CONFIGS_KEY
      );
      if (!cancelled && idbConfigs && typeof idbConfigs === 'object') {
        setSavedConfigsByCandidateId((prev) => ({
          ...idbConfigs,
          ...prev,
        }));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const persistEmployeeConfigs = (
    next: Record<string, EmployeeConfigurationState>
  ) => {
    void idbSet(SAVED_CONFIGS_KEY, next);
    try {
      // Strip duplicate base64 data URLs from localStorage copy since candidates[i].imageSrc already stores them
      const compact: Record<string, EmployeeConfigurationState> = {};
      for (const [k, v] of Object.entries(next)) {
        compact[k] = {
          ...v,
          customAvatarSrc:
            v.customAvatarSrc && v.customAvatarSrc.startsWith('data:')
              ? undefined
              : v.customAvatarSrc,
        };
      }
      localStorage.setItem(SAVED_CONFIGS_KEY, JSON.stringify(compact));
    } catch {
      // ignore storage errors
    }
  };

  const selectedCandidate =
    candidates.find((c) => c.id === selectedCandidateId) || null;
  const hoveredCandidate =
    candidates.find((c) => c.id === hoveredCandidateId) || null;

  const syncedShortlist = shortlist.map(
    (s) => candidates.find((c) => c.id === s.id) || s
  );

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundFx.enabled = nextState;
    if (nextState) {
      soundFx.playPop();
    }
  };

  // Redone Hire button logic: opens the interactive Software Employee Onboarding Configurator page
  const handleHireCandidate = (candidate: Candidate) => {
    setSelectedCandidateId(null);
    setConfiguringCandidate(candidate);
    setSavedConfigsByCandidateId((prev) => {
      if (prev[candidate.id]) return prev;
      const next = {
        ...prev,
        [candidate.id]: createInitialConfigFromCandidate(candidate),
      };
      persistEmployeeConfigs(next);
      return next;
    });
    setCurrentPage('configurator');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveFromShortlist = (id: string) => {
    soundFx.playTick();
    setShortlist((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearShortlist = () => {
    setShortlist([]);
  };

  // Render the focused Software Employee Onboarding Configurator page when Hire is clicked
  if (currentPage === 'configurator') {
    const liveConfiguringCandidate =
      (configuringCandidate &&
        candidates.find((c) => c.id === configuringCandidate.id)) ||
      configuringCandidate ||
      candidates[0];
    const activeCandidateKey = liveConfiguringCandidate?.id || 'default';

    return (
      <SoftwareEmployeeConfigurator
        initialCandidate={liveConfiguringCandidate}
        allCandidates={candidates}
        onSwitchCandidate={handleHireCandidate}
        savedConfig={savedConfigsByCandidateId[activeCandidateKey] || null}
        onSaveConfig={(nextConfig) => {
          setSavedConfigsByCandidateId((prev) => {
            if (prev[activeCandidateKey] === nextConfig) return prev;
            const updated = {
              ...prev,
              [activeCandidateKey]: nextConfig,
            };
            persistEmployeeConfigs(updated);
            return updated;
          });
        }}
        onBackToLineup={() => {
          setCurrentPage('lineup');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onDeployEmployee={(deployedConfig, totalPrice) => {
          if (liveConfiguringCandidate) {
            updateCandidate(liveConfiguringCandidate.id, {
              name:
                deployedConfig.employeeName.trim() ||
                liveConfiguringCandidate.name,
              role:
                deployedConfig.customRoleTitle || liveConfiguringCandidate.role,
              annualSalaryUsd: totalPrice,
              traditionalSalaryUsd:
                deployedConfig.customSalary ||
                liveConfiguringCandidate.traditionalSalaryUsd,
            });
            setShortlist((prev) => {
              const exists = prev.some(
                (item) => item.id === liveConfiguringCandidate.id
              );
              return exists ? prev : [...prev, liveConfiguringCandidate];
            });
          }
        }}
      />
    );
  }

  return (
    <div
      className={`bg-[#FAFAFA] text-[#111111] flex flex-col font-sans selection:bg-[#111111] selection:text-white ${
        isBarVisible ? 'pb-12' : 'pb-0'
      }`}
    >
      {/* WorkPlay Studio Floating Island Header */}
      <BecaneHeader
        shortlistCount={syncedShortlist.length}
        shortlist={syncedShortlist}
        onToggleShortlist={handleHireCandidate}
        onOpenShortlist={() => setIsShortlistOpen(true)}
        hoveredCandidate={hoveredCandidate}
        onHoverCandidate={(c) => setHoveredCandidateId(c ? c.id : null)}
        onSelectCandidate={(c) => setSelectedCandidateId(c.id)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        activeView={activeView}
        onSelectView={(v) => {
          setActiveView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenWorkshops={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />

      <main className="flex-1">
        {!hiddenSections.includes('lineup') && (
          <React.Fragment key="lineup">
            <LineupSection
              sectionIndex={0}
              totalSections={1}
              shortlist={syncedShortlist}
              onToggleShortlist={handleHireCandidate}
              onOpenDossier={(candidate) => setSelectedCandidateId(candidate.id)}
              onHoverCandidate={(candidate) =>
                setHoveredCandidateId(candidate ? candidate.id : null)
              }
              hoveredCandidate={hoveredCandidate}
              onOpenWorkflow={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              onOpenWorkshops={() =>
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
              currency={currency}
            />
            <CustomSectionBlocks sectionId="lineup" />
          </React.Fragment>
        )}
      </main>

      {/* Uploaded Employee Resume Modal */}
      <CandidateDossierModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidateId(null)}
        isShortlisted={
          selectedCandidate
            ? syncedShortlist.some((item) => item.id === selectedCandidate.id)
            : false
        }
        onToggleShortlist={handleHireCandidate}
        onSelectCandidate={(candidate) => setSelectedCandidateId(candidate.id)}
        currency={currency}
      />

      {/* Hiring Squad Drawer */}
      <ShortlistDrawer
        isOpen={isShortlistOpen}
        onClose={() => setIsShortlistOpen(false)}
        shortlist={syncedShortlist}
        onRemoveFromShortlist={handleRemoveFromShortlist}
        onAddToShortlist={handleHireCandidate}
        currency={currency}
        onClearShortlist={handleClearShortlist}
      />

      {/* Bottom Docked Clickable Drag-and-Drop Builder Palette (Optional / Hideable) */}
      <StudioBuilderPalette />
    </div>
  );
}

export default function App() {
  return (
    <StudioBuilderProvider>
      <StudioWorkspaceContent />
    </StudioBuilderProvider>
  );
}
