import { create } from 'zustand';
import type { GameState, Agent, Story, Event } from '../types';

type ConnectionStatus = 'connected' | 'disconnected' | 'reconnecting';

interface GameStore extends GameState {
  connectionStatus: ConnectionStatus;
  setSession: (session: GameState['session']) => void;
  addAgent: (agent: Agent) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addStory: (story: Story) => void;
  addEvent: (event: Event) => void;
  setActiveWorkflow: (workflow: string) => void;
  setConnectionStatus: (status: ConnectionStatus) => void;
  setState: (state: GameState) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  session: { id: '', cwd: '', started_at: 0 },
  agents: [],
  stories: [],
  events: [],
  activeWorkflow: undefined,
  connectionStatus: 'disconnected',

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
    events: [event, ...state.events.slice(0, 199)], // keep 200 recent
  })),
  setActiveWorkflow: (workflow) => set({ activeWorkflow: workflow }),
  setConnectionStatus: (status) => set({ connectionStatus: status }),
  setState: (state) => set(state),
}));
