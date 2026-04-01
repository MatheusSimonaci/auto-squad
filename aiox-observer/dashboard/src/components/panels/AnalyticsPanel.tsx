import SystemMetrics from '../charts/SystemMetrics';
import AgentActivityChart from '../charts/AgentActivityChart';
import WorkflowDistributionChart from '../charts/WorkflowDistributionChart';

export default function AnalyticsPanel() {
  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics */}
      <SystemMetrics />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AgentActivityChart />
        <WorkflowDistributionChart />
      </div>
    </div>
  );
}
