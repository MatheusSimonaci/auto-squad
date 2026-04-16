import { useMemo } from 'react';
import { useGameStore } from '../store/gameStore';

export function useAnalytics() {
  const { events, agents } = useGameStore();

  const eventsByTimeBucket = useMemo(() => {
    const buckets: Record<number, Record<string, number>> = {};
    const now = Date.now();
    const fiveMinMs = 5 * 60 * 1000;

    events.forEach((event) => {
      const bucket = Math.floor(event.timestamp / fiveMinMs) * fiveMinMs;
      if (!buckets[bucket]) buckets[bucket] = {};
      const agentName = event.agent_hint || 'unknown';
      buckets[bucket][agentName] = (buckets[bucket][agentName] || 0) + 1;
    });

    return Object.entries(buckets)
      .map(([bucket, counts]) => ({
        time: new Date(parseInt(bucket)).toLocaleTimeString(),
        total: Object.values(counts).reduce((s, n) => s + n, 0),
        ...counts,
      }))
      .sort((a, b) => a.time.localeCompare(b.time))
      .slice(-12);
  }, [events]);

  const eventsBySquad = useMemo(() => {
    const squads: Record<string, number> = { aiox: 0, mentors: 0, marketing: 0 };
    events.forEach((e) => {
      if (e.squad_hint in squads) squads[e.squad_hint]++;
    });
    return [
      { name: 'AIOX', value: squads.aiox },
      { name: 'Mentors', value: squads.mentors },
      { name: 'Marketing', value: squads.marketing },
    ];
  }, [events]);

  const eventsPerMinute = useMemo(() => {
    if (events.length === 0) return 0;
    const oneMinMs = 60 * 1000;
    const recentEvents = events.filter((e) => Date.now() - e.timestamp < oneMinMs);
    return Math.round((recentEvents.length / 1) * 10) / 10;
  }, [events]);

  const agentActivityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    agents.forEach((a) => {
      counts[a.name] = events.filter((e) => e.agent_hint === a.name).length;
    });
    return counts;
  }, [events, agents]);

  return {
    eventsByTimeBucket,
    eventsBySquad,
    eventsPerMinute,
    agentActivityCounts,
    totalEvents: events.length,
  };
}
