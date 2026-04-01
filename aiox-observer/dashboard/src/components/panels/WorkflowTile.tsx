import { Zap, BookOpen, ClipboardList, Home, PlusCircle } from 'lucide-react';
import type { Card } from '../../types';

interface WorkflowTileProps {
  card: Card;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  'book': <BookOpen className="w-5 h-5" />,
  'clipboard': <ClipboardList className="w-5 h-5" />,
  'home': <Home className="w-5 h-5" />,
  'plus': <PlusCircle className="w-5 h-5" />,
};

export default function WorkflowTile({ card }: WorkflowTileProps) {
  const icon = ICON_MAP[card.icon || 'zap'] || <Zap className="w-5 h-5" />;

  return (
    <div className="hud-panel p-4 rounded-lg hover:border-hud-cyan/40 hover:bg-hud-surface/60 transition-all cursor-pointer group">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-lg bg-hud-surface/50 flex items-center justify-center group-hover:bg-hud-surface transition-colors text-hud-cyan">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-hud-text truncate">{card.name}</h3>
          <p className="text-xs text-hud-text-muted line-clamp-2">{card.description}</p>
        </div>
        <div className="flex-shrink-0 text-right">
          <div className="text-lg font-bold text-hud-cyan">{card.cost}</div>
          <div className="text-xs text-hud-text-dim">pts</div>
        </div>
      </div>

      {/* Agents Row */}
      {card.agents.length > 0 && (
        <div className="mt-3 flex gap-1">
          {card.agents.slice(0, 4).map((agentId) => (
            <div
              key={agentId}
              className="w-6 h-6 rounded-full bg-hud-surface border border-hud-border/50 flex items-center justify-center text-xs font-mono text-hud-text-muted"
              title={agentId}
            >
              {agentId.charAt(0).toUpperCase()}
            </div>
          ))}
          {card.agents.length > 4 && (
            <div className="w-6 h-6 rounded-full bg-hud-surface/50 flex items-center justify-center text-xs font-mono text-hud-text-dim">
              +{card.agents.length - 4}
            </div>
          )}
        </div>
      )}

      {/* Execute Button */}
      <button className="mt-3 w-full py-2 bg-hud-cyan/20 hover:bg-hud-cyan/30 border border-hud-cyan/40 rounded text-xs font-semibold text-hud-cyan transition-colors">
        Execute
      </button>
    </div>
  );
}
