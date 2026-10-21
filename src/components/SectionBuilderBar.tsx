import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { SectionId, useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface SectionBuilderBarProps {
  sectionId: SectionId;
  sectionIndex: number;
  totalSections: number;
  label: string;
  hint?: string;
}

export const SectionBuilderBar: React.FC<SectionBuilderBarProps> = ({
  sectionId,
  sectionIndex,
  totalSections,
  label,
}) => {
  const {
    isBuilderMode,
    activeSection,
    setActiveSection,
    moveSection,
    setDraggedItem,
    draggedItem,
  } = useStudioBuilder();

  const [isDragOverSection, setIsDragOverSection] = useState(false);

  // Do not show a section bar in the top header/home hero section
  if (!isBuilderMode || sectionId === 'lineup') return null;

  const isSelected = activeSection === sectionId;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        setDraggedItem({ type: 'section', sectionId, fromIndex: sectionIndex });
      }}
      onDragEnd={() => {
        setDraggedItem(null);
        setIsDragOverSection(false);
      }}
      onDragOver={(e) => {
        if (draggedItem?.type === 'section' && draggedItem.sectionId !== sectionId) {
          e.preventDefault();
          setIsDragOverSection(true);
        }
      }}
      onDragLeave={() => setIsDragOverSection(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOverSection(false);
        if (draggedItem?.type === 'section' && draggedItem.fromIndex !== sectionIndex) {
          soundFx.playPop();
          moveSection(draggedItem.fromIndex, sectionIndex);
        }
        setDraggedItem(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        soundFx.playTick();
        setActiveSection(sectionId);
      }}
      className={`absolute top-4 right-6 lg:right-12 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-mono-numbers font-bold uppercase tracking-wider transition-all select-none cursor-pointer z-30 ${
        isDragOverSection
          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500 shadow-md opacity-100'
          : isSelected
          ? 'border-[#111111] bg-[#111111] text-white shadow-sm opacity-95'
          : 'border-neutral-200 bg-white/90 text-neutral-500 opacity-60 hover:opacity-100 hover:border-neutral-400 hover:text-[#111111]'
      }`}
    >
      <GripVertical className="h-3 w-3 opacity-60 cursor-grab active:cursor-grabbing" />
      <span>
        Section 0{sectionIndex + 1}: {label}
      </span>
      <div
        className="flex items-center gap-0.5 pl-1.5 border-l border-current/20"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={sectionIndex === 0}
          onClick={() => {
            soundFx.playTick();
            moveSection(sectionIndex, sectionIndex - 1);
          }}
          className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
          title="Move section up"
        >
          <ArrowUp className="h-2.5 w-2.5" />
        </button>
        <button
          type="button"
          disabled={sectionIndex === totalSections - 1}
          onClick={() => {
            soundFx.playTick();
            moveSection(sectionIndex, sectionIndex + 1);
          }}
          className="p-0.5 hover:text-emerald-400 disabled:opacity-25 cursor-pointer"
          title="Move section down"
        >
          <ArrowDown className="h-2.5 w-2.5" />
        </button>
      </div>
    </div>
  );
};
