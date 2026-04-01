import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { Agent } from '../../types';

interface AgentDetailDrawerProps {
  agent: Agent;
  onClose: () => void;
}

export default function AgentDetailDrawer({ agent, onClose }: AgentDetailDrawerProps) {
  const { events } = useGameStore();
  const agentEvents = events.filter(e => e.agent_hint === agent.name).slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center">
      <div className="hud-panel w-96 max-h-96 rounded-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-hud-border/30">
          <h3 className="text-sm font-semibold text-hud-cyan">{agent.name}</h3>
          <button
            onClick={onClose}
            className="text-hud-text-muted hover:text-hud-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* Info */}
          <div className="space-y-2">
            <div>
              <p className="text-xs text-hud-text-muted">Persona</p>
              <p className="text-sm text-hud-text">{agent.persona}</p>
            </div>
            <div>
              <p className="text-xs text-hud-text-muted">Status</p>
              <p className="text-sm text-hud-text capitalize">{agent.status}</p>
            </div>
            <div>
              <p className="text-xs text-hud-text-muted">Squad</p>
              <p className="text-sm text-hud-text capitalize">{agent.squad}</p>
            </div>
          </div>

          {/* Current Task */}
          {agent.currentTask && (
            <div>
              <p className="text-xs text-hud-text-muted">Current Task</p>
              <p className="text-sm text-hud-text">{agent.currentTask}</p>
            </div>
          )}

          {/* Recent Events */}
          {agentEvents.length > 0 && (
            <div>
              <p className="text-xs text-hud-text-muted mb-2">Recent Activity</p>
              <div className="space-y-1">
                {agentEvents.map((event) => (
                  <div key={event.id} className="text-xs text-hud-text-dim bg-hud-surface/30 p-2 rounded">
                    <p className="font-mono">{event.type}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
