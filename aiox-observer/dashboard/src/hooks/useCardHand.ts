import { useState, useCallback } from 'react';
import type { Card } from '../types';
import { WORKFLOWS, MENTOR_CARDS, MARKETING_CARDS } from '../data/workflows';

interface HandState {
  deck: Card['deck'];
  cards: Card[];
  selectedCardId: string | null;
  playedCards: Card[];
}

const DECK_CARDS: Record<Card['deck'], Card[]> = {
  aiox: WORKFLOWS,
  mentors: MENTOR_CARDS,
  marketing: MARKETING_CARDS,
};

export function useCardHand() {
  const [hand, setHand] = useState<HandState>({
    deck: 'aiox',
    cards: WORKFLOWS,
    selectedCardId: null,
    playedCards: [],
  });

  const selectDeck = useCallback((deck: Card['deck']) => {
    setHand((prev) => ({
      ...prev,
      deck,
      cards: DECK_CARDS[deck],
      selectedCardId: null,
    }));
  }, []);

  const selectCard = useCallback((cardId: string) => {
    setHand((prev) => ({
      ...prev,
      selectedCardId: prev.selectedCardId === cardId ? null : cardId,
    }));
  }, []);

  const playCard = useCallback((cardId: string) => {
    setHand((prev) => {
      const card = prev.cards.find((c) => c.id === cardId);
      if (!card) return prev;

      return {
        ...prev,
        cards: prev.cards.filter((c) => c.id !== cardId),
        playedCards: [...prev.playedCards, card],
        selectedCardId: null,
      };
    });
  }, []);

  const discardCard = useCallback((cardId: string) => {
    setHand((prev) => ({
      ...prev,
      cards: prev.cards.filter((c) => c.id !== cardId),
      selectedCardId: null,
    }));
  }, []);

  const resetHand = useCallback(() => {
    setHand({
      deck: 'aiox',
      cards: WORKFLOWS,
      selectedCardId: null,
      playedCards: [],
    });
  }, []);

  return {
    hand,
    selectDeck,
    selectCard,
    playCard,
    discardCard,
    resetHand,
  };
}
