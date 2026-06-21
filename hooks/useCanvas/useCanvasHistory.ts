'use client';

import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';

type UseCanvasHistoryProps = {
  events: EventsCanvas;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
};

export function useCanvasHistory({ events, setElements }: UseCanvasHistoryProps) {
  const { past, future, undo, redo } = useHistoryStore();

  const handleUndo = () => {
    const previousElements = undo();
    if (!previousElements) return;

    setElements(previousElements);
    events.handleReplaceBoard(previousElements);
  };

  const handleRedo = () => {
    const nextElements = redo();
    if (!nextElements) return;

    setElements(nextElements);
    events.handleReplaceBoard(nextElements);
  };

  return {
    canUndo: past.length > 0,
    canRedo: future.length > 0,
    handleUndo,
    handleRedo,
  };
}
