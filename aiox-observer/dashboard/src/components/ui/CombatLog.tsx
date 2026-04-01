import React from 'react';
import { useGameStore } from '../../store/gameStore';

const typeColors: Record<string, string> = {
  tool_use: 'text-mana-blue',
  agent_switch: 'text-gold',
  story_update: 'text-health-green',
  error: 'text-red-400',
};

const squadIcons: Record<string, string> = {
  aiox: '⚙',
  mentors: '🧠',
  marketing: '📈',
};

export default function CombatLog() {
  const { events } = useGameStore();

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-600 text-xs font-mono p-4">
        No events yet...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {events.map((event) => {
        const color = typeColors[event.type] ?? 'text-gray-400';
        const icon = squadIcons[event.squad_hint] ?? '·';
        const time = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        return (
          <div key={event.id} className="flex items-start gap-2 text-xs font-mono py-0.5">
            <span className="text-gray-600 flex-shrink-0 w-16">{time}</span>
            <span className="flex-shrink-0">{icon}</span>
            <span className={`${color} flex-shrink-0`}>{event.type}</span>
            {event.tool_name && (
              <span className="text-gray-400 truncate">{event.tool_name}</span>
            )}
            {event.agent_hint && (
              <span className="text-gray-500 truncate">@{event.agent_hint}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
