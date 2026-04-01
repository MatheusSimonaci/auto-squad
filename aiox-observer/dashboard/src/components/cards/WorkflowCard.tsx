import React, { useState } from 'react';
import Card from './Card';
import CardBack from './CardBack';
import type { Card as CardType } from '../../types';

interface WorkflowCardProps {
  workflow?: CardType;
  card?: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
}

export default function WorkflowCard({ workflow, card, onClick, selected }: WorkflowCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardData = workflow || card;

  if (!cardData) return null;

  const handleClick = () => {
    if (onClick) {
      onClick(cardData);
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return isFlipped ? (
    <CardBack card={cardData} onFlip={() => setIsFlipped(false)} />
  ) : (
    <Card card={cardData} onFlip={handleClick} />
  );
}
