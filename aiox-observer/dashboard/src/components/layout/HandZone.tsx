import React from 'react';
import { motion } from 'framer-motion';
import { useCardHand } from '../../hooks/useCardHand';
import CardHand from '../deck/CardHand';
import DeckSelector from '../deck/DeckSelector';
import type { Card } from '../../types';

interface HandZoneProps {
  onCardPlayed?: (card: Card) => void;
}

export default function HandZone({ onCardPlayed }: HandZoneProps) {
  const { hand, selectDeck, selectCard, playCard, discardCard } = useCardHand();
  const selectedCardObj = hand.cards.find((c) => c.id === hand.selectedCardId) || null;

  const handleDeckSelect = (deck: typeof hand.deck) => {
    selectDeck(deck);
  };

  const handlePlayCard = (card: typeof selectedCardObj) => {
    if (card) {
      playCard(card.id);
      onCardPlayed?.(card);
    }
  };

  const handleDiscardCard = (card: typeof selectedCardObj) => {
    if (card) {
      discardCard(card.id);
    }
  };

  return (
    <div className="border-t border-border-card/50 bg-gradient-to-t from-board/80 to-card/30 px-6 py-4 flex flex-col gap-4 h-96">
      {/* Deck Selector Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-gold">⚙️ DECK SELECTOR:</span>
          <DeckSelector selected={hand.deck} onSelect={handleDeckSelect} />
        </div>
        {hand.playedCards.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-green-400 flex items-center gap-2"
          >
            <span className="animate-pulse">●</span>
            {hand.playedCards.length} cards played
          </motion.div>
        )}
      </div>

      {/* Card Hand */}
      <CardHand
        deck={hand.deck}
        selectedCard={selectedCardObj}
        onCardClick={(card) => selectCard(card.id)}
        onPlayCard={handlePlayCard}
        onDiscardCard={handleDiscardCard}
      />
    </div>
  );
}
