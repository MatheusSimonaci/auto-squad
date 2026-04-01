import { useGameStore } from '../../store/gameStore';
import MissionCard from './MissionCard';

export default function MissionControl() {
  const { stories } = useGameStore();

  const byStatus = {
    draft: stories.filter(s => s.status === 'draft'),
    active: stories.filter(s => s.status === 'active'),
    done: stories.filter(s => s.status === 'done'),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Active Missions */}
      {byStatus.active.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-hud-green mb-4">Active Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {byStatus.active.map((story) => (
              <MissionCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {/* Draft Missions */}
      {byStatus.draft.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-hud-amber mb-4">Planned Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {byStatus.draft.map((story) => (
              <MissionCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Missions */}
      {byStatus.done.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-hud-blue mb-4">Completed Missions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {byStatus.done.map((story) => (
              <MissionCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}

      {stories.length === 0 && (
        <p className="text-center text-hud-text-muted py-8">No missions yet</p>
      )}
    </div>
  );
}
