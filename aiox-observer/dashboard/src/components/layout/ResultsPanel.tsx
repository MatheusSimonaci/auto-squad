import React from 'react';
import CombatLog from '../ui/CombatLog';
import FileList from '../ui/FileList';
import AcChecklist from '../ui/AcChecklist';
import PlayedCardsPanel from './PlayedCardsPanel';
import type { Card } from '../../types';

interface ResultsPanelProps {
  playedCards?: Card[];
}

export default function ResultsPanel({ playedCards = [] }: ResultsPanelProps) {
  return (
    <div className="w-80 flex flex-col gap-4 overflow-hidden">
      {/* Played Cards */}
      <PlayedCardsPanel playedCards={playedCards} />

      {/* Files */}
      <div className="bg-card/30 rounded-lg border border-border-card/50 p-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-bold text-gold mb-3">📁 FILES MODIFIED</h4>
        <FileList />
      </div>

      {/* AC Checklist */}
      <div className="bg-card/30 rounded-lg border border-border-card/50 p-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-bold text-gold mb-3">✓ AC CHECKLIST</h4>
        <AcChecklist />
      </div>

      {/* Combat Log */}
      <div className="bg-card/30 rounded-lg border border-border-card/50 p-4 flex-1 overflow-y-auto">
        <h4 className="text-sm font-bold text-gold mb-3">🔴 COMBAT LOG</h4>
        <CombatLog />
      </div>
    </div>
  );
}
