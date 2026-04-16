import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAnalytics } from '../../hooks/useAnalytics';
import { chartTheme } from './chartTheme';

export default function AgentActivityChart() {
  const { eventsByTimeBucket } = useAnalytics();

  return (
    <div className="hud-panel p-4 rounded-lg">
      <h3 className="text-sm font-semibold text-hud-cyan mb-4">Execution Timeline</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={eventsByTimeBucket}>
          <defs>
            <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.cartesianAxis.stroke} />
          <XAxis dataKey="time" {...chartTheme.cartesianAxis} />
          <YAxis {...chartTheme.cartesianAxis} />
          <Tooltip {...chartTheme.tooltip} />
          <Area type="monotone" dataKey="total" stroke="#06b6d4" fill="url(#colorActivity)" name="Events" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
