import { useGameStore } from '../../store/gameStore';

export default function DataPanel() {
  const { agents, stories } = useGameStore();

  const activeStories = stories.filter(s => s.status === 'active').length;
  const totalStories = stories.length;

  return (
    <div className="w-80 border-l border-hud-border/50 hud-panel m-2 rounded-none flex flex-col overflow-hidden">
      {/* Metrics */}
      <div className="p-4 border-b border-hud-border/30 space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-hud-text-muted font-mono">Total Agents</p>
          <p className="text-2xl font-semibold text-hud-cyan">{agents.length}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-hud-text-muted font-mono">Active Missions</p>
          <p className="text-2xl font-semibold text-hud-green">{activeStories}/{totalStories}</p>
        </div>
      </div>

      {/* Placeholder content */}
      <div className="flex-1 overflow-auto p-4 text-xs text-hud-text-muted">
        <p>File List & Checklist</p>
        <p className="text-xs text-hud-text-dim mt-2">Phase 3+: Integrated here</p>
      </div>
    </div>
  );
}
