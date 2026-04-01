import React from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../../types';

interface CardBackProps {
  card: Card;
  onFlip?: () => void;
}

export default function CardBack({ card, onFlip }: CardBackProps) {
  return (
    <motion.div
      className={`card-back ${card.deck} w-64 h-80 cursor-pointer`}
      onClick={onFlip}
      initial={{ rotateY: 180 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 p-4 rounded-lg bg-gradient-to-br from-card to-card/80 border-2 border-gold">
        <div className="flex flex-col h-full">
          <h3 className="font-bold text-lg mb-4">{card.name} — Details</h3>

          <div className="flex-1 overflow-y-auto text-sm space-y-3">
            <div>
              <p className="text-gold font-bold mb-1">Type</p>
              <p className="text-gray-300">{card.type}</p>
            </div>

            <div>
              <p className="text-gold font-bold mb-1">Agents</p>
              <p className="text-gray-300">{card.agents.join(', ')}</p>
            </div>

            {card.flavor && (
              <div>
                <p className="text-gold font-bold mb-1">Flavor</p>
                <p className="italic text-gray-400">{card.flavor}</p>
              </div>
            )}

            <div>
              <p className="text-gold font-bold mb-1">Description</p>
              <p className="text-gray-300">{card.description}</p>
            </div>
          </div>

          <button
            onClick={onFlip}
            className="mt-4 w-full py-2 bg-mana-blue rounded hover:bg-blue-600 text-white text-sm font-bold"
          >
            ← Back
          </button>
        </div>
      </div>
    </motion.div>
  );
}
