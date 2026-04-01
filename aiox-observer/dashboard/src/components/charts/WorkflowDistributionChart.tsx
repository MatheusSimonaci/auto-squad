import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';
import { chartTheme } from './chartTheme';

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b'];

export default function WorkflowDistributionChart() {
  const { eventsBySquad } = useAnalytics();

  return (
    <div className="hud-panel p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-hud-cyan mb-4">Squad Distribution</h3>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={eventsBySquad}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {eventsBySquad.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip {...chartTheme.tooltip} />
          <Legend wrapperStyle={{ color: '#e2e8f0', fontFamily: 'JetBrains Mono', fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
