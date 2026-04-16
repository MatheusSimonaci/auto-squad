import React, { useState } from 'react';
import type { Card } from '../../types';

interface DeckSelectorProps {
  selected?: Card['deck'];
  onSelect?: (deck: Card['deck']) => void;
}

const decks: { id: Card['deck']; label: string; color: string }[] = [
  { id: 'aiox', label: 'AIOX', color: 'text-mana-blue' },
  { id: 'mentors', label: 'Mentors', color: 'text-glow-mentor' },
  { id: 'marketing', label: 'Marketing', color: 'text-glow-market' },
  { id: 'squads', label: 'Squads', color: 'text-yellow-400' },
];

export default function DeckSelector({ selected: selectedProp, onSelect }: DeckSelectorProps) {
  const [internalSelected, setInternalSelected] = useState<Card['deck']>('aiox');
  const selected = selectedProp ?? internalSelected;

  const handleSelect = (deck: Card['deck']) => {
    setInternalSelected(deck);
    onSelect?.(deck);
  };

  return (
    <div className="flex gap-2">
      {decks.map((deck) => (
        <button
          key={deck.id}
          onClick={() => handleSelect(deck.id)}
          className={`text-xs font-mono px-3 py-1 rounded border transition-all ${
            selected === deck.id
              ? `border-current ${deck.color} bg-card`
              : 'border-border-card text-gray-500 hover:text-gray-300'
          }`}
        >
          {deck.label}
        </button>
      ))}
    </div>
  );
}
