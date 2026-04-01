import { useState } from 'react';
import StatusBar from './StatusBar';
import NavSidebar from './NavSidebar';
import DataPanel from './DataPanel';
import EventStream from '../panels/EventStream';
import AgentMonitor from '../panels/AgentMonitor';
import WorkflowCommander from '../panels/WorkflowCommander';
import MissionControl from '../panels/MissionControl';
import AnalyticsPanel from '../panels/AnalyticsPanel';

type ViewType = 'monitor' | 'workflows' | 'missions' | 'analytics' | 'logs';

export default function CommandCenter() {
  const [activeView, setActiveView] = useState<ViewType>('monitor');

  const renderViewport = () => {
    switch (activeView) {
      case 'monitor':
        return <AgentMonitor />;
      case 'workflows':
        return <WorkflowCommander />;
      case 'missions':
        return <MissionControl />;
      case 'analytics':
        return <AnalyticsPanel />;
      case 'logs':
        return <div className="p-6 text-hud-text-muted">Event Log - Phase 5</div>;
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-hud-bg text-hud-text hud-grid-bg hud-scanlines relative">
      {/* Status Bar */}
      <StatusBar />

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <NavSidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Main Viewport */}
        <main className="flex-1 overflow-auto">
          {renderViewport()}
        </main>

        {/* Right Data Panel */}
        <DataPanel />
      </div>

      {/* Bottom Event Stream */}
      <EventStream />
    </div>
  );
}
