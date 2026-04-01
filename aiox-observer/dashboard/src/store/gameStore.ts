import { create } from 'zustand';
import type { GameState, Agent, Story, Event } from '../types';

interface GameStore extends GameState {
  setSession: (session: GameState['session']) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addStory: (story: Story) => void;
  addEvent: (event: Event) => void;
  setActiveWorkflow: (workflow: string) => void;
  setState: (state: GameState) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  session: { id: '', cwd: '', started_at: 0 },
  agents: [],
  stories: [],
  events: [],
  activeWorkflow: undefined,

  setSession: (session) => set({ session }),
  addAgent: (agent) => set((state) => ({
    agents: [...state.agents, agent],
  })),
  updateAgent: (id, updates) => set((state) => ({
    agents: state.agents.map((a) => (a.id === id ? { ...a, ...updates } : a)),
  })),
  addStory: (story) => set((state) => ({
    stories: [...state.stories, story],
  })),
  addEvent: (event) => set((state) => ({
    events: [event, ...state.events.slice(0, 49)], // keep 50 recent
  })),
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
  setState: (state) => set(state),
}));
