import { useState, useCallback, useEffect } from 'react';
import type { Card } from '../types';
import { WORKFLOWS, MENTOR_CARDS, MARKETING_CARDS } from '../data/workflows';

interface HandState {
  deck: Card['deck'];
  cards: Card[];
  selectedCardId: string | null;
  playedCards: Card[];
}

const STATIC_DECK_CARDS: Record<Exclude<Card['deck'], 'squads'>, Card[]> = {
  aiox: WORKFLOWS,
  mentors: MENTOR_CARDS,
  marketing: MARKETING_CARDS,
};

export function useCardHand() {
  const [squadWorkflows, setSquadWorkflows] = useState<Card[]>([]);
  const [hand, setHand] = useState<HandState>({
    deck: 'aiox',
    cards: WORKFLOWS,
    selectedCardId: null,
    playedCards: [],
  });

  useEffect(() => {
    fetch('http://localhost:7433/api/workflows')
      .then((r) => r.json())
      .then((data) => { if (data.workflows?.length) setSquadWorkflows(data.workflows); })
      .catch(() => {});
  }, []);

  const selectDeck = useCallback((deck: Card['deck']) => {
    setHand((prev) => ({
      ...prev,
      deck,
      cards: deck === 'squads' ? squadWorkflows : STATIC_DECK_CARDS[deck as Exclude<Card['deck'], 'squads'>],
      selectedCardId: null,
    }));
  }, [squadWorkflows]);

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
