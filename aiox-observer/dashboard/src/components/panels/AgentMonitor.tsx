import { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import AgentTile from './AgentTile';
import AgentDetailDrawer from './AgentDetailDrawer';
import type { Agent } from '../../types';

export default function AgentMonitor() {
  const { agents } = useGameStore();
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-hud-cyan mb-4">Agent Roster</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {agents.map((agent) => (
            <AgentTile
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent)}
            />
          ))}
        </div>
      </div>

      {/* Detail Drawer */}
      {selectedAgent && (
        <AgentDetailDrawer agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
