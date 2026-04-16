export interface Card {
  id: string;
  name: string;
  type: 'workflow' | 'mentor' | 'marketing' | 'squad';
  cost: number;
  description: string;
  agents: string[];
  deck: 'aiox' | 'mentors' | 'marketing' | 'squads';
  icon?: string;
  flavor?: string;
  stats?: { points: number; type: string };
}

export interface Agent {
  id: string;
  name: string;
  persona: string;
  icon: string;
  status: 'idle' | 'active' | 'waiting' | 'done';
  currentTask?: string;
  squad: 'aiox' | 'mentors' | 'marketing';
}

export interface Story {
  id: string;
  title: string;
  status: 'draft' | 'active' | 'done';
  progress: number;
  agents: string[];
}

export interface Event {
  id: number;
  type: string;
  tool_name?: string;
  agent_hint?: string;
  squad_hint: 'aiox' | 'mentors' | 'marketing';
  timestamp: number;
}

export interface GameState {
  session: { id: string; cwd: string; started_at: number };
  agents: Agent[];
  stories: Story[];
  events: Event[];
  activeWorkflow?: string;
}

// Complete AIOX agent roster
export const AIOX_AGENTS = [
  { id: 'dev', name: 'Dex', persona: 'Dev', icon: '💻', squad: 'aiox' as const },
  { id: 'qa', name: 'Quinn', persona: 'QA', icon: '✅', squad: 'aiox' as const },
  { id: 'architect', name: 'Aria', persona: 'Architect', icon: '🏗️', squad: 'aiox' as const },
  { id: 'pm', name: 'Morgan', persona: 'PM', icon: '📊', squad: 'aiox' as const },
  { id: 'po', name: 'Pax', persona: 'PO', icon: '✔️', squad: 'aiox' as const },
  { id: 'sm', name: 'River', persona: 'Scrum Master', icon: '🌊', squad: 'aiox' as const },
  { id: 'analyst', name: 'Alex', persona: 'Analyst', icon: '🔍', squad: 'aiox' as const },
  { id: 'data-engineer', name: 'Dara', persona: 'Data Engineer', icon: '📦', squad: 'aiox' as const },
  { id: 'ux', name: 'Uma', persona: 'UX Designer', icon: '🎨', squad: 'aiox' as const },
  { id: 'devops', name: 'Gage', persona: 'DevOps', icon: '⚙️', squad: 'aiox' as const },
] as const;

export const STRATEGIC_MENTORS = [
  { id: 'elon', name: 'Elon Musk', persona: 'First Principles', icon: '🚀', squad: 'mentors' as const, domain: 'Urgency & Scale' },
  { id: 'jeff', name: 'Jeff Bezos', persona: 'Working Backwards', icon: '📦', squad: 'mentors' as const, domain: 'Long-term Vision' },
  { id: 'jobs', name: 'Steve Jobs', persona: 'Design Minimalist', icon: '🍎', squad: 'mentors' as const, domain: 'Product Excellence' },
  { id: 'alan', name: 'Alan Nicholas', persona: 'AI Applied', icon: '🤖', squad: 'mentors' as const, domain: 'AI Integration' },
  { id: 'tony', name: 'Tony Robbins', persona: 'Peak Performance', icon: '💪', squad: 'mentors' as const, domain: 'Human Potential' },
  { id: 'paulo', name: 'Paulo Vieira', persona: 'CIS Method', icon: '🧠', squad: 'mentors' as const, domain: 'Identity & Beliefs' },
  { id: 'jim', name: 'Jim Rohn', persona: 'Law of Sowing', icon: '🌱', squad: 'mentors' as const, domain: 'Philosophy' },
  { id: 'napoleon', name: 'Napoleon Hill', persona: 'Mastermind', icon: '👑', squad: 'mentors' as const, domain: 'Collective Vision' },
  { id: 'solomon', name: 'Rei Salomão', persona: 'Wisdom', icon: '📚', squad: 'mentors' as const, domain: 'Judgment & Justice' },
  { id: 'jesus', name: 'Jesus Cristo', persona: 'Servant Leadership', icon: '✨', squad: 'mentors' as const, domain: 'Dignity & Purpose' },
] as const;
