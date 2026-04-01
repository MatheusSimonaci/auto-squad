import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../../types';

interface CardProps {
  card: Card;
  onFlip?: () => void;
  isFlipped?: boolean;
}

export default function Card({ card, onFlip, isFlipped }: CardProps) {
  return (
    <motion.div
      className={`card ${card.deck} w-64 h-80 cursor-pointer relative`}
      whileHover={{ y: -24, scale: 1.08 }}
      onClick={onFlip}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="absolute inset-0 p-4 rounded-lg bg-gradient-to-br from-card to-card/80 border-2 border-border-card">
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-bold text-gold">{card.cost} ⚡</span>
          <span className="text-xl">{card.icon}</span>
        </div>

        <div className="h-32 bg-border-card/30 rounded mb-4 flex items-center justify-center">
          <span className="text-lg opacity-50">[{card.type.toUpperCase()}]</span>
        </div>

        <h3 className="font-bold text-lg mb-2">{card.name}</h3>
        <p className="text-sm text-gray-300 mb-4 h-12 overflow-hidden">
          {card.description}
        </p>

        {card.stats && (
          <div className="flex justify-between text-xs text-gold">
            <span>⚡ {card.stats.points}pts</span>
            <span>🏆 {card.stats.type}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
