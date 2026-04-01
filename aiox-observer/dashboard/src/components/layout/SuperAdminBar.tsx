import React from 'react';
import { useGameStore } from '../../store/gameStore';

export default function SuperAdminBar() {
  const session = useGameStore((s) => s.session);
  const eventCount = useGameStore((s) => s.events.length);

  return (
    <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b-2 border-gold px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-3xl">👑</span>
          <h1 className="text-2xl font-bold">ORION [SUPER-ADMIN]</h1>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <span>📜 Session #{session.id.slice(-4) || '0'}</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            LIVE
          </span>
          <span className="text-gray-400">{eventCount} events</span>
        </div>
      </div>
    </div>
  );
}
