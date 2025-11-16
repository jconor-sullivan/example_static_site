import React from 'react';
import { ParametricPill } from '../App';

interface PillDisplayProps {
  pills: ParametricPill[];
  onRemovePill: (pillId: string) => void;
  documents: any[];
  savedNests: any[];
}

export function PillDisplay(props: PillDisplayProps) {
  if (props.pills.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" style={{ color: 'var(--md-on-surface)' }}>
      {props.pills.map((pill) => (
        <div
          key={pill.id}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-full"
          style={{ backgroundColor: 'var(--md-surface)' }}
        >
          <span className="text-sm font-medium">{pill.value}</span>
          <button
            onClick={() => props.onRemovePill(pill.id)}
            className="text-lg font-bold hover:text-red-500"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
