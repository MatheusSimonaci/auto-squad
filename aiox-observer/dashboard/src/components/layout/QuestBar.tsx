import React from 'react';
import { useGameStore } from '../../store/gameStore';
import StoryCard from '../cards/StoryCard';

export default function QuestBar() {
  const stories = useGameStore((s) => s.stories.filter((st) => st.status === 'active'));

  return (
    <div className="border-b border-border-card/50 px-6 py-4">
      <h3 className="text-sm font-bold text-gold mb-3">📜 QUESTS ATIVAS</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {stories.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma quest ativa</p>
        ) : (
          stories.map((story) => <StoryCard key={story.id} story={story} />)
        )}
      </div>
    </div>
  );
}
