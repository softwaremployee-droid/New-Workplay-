import React, { useState, useRef, useEffect } from 'react';
import { Pencil, Check } from 'lucide-react';
import { useStudioBuilder } from '../context/StudioBuilderContext';
import { soundFx } from '../utils/sound';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  className?: string;
  multiline?: boolean;
  label?: string;
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Tag = 'span',
  className = '',
  multiline = false,
  label,
}) => {
  const { isBuilderMode } = useStudioBuilder();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  if (!isBuilderMode) {
    return <Tag className={className}>{value}</Tag>;
  }

  const handleSave = () => {
    setIsEditing(false);
    if (draft.trim() !== value) {
      soundFx.playPop();
      onChange(draft);
    }
  };

  if (isEditing) {
    return (
      <span
        className="relative inline-flex items-center gap-1.5 w-full max-w-full z-30"
        onClick={(e) => e.stopPropagation()}
      >
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setDraft(value);
                setIsEditing(false);
              } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSave();
              }
            }}
            rows={3}
            className={`w-full rounded-xl bg-white text-[#111111] border-2 border-emerald-500 px-3 py-2 shadow-lg focus:outline-none ${className}`}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              } else if (e.key === 'Escape') {
                setDraft(value);
                setIsEditing(false);
              }
            }}
            className={`w-full rounded-xl bg-white text-[#111111] border-2 border-emerald-500 px-2.5 py-1 shadow-lg focus:outline-none ${className}`}
          />
        )}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="h-7 w-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md cursor-pointer hover:bg-emerald-600"
          title="Save text"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
      </span>
    );
  }

  return (
    <Tag
      onClick={(e) => {
        e.stopPropagation();
        soundFx.playTick();
        setIsEditing(true);
      }}
      title={label ? `Click to edit ${label}` : 'Click to edit text'}
      className={`${className} group/edit relative cursor-text rounded-lg transition-all hover:ring-2 hover:ring-emerald-500/60 hover:bg-emerald-500/5 px-1 -mx-1`}
    >
      {value}
      <span className="inline-flex items-center gap-1 ml-1.5 px-1.5 py-0.5 rounded-full bg-[#111111] text-emerald-400 text-[9px] font-mono-numbers font-bold uppercase tracking-wider opacity-0 group-hover/edit:opacity-100 transition-opacity align-middle pointer-events-none shadow-xs">
        <Pencil className="h-2.5 w-2.5" />
        <span>Edit</span>
      </span>
    </Tag>
  );
};
