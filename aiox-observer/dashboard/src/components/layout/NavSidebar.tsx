import { Monitor, Play, Target, BarChart3, ScrollText } from 'lucide-react';

type ViewType = 'monitor' | 'workflows' | 'missions' | 'analytics' | 'logs';

interface NavSidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navItems: Array<{ id: ViewType; label: string; icon: React.ReactNode }> = [
  { id: 'monitor', label: 'Agent Monitor', icon: <Monitor className="w-5 h-5" /> },
  { id: 'workflows', label: 'Workflow Commander', icon: <Play className="w-5 h-5" /> },
  { id: 'missions', label: 'Mission Control', icon: <Target className="w-5 h-5" /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { id: 'logs', label: 'Event Log', icon: <ScrollText className="w-5 h-5" /> },
];

export default function NavSidebar({ activeView, onViewChange }: NavSidebarProps) {
  return (
    <div className="w-16 flex flex-col items-center py-2 gap-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className={`p-3 rounded-lg transition-all duration-200 hover:bg-hud-surface/50 ${
            activeView === item.id
              ? 'text-hud-cyan border-l-2 border-hud-cyan bg-hud-surface/30'
              : 'text-hud-text-muted hover:text-hud-text'
          }`}
          title={item.label}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
