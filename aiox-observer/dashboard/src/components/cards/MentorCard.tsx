import React, { useState } from 'react';
import Card from './Card';
import CardBack from './CardBack';
import type { Card as CardType } from '../../types';

interface MentorCardProps {
  mentor?: CardType;
  card?: CardType;
  onClick?: (card: CardType) => void;
  selected?: boolean;
}

export default function MentorCard({ mentor, card, onClick, selected }: MentorCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardData = mentor || card;

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
