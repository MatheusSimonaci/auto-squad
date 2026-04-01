import { useMemo } from 'react';
import { Wrench, Users, BookOpen, AlertCircle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

const getEventIcon = (type: string) => {
  if (type.includes('tool')) return <Wrench className="w-4 h-4" />;
  if (type.includes('agent')) return <Users className="w-4 h-4" />;
  if (type.includes('story')) return <BookOpen className="w-4 h-4" />;
  if (type.includes('error')) return <AlertCircle className="w-4 h-4" />;
  return <Wrench className="w-4 h-4" />;
};

const getEventColor = (type: string) => {
  if (type.includes('error')) return 'text-hud-red';
  if (type.includes('tool')) return 'text-hud-blue';
  if (type.includes('agent')) return 'text-hud-amber';
  if (type.includes('story')) return 'text-hud-green';
  return 'text-hud-text-muted';
};

export default function EventStream() {
  const { events } = useGameStore();
  const recentEvents = useMemo(() => events.slice(0, 10), [events]);

  return (
    <div className="h-48 border-t border-hud-border/50 hud-panel m-2 rounded-none rounded-b-lg overflow-hidden flex flex-col">
      <div className="p-3 border-b border-hud-border/30">
        <p className="text-xs font-mono text-hud-text-muted uppercase">Event Stream</p>
      </div>
      <div className="flex-1 overflow-auto p-3 space-y-2 text-xs">
        {recentEvents.length === 0 ? (
          <p className="text-hud-text-dim">Waiting for events...</p>
        ) : (
          recentEvents.map((event) => (
            <div key={event.id} className="flex gap-2 items-start hud-data-in">
              <span className={`mt-0.5 ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </span>
              <span className="text-hud-text-dim font-mono flex-shrink-0">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
              <div className="flex-1 flex gap-2 items-center">
                <span className="px-1.5 py-0.5 rounded bg-hud-surface text-hud-text-muted uppercase text-xs">
                  {event.type.substring(0, 8)}
                </span>
                {event.agent_hint && (
                  <span className="text-hud-cyan">{event.agent_hint}</span>
                )}
                {event.tool_name && (
                  <span className="text-hud-text-dim truncate">({event.tool_name})</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
