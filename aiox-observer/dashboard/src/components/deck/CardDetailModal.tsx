import React from 'react';
import type { Card } from '../../types';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
}

export default function CardDetailModal({ card, onClose }: CardDetailModalProps) {
  if (!card) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-card border border-border-card rounded-xl p-6 max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold">{card.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg">&times;</button>
        </div>
        {card.icon && <div className="text-4xl text-center mb-3">{card.icon}</div>}
        <p className="text-sm text-gray-300 mb-3">{card.description}</p>
        {card.flavor && <p className="text-xs text-gray-500 italic mb-3">"{card.flavor}"</p>}
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span>Cost: <span className="text-gold">{card.cost}</span></span>
          <span>Type: <span className="text-mana-blue">{card.type}</span></span>
        </div>
        {card.agents.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {card.agents.map((a) => (
              <span key={a} className="text-xs bg-border-card px-2 py-0.5 rounded text-gray-300">{a}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
