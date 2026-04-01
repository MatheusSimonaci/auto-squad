import React from 'react';
import { useGameStore } from '../../store/gameStore';

interface AcItem {
  id: string;
  label: string;
  done: boolean;
}

interface AcChecklistProps {
  items?: AcItem[];
  title?: string;
}

export default function AcChecklist({ items, title = 'Acceptance Criteria' }: AcChecklistProps) {
  const stories = useGameStore((s) => s.stories);

  const resolvedItems: AcItem[] = items ?? stories
    .filter((s) => s.status === 'active')
    .flatMap((s) =>
      s.agents.map((agent, i) => ({
        id: `${s.id}-${i}`,
        label: `${agent} — ${s.title}`,
        done: s.progress >= 100,
      }))
    );

  const doneCount = resolvedItems.filter((i) => i.done).length;

  if (resolvedItems.length === 0) {
    return (
      <p className="text-xs text-gray-600 font-mono">No active criteria</p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">{title}</span>
        <span className="text-xs font-mono text-health-green">{doneCount}/{resolvedItems.length}</span>
      </div>
      {resolvedItems.map((item) => (
        <div key={item.id} className="flex items-start gap-2 text-xs">
          <span className={item.done ? 'text-health-green' : 'text-gray-600'}>
            {item.done ? '☑' : '☐'}
          </span>
          <span className={item.done ? 'text-gray-400 line-through' : 'text-gray-300'}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
