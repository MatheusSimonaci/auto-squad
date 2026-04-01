import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { useWebSocket } from './useWebSocket';

const API_URL = 'http://localhost:3000';

export function useGameData() {
  const { setState } = useGameStore();
  const socketRef = useWebSocket();

  useEffect(() => {
    async function fetchInitialState() {
      try {
        const res = await fetch(`${API_URL}/api/state`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setState(data);
      } catch (err) {
        console.warn('[useGameData] Could not fetch initial state:', err);
      }
    }

    fetchInitialState();
  }, [setState]);

  return socketRef;
}
