import React, { useState } from 'react';
import SuperAdminBar from './SuperAdminBar';
import QuestBar from './QuestBar';
import Battlefield from './Battlefield';
import ResultsPanel from './ResultsPanel';
import HandZone from './HandZone';
import type { Card } from '../../types';

export default function GameBoard() {
  const [playedCards, setPlayedCards] = useState<Card[]>([]);

  const handleCardPlayed = (card: Card) => {
    setPlayedCards((prev) => [...prev, card]);
  };

  return (
    <div className="flex flex-col h-screen bg-board text-white">
      {/* Header: Orion */}
      <SuperAdminBar />

      {/* Active Quests */}
      <QuestBar />

      {/* Main Battlefield + Results */}
      <div className="flex-1 flex gap-4 overflow-hidden px-4 py-4">
        <Battlefield />
        <ResultsPanel playedCards={playedCards} />
      </div>

      {/* Card Hand */}
      <HandZone onCardPlayed={handleCardPlayed} />
    </div>
  );
}
