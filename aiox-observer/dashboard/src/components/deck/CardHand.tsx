import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { Card as CardType } from '../../types';
import { WORKFLOWS, MENTOR_CARDS, MARKETING_CARDS } from '../../data/workflows';
import WorkflowCard from '../cards/WorkflowCard';
import MentorCard from '../cards/MentorCard';
import MarketingCard from '../cards/MarketingCard';

interface CardHandProps {
  deck: CardType['deck'];
  selectedCard: CardType | null;
  onCardClick: (card: CardType) => void;
  onPlayCard?: (card: CardType) => void;
  onDiscardCard?: (card: CardType) => void;
}

const ALL_CARDS: CardType[] = [...WORKFLOWS, ...MENTOR_CARDS, ...MARKETING_CARDS];

export default function CardHand({
  deck,
  selectedCard,
  onCardClick,
  onPlayCard,
  onDiscardCard,
}: CardHandProps) {
  const cards = useMemo(() => ALL_CARDS.filter((c) => c.deck === deck), [deck]);
  const cardCount = cards.length;

  const renderCard = (card: CardType, index: number) => {
    const isSelected = selectedCard?.id === card.id;
    const baseProps = {
      key: card.id,
      card,
      onClick: () => onCardClick(card),
      selected: isSelected,
    };

    if (deck === 'aiox') return <WorkflowCard {...baseProps} />;
    if (deck === 'mentors') return <MentorCard {...baseProps} />;
    return <MarketingCard {...baseProps} />;
  };

  return (
    <div className="w-full flex flex-col gap-3 h-full">
      {/* Selected Card Details */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-card/80 to-card/60 rounded-lg border border-border-card/70 p-4"
        >
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gold mb-1">{selectedCard.name}</h3>
              <p className="text-xs text-gray-300 mb-2">{selectedCard.description}</p>
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <span className="text-gold">⚡</span>
                  <span className="font-mono">{selectedCard.cost}</span>
                </span>
                {selectedCard.stats && (
                  <span className="flex items-center gap-1">
                    <span>🏆</span>
                    <span className="font-mono">{selectedCard.stats.points}pts</span>
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onPlayCard && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPlayCard(selectedCard)}
                  className="px-4 py-2 bg-glow-aiox text-white rounded font-mono text-xs font-bold hover:brightness-110 transition-all"
                >
                  ▶ PLAY
                </motion.button>
              )}
              {onDiscardCard && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onDiscardCard(selectedCard)}
                  className="px-4 py-2 bg-gray-600 text-white rounded font-mono text-xs font-bold hover:bg-gray-500 transition-all"
                >
                  ✕ DISCARD
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Card Hand Arc */}
      <div className="flex-1 flex items-end justify-center overflow-hidden">
        <div className="relative h-full flex items-end gap-2 px-4">
          {cardCount === 0 ? (
            <div className="text-center text-gray-500 w-full">
              <p className="text-sm">No cards in {deck} deck</p>
            </div>
          ) : (
            cards.map((card, index) => {
              const isSelected = selectedCard?.id === card.id;
              const angle = (index - cardCount / 2) * (cardCount > 1 ? 15 : 0);
              const yOffset = isSelected ? -40 : 0;

              return (
                <motion.div
                  key={card.id}
                  style={{
                    rotate: angle,
                    transformOrigin: 'bottom center',
                  }}
                  animate={{
                    y: yOffset,
                    scale: isSelected ? 1.08 : 1,
                    zIndex: isSelected ? 50 : index,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="cursor-pointer"
                >
                  {renderCard(card, index)}
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* Hand Stats */}
      <div className="text-xs text-gray-400 flex justify-center gap-4 px-4">
        <span>Cards in hand: {cardCount}</span>
        {selectedCard && (
          <span className="text-gold">
            Cost: <span className="font-mono">{selectedCard.cost}⚡</span>
          </span>
        )}
      </div>
    </div>
  );
}
