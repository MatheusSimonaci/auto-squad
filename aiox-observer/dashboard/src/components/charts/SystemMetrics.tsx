import { useGameStore } from '../../store/gameStore';
import { useAnalytics } from '../../hooks/useAnalytics';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartTheme } from './chartTheme';

export default function SystemMetrics() {
  const { agents, stories } = useGameStore();
  const { eventsPerMinute, totalEvents } = useAnalytics();

  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const completedStories = stories.filter((s) => s.status === 'done').length;
  const totalStories = stories.length;

  // Simple sparkline data
  const sparklineData = [
    { value: 2 },
    { value: 4 },
    { value: 3 },
    { value: 6 },
    { value: 5 },
    { value: 7 },
    { value: 4 },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* Active Agents */}
      <div className="hud-panel p-3 rounded-lg">
        <p className="text-xs text-hud-text-muted mb-1">Active Agents</p>
        <p className="text-2xl font-bold text-hud-green">{activeAgents}</p>
        <p className="text-xs text-hud-text-dim">{agents.length} total</p>
      </div>

      {/* Events/min */}
      <div className="hud-panel p-3 rounded-lg">
        <p className="text-xs text-hud-text-muted mb-1">Events/min</p>
        <p className="text-2xl font-bold text-hud-cyan">{eventsPerMinute}</p>
        <p className="text-xs text-hud-text-dim">{totalEvents} total</p>
      </div>

      {/* Story Progress */}
      <div className="hud-panel p-3 rounded-lg">
        <p className="text-xs text-hud-text-muted mb-1">Stories Done</p>
        <p className="text-2xl font-bold text-hud-blue">
          {completedStories}/{totalStories}
        </p>
        <p className="text-xs text-hud-text-dim">
          {totalStories > 0 ? Math.round((completedStories / totalStories) * 100) : 0}%
        </p>
      </div>

      {/* Sparkline */}
      <div className="hud-panel p-3 rounded-lg">
        <p className="text-xs text-hud-text-muted mb-2">Activity</p>
        <ResponsiveContainer width="100%" height={40}>
          <BarChart data={sparklineData}>
            <Bar dataKey="value" fill="#06b6d4" radius={1} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
