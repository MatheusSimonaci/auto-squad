import { useState } from 'react';
import { WORKFLOWS, MENTOR_CARDS, MARKETING_CARDS } from '../../data/workflows';
import WorkflowTile from './WorkflowTile';
import type { Card } from '../../types';

type CategoryFilter = 'aiox' | 'advisors' | 'marketing';

export default function WorkflowCommander() {
  const [category, setCategory] = useState<CategoryFilter>('aiox');

  const cardsByCategory: Record<CategoryFilter, Card[]> = {
    aiox: WORKFLOWS,
    advisors: MENTOR_CARDS,
    marketing: MARKETING_CARDS,
  };

  const cards = cardsByCategory[category];

  return (
    <div className="p-6 space-y-6">
      {/* Category Tabs */}
      <div className="flex gap-3 border-b border-hud-border/30">
        {(['aiox', 'advisors', 'marketing'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 border-b-2 transition-colors text-sm font-semibold ${
              category === cat
                ? 'border-hud-cyan text-hud-cyan'
                : 'border-transparent text-hud-text-muted hover:text-hud-text'
            }`}
          >
            {cat === 'aiox' ? 'Workflows' : cat === 'advisors' ? 'Advisors' : 'Marketing'}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <WorkflowTile key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
