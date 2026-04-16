import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameStore } from '../store/gameStore';
import type { Event, Agent, Story } from '../types';

const WS_URL = 'http://localhost:7433';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { addEvent, updateAgent, addStory, setSession, setState, setConnectionStatus } = useGameStore();

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return;

    const socket = io(WS_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
    });

    socket.on('connect', () => {
      console.log('[WS] connected:', socket.id);
      setConnectionStatus('connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('[WS] disconnected:', reason);
      setConnectionStatus('disconnected');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('disconnected');
    });

    socket.on('reconnect_attempt', () => {
      setConnectionStatus('reconnecting');
    });

    socket.on('state', (state) => {
      setState(state);
    });

    socket.on('event', (event: Event) => {
      addEvent(event);
    });

    socket.on('agent:update', (agent: Agent) => {
      updateAgent(agent.id, agent);
    });

    socket.on('story:update', (story: Story) => {
      addStory(story);
    });

    socket.on('session', (session: { id: string; cwd: string; started_at: number }) => {
      setSession(session);
    });

    socketRef.current = socket;
  }, [addEvent, updateAgent, addStory, setSession, setState, setConnectionStatus]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [connect]);

  return socketRef;
}
