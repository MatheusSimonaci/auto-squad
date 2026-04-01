import type { Story } from '../../types';

interface MissionCardProps {
  story: Story;
}

export default function MissionCard({ story }: MissionCardProps) {
  const statusColor = {
    draft: 'border-hud-amber/30 bg-hud-amber/5',
    active: 'border-hud-green/30 bg-hud-green/5 ring-1 ring-hud-green/20',
    done: 'border-hud-blue/30 bg-hud-blue/5',
  }[story.status];

  const progressColor = {
    draft: 'bg-hud-amber',
    active: 'bg-hud-green',
    done: 'bg-hud-blue',
  }[story.status];

  return (
    <div className={`hud-panel p-4 rounded-lg border ${statusColor}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-hud-text truncate">{story.title}</h3>
          <p className="text-xs text-hud-text-muted">ID: {story.id}</p>
        </div>
        <span className={`text-xs font-mono px-2 py-1 rounded capitalize text-hud-text-muted`}>
          {story.status}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-hud-surface/50 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full ${progressColor} transition-all`}
          style={{ width: `${story.progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <p className="text-xs text-hud-text-muted mb-3">{story.progress}% Complete</p>

      {/* Agent Avatars */}
      {story.agents.length > 0 && (
        <div className="flex gap-1">
          {story.agents.slice(0, 5).map((agentId) => (
            <div
              key={agentId}
              className="w-5 h-5 rounded-full bg-hud-surface border border-hud-border/50 flex items-center justify-center text-xs font-mono text-hud-text-dim"
              title={agentId}
            >
              {agentId.charAt(0).toUpperCase()}
            </div>
          ))}
          {story.agents.length > 5 && (
            <div className="text-xs text-hud-text-dim">+{story.agents.length - 5}</div>
          )}
        </div>
      )}
    </div>
  );
}
