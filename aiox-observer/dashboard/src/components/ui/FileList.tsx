import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function FileList() {
  const { stories } = useGameStore();
  const doneStories = stories.filter((s) => s.status === 'done');

  if (doneStories.length === 0) {
    return (
      <div className="text-xs text-gray-600 font-mono p-2">No completed stories.</div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {doneStories.map((story) => (
        <div key={story.id} className="flex items-center gap-2 text-xs font-mono">
          <span className="text-health-green">✓</span>
          <span className="text-gray-300 truncate">{story.title}</span>
          <span className="text-gray-600 ml-auto">{story.id}</span>
        </div>
      ))}
    </div>
  );
}
