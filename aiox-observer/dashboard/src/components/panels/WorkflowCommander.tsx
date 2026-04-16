import { useState, useEffect } from 'react';
import WorkflowTile from './WorkflowTile';
import type { Card } from '../../types';

export default function WorkflowCommander() {
  const [workflows, setWorkflows] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:7433/api/workflows')
      .then((r) => r.json())
      .then((data) => {
        if (data.workflows?.length) setWorkflows(data.workflows);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-hud-cyan">Squad Workflows</h2>
        <span className="text-xs text-hud-text-muted font-mono">{workflows.length} workflows</span>
      </div>

      {loading ? (
        <p className="text-hud-text-dim text-sm">Loading workflows...</p>
      ) : workflows.length === 0 ? (
        <p className="text-hud-text-dim text-sm">No squad workflows found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((card) => (
            <WorkflowTile key={card.id} card={card} />
          ))}
        </div>
      )}
    </div>
  );
}
