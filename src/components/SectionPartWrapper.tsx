import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GripVertical,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Zap,
  Lock,
  Unlock,
} from 'lucide-react';
import {
  PartId,
  SectionId,
  PART_DEFINITIONS,
  useStudioBuilder,
} from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface SectionPartWrapperProps {
  partId: PartId;
  sectionId: SectionId | 'header' | 'footer';
  partIndex?: number;
  totalParts?: number;
  children: React.ReactNode;
  className?: string;
}

export const SectionPartWrapper: React.FC<SectionPartWrapperProps> = ({
  partId,
  sectionId,
  partIndex = 0,
  totalParts = 1,
  children,
  className = '',
}) => {
  const {
    isBuilderMode,
    selectedTarget,
    setSelectedTarget,
    selectAndEditTarget,
    setActiveSection,
    movePartInSection,
    deletePart,
    hiddenParts,
    draggedItem,
    setDraggedItem,
    getInteractionForKey,
    updateInteractionForKey,
    previewPulseKey,
  } = useStudioBuilder();

  const [isDragOver, setIsDragOver] = useState(false);

  if (hiddenParts.includes(partId)) {
    return null;
  }

  const targetKey = `part:${partId}`;
  const interaction = getInteractionForKey(targetKey);
  const pulseVersion = previewPulseKey[targetKey] || 0;

  // Compute entrance animation props
  const getEntranceMotion = () => {
    switch (interaction.entrance) {
      case 'fade-up':
        return {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
        };
      case 'scale-in':
        return {
          initial: { opacity: 0, scale: 0.94 },
          animate: { opacity: 1, scale: 1 },
        };
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 32 },
          animate: { opacity: 1, x: 0 },
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -32 },
          animate: { opacity: 1, x: 0 },
        };
      case 'spring-pop':
        return {
          initial: { opacity: 0, scale: 0.88, y: 14 },
          animate: { opacity: 1, scale: 1, y: 0 },
        };
      default:
        return {
          initial: false as const,
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
        };
    }
  };

  // Compute hover classes
  const getHoverClass = () => {
    switch (interaction.hover) {
      case 'lift':
        return 'hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300';
      case 'scale':
        return 'hover:scale-[1.015] transition-transform duration-300';
      case 'glow-emerald':
        return 'hover:ring-2 hover:ring-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.18)] transition-all duration-300';
      case 'border-highlight':
        return 'hover:ring-2 hover:ring-[#111111] transition-all duration-200';
      default:
        return '';
    }
  };

  // Compute surface style classes
  const getSurfaceClass = () => {
    if (sectionId === 'lineup') {
      return '';
    }
    switch (interaction.surface) {
      case 'card-white':
        return 'bg-white/95 border border-neutral-200/90 shadow-sm p-4 sm:p-6 rounded-3xl';
      case 'glass':
        return 'bg-white/60 backdrop-blur-md border border-white/80 shadow-xs p-4 sm:p-6 rounded-3xl';
      case 'emerald-tint':
        return 'bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 border border-emerald-200/70 p-4 sm:p-6 rounded-3xl';
      case 'dark-contrast':
        return 'bg-[#111111] text-white p-4 sm:p-6 rounded-3xl shadow-lg';
      default:
        return '';
    }
  };

  // Compute padding scale & text align classes
  const getLayoutTuningClass = () => {
    const classes: string[] = [];
    if (interaction.paddingScale === 'compact') {
      classes.push('!py-2');
    } else if (interaction.paddingScale === 'spacious') {
      classes.push('!py-12');
    }
    if (interaction.textAlign === 'left') {
      classes.push('text-left');
    } else if (interaction.textAlign === 'center') {
      classes.push('text-center');
    } else if (interaction.textAlign === 'right') {
      classes.push('text-right');
    }
    return classes.join(' ');
  };

  // Execute custom click interaction when clicked
  const executeClickInteraction = () => {
    if (interaction.clickAction === 'none') return;
    soundFx.playPop();
    if (interaction.clickAction === 'scroll-workshops') {
      document.getElementById('workshops')?.scrollIntoView({ behavior: 'smooth' });
    } else if (interaction.clickAction === 'scroll-workflow') {
      document.getElementById('workflow')?.scrollIntoView({ behavior: 'smooth' });
    } else if (interaction.clickAction === 'scroll-faq') {
      document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
    } else if (interaction.clickAction === 'scroll-top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const entranceMotion = getEntranceMotion();
  const hoverClass = getHoverClass();
  const surfaceClass = getSurfaceClass();
  const tuningClass = getLayoutTuningClass();

  if (!isBuilderMode) {
    return (
      <motion.div
        key={`${partId}-${pulseVersion}`}
        initial={entranceMotion.initial}
        animate={entranceMotion.animate}
        transition={{
          duration: interaction.duration || 0.45,
          type: interaction.entrance === 'spring-pop' ? 'spring' : 'tween',
        }}
        onClick={executeClickInteraction}
        className={`${className} ${hoverClass} ${surfaceClass} ${tuningClass} ${
          interaction.clickAction !== 'none' ? 'cursor-pointer' : ''
        }`}
      >
        {children}
      </motion.div>
    );
  }

  const partDef = PART_DEFINITIONS[partId];
  const isSelected =
    selectedTarget?.kind === 'part' && selectedTarget.partId === partId;
  const canReorder =
    sectionId !== 'header' && sectionId !== 'footer' && totalParts > 1;
  const hasActiveInteraction =
    interaction.entrance !== 'none' ||
    interaction.hover !== 'none' ||
    interaction.clickAction !== 'none' ||
    interaction.surface !== 'default' ||
    (interaction.paddingScale && interaction.paddingScale !== 'default') ||
    (interaction.textAlign && interaction.textAlign !== 'default');

  return (
    <motion.div
      key={`${partId}-${pulseVersion}`}
      id={`part-${partId}`}
      initial={entranceMotion.initial}
      animate={entranceMotion.animate}
      transition={{
        duration: interaction.duration || 0.45,
        type: interaction.entrance === 'spring-pop' ? 'spring' : 'tween',
      }}
      onDragOver={(e) => {
        if (
          canReorder &&
          draggedItem?.type === 'part' &&
          draggedItem.sectionId === sectionId &&
          draggedItem.partId !== partId
        ) {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        if (
          canReorder &&
          draggedItem?.type === 'part' &&
          draggedItem.sectionId === sectionId &&
          draggedItem.fromIndex !== partIndex
        ) {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
          soundFx.playPop();
          movePartInSection(
            sectionId as SectionId,
            draggedItem.fromIndex,
            partIndex
          );
          setDraggedItem(null);
        }
      }}
      onClick={(e) => {
        e.stopPropagation();
        soundFx.playTick();
        setActiveSection(sectionId);
        setSelectedTarget({ kind: 'part', sectionId, partId });
        executeClickInteraction();
      }}
      className={`group/part relative rounded-2xl transition-all cursor-pointer ${className} ${hoverClass} ${surfaceClass} ${tuningClass} ${
        isDragOver
          ? 'ring-2 ring-emerald-500 bg-emerald-500/5'
          : isSelected
          ? 'ring-2 ring-emerald-500'
          : 'hover:ring-1 hover:ring-black/25'
      }`}
    >
      {/* Floating Component Action Bar with Edit, Interactions, Lock, and Delete Buttons */}
      <div
        draggable={canReorder && !interaction.locked}
        onDragStart={(e) => {
          if (!canReorder || interaction.locked) return;
          e.stopPropagation();
          e.dataTransfer.effectAllowed = 'move';
          setDraggedItem({
            type: 'part',
            sectionId: sectionId as SectionId,
            partId,
            fromIndex: partIndex,
          });
        }}
        onDragEnd={() => {
          setDraggedItem(null);
          setIsDragOver(false);
        }}
        onClick={(e) => e.stopPropagation()}
        className={`absolute ${
          sectionId === 'lineup' ? 'top-1 right-6' : '-top-3.5 right-4'
        } z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111111] text-white text-[10px] font-mono-numbers font-bold uppercase tracking-wider shadow-lg border border-white/15 select-none transition-opacity ${
          isSelected
            ? 'opacity-100'
            : sectionId === 'lineup'
            ? 'opacity-0 pointer-events-none'
            : 'opacity-0 group-hover/part:opacity-100 pointer-events-none group-hover/part:pointer-events-auto'
        }`}
      >
        {canReorder && !interaction.locked && (
          <span
            className="cursor-grab active:cursor-grabbing text-neutral-400 hover:text-white flex items-center"
            title="Drag to reorder this part"
          >
            <GripVertical className="h-3 w-3" />
          </span>
        )}

        <span className="text-neutral-300">{partDef?.label || partId}</span>

        {hasActiveInteraction && (
          <span
            className="px-1.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 flex items-center gap-0.5"
            title="Custom interaction or style active"
          >
            <Zap className="h-2.5 w-2.5" />
          </span>
        )}

        {/* Edit Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.playPop();
            selectAndEditTarget({ kind: 'part', sectionId, partId });
          }}
          className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-[#111111] flex items-center gap-1 cursor-pointer transition-colors"
          title="Edit copy, interactions & style"
        >
          <Pencil className="h-2.5 w-2.5" />
          <span>Edit</span>
        </button>

        {/* Lock / Unlock Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            soundFx.playTick();
            updateInteractionForKey(targetKey, { locked: !interaction.locked });
          }}
          className={`px-1.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-colors ${
            interaction.locked
              ? 'bg-amber-400 text-[#111111]'
              : 'bg-white/10 hover:bg-white/20 text-neutral-300'
          }`}
          title={interaction.locked ? 'Unlock component' : 'Lock component against deletion'}
        >
          {interaction.locked ? (
            <Lock className="h-2.5 w-2.5" />
          ) : (
            <Unlock className="h-2.5 w-2.5" />
          )}
        </button>

        {/* Delete Button */}
        {!interaction.locked && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              soundFx.playTick();
              deletePart(partId);
            }}
            className="px-2 py-0.5 rounded-full bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
            title="Delete this component (⌘Z to undo)"
          >
            <Trash2 className="h-2.5 w-2.5" />
            <span>Delete</span>
          </button>
        )}

        {canReorder && !interaction.locked && (
          <div className="flex items-center gap-0.5 pl-1 border-l border-white/15">
            <button
              type="button"
              disabled={partIndex === 0}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playTick();
                movePartInSection(
                  sectionId as SectionId,
                  partIndex,
                  partIndex - 1
                );
              }}
              className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
              title="Move part up"
            >
              <ArrowUp className="h-2.5 w-2.5" />
            </button>
            <button
              type="button"
              disabled={partIndex === totalParts - 1}
              onClick={(e) => {
                e.stopPropagation();
                soundFx.playTick();
                movePartInSection(
                  sectionId as SectionId,
                  partIndex,
                  partIndex + 1
                );
              }}
              className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
              title="Move part down"
            >
              <ArrowDown className="h-2.5 w-2.5" />
            </button>
          </div>
        )}
      </div>

      {children}
    </motion.div>
  );
};
