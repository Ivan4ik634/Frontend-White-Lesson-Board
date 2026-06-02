import { ElementT, EventsCanvas } from '@/types/Element';
import { useEffect, useRef } from 'react';

interface Props {
  elements: ElementT[];
  selectedElementIds: string[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  setSelectedElementIds: React.Dispatch<React.SetStateAction<string[]>>;
  events: EventsCanvas;
}
export const useCanvasCopied = ({
  elements,
  events,
  setElements,
  setSelectedElementIds,
  selectedElementIds,
}: Props) => {
  const copiedRef = useRef<ElementT[]>([]);
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'c' && e.ctrlKey) {
        const copied = elements.filter((el) => selectedElementIds.includes(el.id));

        copiedRef.current = copied;
      }
      if (e.key.toLowerCase() === 'v' && e.ctrlKey) {
        const cloned = copiedRef.current.map((el) => {
          if (el.type === 'pen')
            return {
              ...el,
              id: crypto.randomUUID(),
              points: el.points.map((p) => ({ ...p, x: p.x + 20, y: p.y + 20 })),
            };
          return {
            ...el,
            id: crypto.randomUUID(),
            x: el.x + 20,
            y: el.y + 20,
          };
        });
        setElements((prev) => [...prev, ...cloned]);

        setSelectedElementIds(cloned.map((el) => el.id));

        for (let i = 0; i < cloned.length; i++) {
          await events.handleCreateElement(cloned[i]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [elements, selectedElementIds, events]);
};
