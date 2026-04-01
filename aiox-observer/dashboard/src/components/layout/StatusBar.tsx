import { useState, useEffect } from 'react';
import { Cpu, Circle } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export default function StatusBar() {
  const { session, agents, events, connectionStatus } = useGameStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const agentCounts = {
    active: agents.filter(a => a.status === 'active').length,
    idle: agents.filter(a => a.status === 'idle').length,
    waiting: agents.filter(a => a.status === 'waiting').length,
    done: agents.filter(a => a.status === 'done').length,
  };

  return (
    <div className="h-14 border-b border-hud-border/50 hud-panel m-2 mt-2 mb-0 rounded-none rounded-t-lg px-4 flex items-center justify-between">
      {/* Left: System Name */}
      <div className="flex items-center gap-3">
        <Cpu className="w-5 h-5 text-hud-cyan" />
        <span className="font-mono text-sm font-semibold text-hud-text">ORION</span>
        <span className="text-xs text-hud-text-muted">Session: {session.id.substring(0, 8)}</span>
      </div>

      {/* Center: Agent Summary */}
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 fill-hud-green text-hud-green" />
          <span className="text-hud-text-muted">{agentCounts.active} Active</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 text-hud-text-dim" />
          <span className="text-hud-text-muted">{agentCounts.idle} Idle</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 fill-hud-amber text-hud-amber" />
          <span className="text-hud-text-muted">{agentCounts.waiting} Waiting</span>
        </div>
      </div>

      {/* Right: Status & Time */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <Circle
            className={`w-2.5 h-2.5 ${
              connectionStatus === 'connected'
                ? 'fill-hud-green text-hud-green animate-pulse'
                : connectionStatus === 'reconnecting'
                  ? 'fill-hud-amber text-hud-amber animate-pulse'
                  : 'fill-hud-red text-hud-red'
            }`}
          />
          <span
            className={`font-semibold ${
              connectionStatus === 'connected'
                ? 'text-hud-green'
                : connectionStatus === 'reconnecting'
                  ? 'text-hud-amber'
                  : 'text-hud-red'
            }`}
          >
            {connectionStatus.toUpperCase()}
          </span>
        </div>
        <span className="text-hud-text-muted">{events.length} events</span>
        <span className="text-hud-text-dim font-mono">{time.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}
