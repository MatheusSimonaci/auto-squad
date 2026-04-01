import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { AIOX_AGENTS } from '../../types';
import AgentCard from '../cards/AgentCard';
import AgentInteract from '../ui/AgentInteract';

const DEFAULT_AGENTS = AIOX_AGENTS.map((a) => ({ ...a, status: 'idle' as const }));

export default function Battlefield() {
  const storeAgents = useGameStore((s) => s.agents);
  const agents = storeAgents.length > 0 ? storeAgents : DEFAULT_AGENTS;
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const selectedAgentData = agents.find((a) => a.id === selectedAgent);

  return (
    <div className="flex-1 flex flex-col bg-card/30 rounded-lg border border-border-card/50 p-6">
      <h3 className="text-sm font-bold text-gold mb-4">🗡️ TABULEIRO</h3>

      <div className="flex-1 grid grid-cols-4 gap-4 auto-rows-max content-start">
        {agents.length === 0 ? (
          <p className="text-gray-500 col-span-4">Aguardando agentes...</p>
        ) : (
          agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onClick={() => setSelectedAgent(agent.id)}
            />
          ))
        )}
      </div>

      {selectedAgentData && (
        <AgentInteract agent={selectedAgentData} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
