import React from 'react';
import type { Agent } from '../../types';

interface AgentInteractProps {
  agent: Agent;
  onClose?: () => void;
}

const statusLabel: Record<Agent['status'], string> = {
  idle: 'Idle',
  active: 'Active',
  waiting: 'Waiting',
  done: 'Done',
};

const statusColor: Record<Agent['status'], string> = {
  idle: 'text-gray-400',
  active: 'text-health-green',
  waiting: 'text-gold',
  done: 'text-mana-blue',
};

export default function AgentInteract({ agent, onClose }: AgentInteractProps) {
  return (
    <div className="bg-card border border-border-card rounded-xl p-4 w-64">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{agent.icon}</span>
          <div>
            <div className="text-sm font-semibold text-white">{agent.name}</div>
            <div className="text-xs text-gray-400">{agent.persona}</div>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-white text-lg">&times;</button>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs font-mono mb-3">
        <span className="text-gray-500">Status:</span>
        <span className={statusColor[agent.status]}>{statusLabel[agent.status]}</span>
      </div>

      {agent.currentTask && (
        <div className="text-xs text-gray-400 bg-board rounded p-2">
          <span className="text-gray-500 block mb-1">Current task:</span>
          {agent.currentTask}
        </div>
      )}

      <div className="mt-3 text-xs text-gray-600 font-mono">
        Squad: <span className="text-gray-400">{agent.squad}</span>
      </div>
    </div>
  );
}
