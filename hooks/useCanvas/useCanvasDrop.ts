import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { findHitElement, getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef, useState } from 'react';

interface Props {
  elements: ElementT[];
  canvasRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  setSelectedElementIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedElementIds: string[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  resizeRef: RefObject<{ isResizing: boolean }>;
  events: EventsCanvas;
}
export const useCanvasDrop = ({
  elements,
  setElements,
  setSelectedElementIds,
  selectedElementIds,
  canvasRef,
  events,
  zoom,
  resizeRef,
}: Props) => {
  const transformRef = useRef<{
    isDragging: boolean;
    startMouse: { x: number; y: number };
    startElements: ElementT[];
  }>({
    isDragging: false,
    startMouse: { x: 0, y: 0 },
    startElements: [],
  });

  const { push } = useHistoryStore();
  const [selectedElementMove, setSelectedElementMove] = useState('');

  const handleUpdateObjectDown = (e: PointerEvent<HTMLDivElement>) => {
    if (resizeRef.current.isResizing) return;

    const { x, y } = getWorld({
      e,
      zoom,
      canvasRef,
    });

    const hit = findHitElement({
      x,
      y,
      elements,
    });

    if (selectedElementIds.includes(hit?.id!)) {
      transformRef.current = {
        isDragging: true,
        startMouse: { x, y },

        startElements: selectedElementIds
          .map((id) => elements.find((el) => el.id === id)!)
          .filter(Boolean),
      };
      return;
    }
    if (!hit) {
      setSelectedElementIds([]);

      setSelectedElementMove('');

      return;
    }

    transformRef.current = {
      isDragging: true,

      startMouse: { x, y },

      startElements: [hit],
    };
  };
  const handleUpdateObjectMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!transformRef.current.isDragging) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const dx = x - transformRef.current.startMouse.x;
    const dy = y - transformRef.current.startMouse.y;

    const startElements = transformRef.current.startElements;
    if (!startElements) return;

    const updated = startElements.map((el) => {
      if (el.type === 'line') {
        return {
          ...el,
          x1: el.x1 + dx,
          y1: el.y1 + dy,
          x2: el.x2 + dx,
          y2: el.y2 + dy,
        };
      }

      if (el.type === 'pen') {
        return {
          ...el,
          points: el.points.map((p) => ({
            x: p.x + dx,
            y: p.y + dy,
          })),
        };
      }

      return {
        ...el,
        x: el.x + dx,
        y: el.y + dy,
      };
    });

    setElements((prev) => {
      const map = new Map(updated.map((el) => [el.id, el]));

      return prev.map((el) => map.get(el.id) ?? el);
    });

    updated.forEach((el) => {
      events.handleUpdateElement(el);
    });
  };
  const handleUpdateObjectUp = () => {
    const start = transformRef.current.startElements;
    const end = elements;

    start.forEach((el) => {
      push({
        type: 'UPDATE',
        id: el.id,
        before: el,
        after: end.find((e) => e.id === el.id)!,
      });
    });

    setSelectedElementMove('');

    setSelectedElementIds(start.map((el) => el.id));

    transformRef.current = {
      isDragging: false,
      startMouse: { x: 0, y: 0 },
      startElements: [],
    };
  };

  return {
    selectedElementMove,
    handleUpdateObjectDown,
    handleUpdateObjectMove,
    handleUpdateObjectUp,
  };
};
