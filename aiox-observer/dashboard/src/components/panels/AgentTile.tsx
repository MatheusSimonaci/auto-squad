import {
  Code, ShieldCheck, Landmark, BarChart3, CheckCircle, Workflow,
  Search, Database, Palette, Settings, User
} from 'lucide-react';
import type { Agent } from '../../types';

interface AgentTileProps {
  agent: Agent;
  onClick: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  dev: <Code className="w-6 h-6" />,
  qa: <ShieldCheck className="w-6 h-6" />,
  architect: <Landmark className="w-6 h-6" />,
  pm: <BarChart3 className="w-6 h-6" />,
  po: <CheckCircle className="w-6 h-6" />,
  sm: <Workflow className="w-6 h-6" />,
  analyst: <Search className="w-6 h-6" />,
  'data-engineer': <Database className="w-6 h-6" />,
  ux: <Palette className="w-6 h-6" />,
  devops: <Settings className="w-6 h-6" />,
};

export default function AgentTile({ agent, onClick }: AgentTileProps) {
  const statusColor = {
    active: 'status-ring-active',
    idle: 'status-ring-idle',
    waiting: 'status-ring-waiting',
    done: 'status-ring-done',
  }[agent.status] || 'status-ring-idle';

  const statusBgColor = {
    active: 'bg-hud-green/10',
    idle: 'bg-hud-text-dim/10',
    waiting: 'bg-hud-amber/10',
    done: 'bg-hud-blue/10',
  }[agent.status] || 'bg-hud-text-dim/10';

  const statusTextColor = {
    active: 'text-hud-green',
    idle: 'text-hud-text-dim',
    waiting: 'text-hud-amber',
    done: 'text-hud-blue',
  }[agent.status] || 'text-hud-text-dim';

  return (
    <button
      onClick={onClick}
      className={`hud-panel p-4 rounded-lg hover:border-hud-cyan/40 hover:bg-hud-surface/60 transition-all cursor-pointer ${statusBgColor}`}
    >
      {/* Status Ring */}
      <div className="flex justify-center mb-3">
        <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${statusColor} text-hud-text`}>
          {ICON_MAP[agent.id] || <User className="w-6 h-6" />}
        </div>
      </div>

      {/* Agent Info */}
      <p className="text-sm font-semibold text-hud-text text-center truncate">{agent.name}</p>
      <p className="text-xs text-hud-text-muted text-center truncate">{agent.persona}</p>

      {/* Current Task */}
      {agent.currentTask && (
        <p className="text-xs text-hud-text-dim mt-2 text-center truncate line-clamp-1">
          {agent.currentTask}
        </p>
      )}

      {/* Status Badge */}
      <div className="mt-3 flex justify-center">
        <span className={`text-xs font-mono px-2 py-1 rounded ${statusTextColor} ${statusBgColor}`}>
          {agent.status}
        </span>
      </div>
    </button>
  );
}
