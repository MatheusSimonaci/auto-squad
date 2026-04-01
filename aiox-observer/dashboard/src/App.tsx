import { useGameData } from './hooks/useGameData';
import CommandCenter from './components/layout/CommandCenter';

export default function App() {
  useGameData(); // fetch initial state and set up WebSocket

  return (
    <CommandCenter />
  );
}
