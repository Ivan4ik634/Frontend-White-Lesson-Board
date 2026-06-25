import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { useEffect, useRef } from 'react';
import { useCanvasHistory } from './useCanvasHistory';

interface Props {
  elements: ElementT[];
  selectedElementIds: string[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  setSelectedElementIds: React.Dispatch<React.SetStateAction<string[]>>;
  events: EventsCanvas;
}

export const useCanvasHotKeys = ({
  elements,
  events,
  setElements,
  setSelectedElementIds,
  selectedElementIds,
}: Props) => {
  const copiedRef = useRef<ElementT[]>([]);

  const elementsRef = useRef(elements);
  const selectedRef = useRef(selectedElementIds);

  const { handleRedo, handleUndo } = useCanvasHistory({
    events,
    setElements,
  });

  const { push } = useHistoryStore();

  useEffect(() => {
    elementsRef.current = elements;
  }, [elements]);

  useEffect(() => {
    selectedRef.current = selectedElementIds;
  }, [selectedElementIds]);

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      const isTyping =
        (e.target as HTMLElement)?.tagName === 'TEXTAREA' ||
        (e.target as HTMLElement)?.tagName === 'INPUT' ||
        (e.target as HTMLElement)?.isContentEditable;

      if (isTyping) return;

      // undo
      if (e.key.toLowerCase() === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // redo
      if (e.key.toLowerCase() === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // copy
      if (e.key.toLowerCase() === 'c' && (e.ctrlKey || e.metaKey)) {
        const copied = elementsRef.current.filter((el) => selectedRef.current.includes(el.id));

        copiedRef.current = copied;
        return;
      }

      // paste
      if (e.key.toLowerCase() === 'v' && (e.ctrlKey || e.metaKey)) {
        const cloned = copiedRef.current.map((el) => {
          if (el.type === 'pen')
            return {
              ...el,
              id: crypto.randomUUID(),
              points: el.points.map((p) => ({
                ...p,
                x: p.x + 20,
                y: p.y + 20,
              })),
            };
          if (el.type === 'line')
            return {
              ...el,
              id: crypto.randomUUID(),
              x1: el.x1 + 20,
              y1: el.y1 + 20,
              x2: el.x2 + 20,
              y2: el.y2 + 20,
            };
          return {
            ...el,
            id: crypto.randomUUID(),
            x: el.x + 20,
            y: el.y + 20,
          };
        });

        setElements((prev) => {
          const next = [...prev, ...cloned];

          return next;
        });
        for (const el of cloned) {
          push({ type: 'CREATE', element: el });
        }
        setSelectedElementIds(cloned.map((el) => el.id));

        await events.handleCreateElements(cloned);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [events, setElements, setSelectedElementIds, handleUndo, handleRedo, push]);
};
