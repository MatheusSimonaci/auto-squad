import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../../types';

interface PlayedCardsPanelProps {
  playedCards: Card[];
  onCardRemove?: (cardId: string) => void;
}

export default function PlayedCardsPanel({ playedCards, onCardRemove }: PlayedCardsPanelProps) {
  if (playedCards.length === 0) {
    return (
      <div className="bg-card/30 rounded-lg border border-border-card/50 p-4 flex items-center justify-center h-24">
        <p className="text-gray-500 text-sm">No cards played yet</p>
      </div>
    );
  }

  return (
    <div className="bg-card/30 rounded-lg border border-border-card/50 p-4">
      <h4 className="text-sm font-bold text-gold mb-3">🎯 CARDS PLAYED ({playedCards.length})</h4>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
        {playedCards.map((card, index) => (
          <motion.div
            key={`${card.id}-${index}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-border-card/30 rounded p-2 text-xs flex justify-between items-center hover:bg-border-card/50 transition-colors"
          >
            <div className="flex-1">
              <div className="font-bold text-gold text-xs truncate">{card.name}</div>
              <div className="text-gray-400 text-xs flex items-center gap-1">
                <span>{card.icon}</span>
                <span className="font-mono">{card.cost}⚡</span>
              </div>
            </div>
            {onCardRemove && (
              <button
                onClick={() => onCardRemove(card.id)}
                className="ml-2 text-gray-400 hover:text-red-400 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            )}
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-3 pt-3 border-t border-border-card/30 text-xs text-gray-400 flex justify-between">
        <span>Total Cost: <span className="text-gold font-mono">{playedCards.reduce((sum, c) => sum + c.cost, 0)}⚡</span></span>
        <span>Total Points: <span className="text-gold font-mono">{playedCards.reduce((sum, c) => sum + (c.stats?.points || 0), 0)}</span></span>
      </div>
    </div>
  );
}
