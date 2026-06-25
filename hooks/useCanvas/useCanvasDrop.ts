import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { findHitElement, getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef, useState } from 'react';

interface Props {
  elements: ElementT[];
  canvasRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  setSelectedElementIds: React.Dispatch<React.SetStateAction<string[]>>;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  resizeRef: RefObject<{ isResizing: boolean }>;
  events: EventsCanvas;
}
export const useCanvasDrop = ({
  elements,
  setElements,
  setSelectedElementIds,
  canvasRef,
  events,
  zoom,
  resizeRef,
}: Props) => {
  const transformRef = useRef<{
    startEl: ElementT | null;
    isDragging: boolean;
    elementId: string;
    startMouse: { x: number; y: number };
    startElement?: { x: number; y: number };
    startPoints?: { x: number; y: number }[];
    startLine?: { x1: number; y1: number; x2: number; y2: number };
  }>({
    startEl: null,
    isDragging: false,
    elementId: '',
    startMouse: { x: 0, y: 0 },
    startElement: { x: 0, y: 0 },
    startPoints: [],
    startLine: { x1: 0, y1: 0, x2: 0, y2: 0 },
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
    if (!hit) {
      setSelectedElementIds([]);

      setSelectedElementMove('');

      return;
    }

    setSelectedElementMove(hit.id);

    if (hit.type === 'pen') {
      transformRef.current = {
        startEl: hit,
        isDragging: true,
        elementId: hit.id,

        startMouse: { x, y },

        startPoints: hit.points,
      };

      return;
    }
    if (hit.type === 'line') {
      transformRef.current = {
        startEl: hit,
        isDragging: true,
        elementId: hit.id,
        startMouse: { x, y },
        startLine: {
          x1: hit.x1,
          y1: hit.y1,
          x2: hit.x2,
          y2: hit.y2,
        },
      };

      return;
    }

    transformRef.current = {
      startEl: hit,
      isDragging: true,
      elementId: hit.id,

      startMouse: { x, y },

      startElement: {
        x: hit.x,
        y: hit.y,
      },
    };
  };
  const handleUpdateObjectMove = async (e: PointerEvent<HTMLDivElement>) => {
    if (!transformRef.current.isDragging) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const dx = x - transformRef.current.startMouse.x;
    const dy = y - transformRef.current.startMouse.y;

    const id = transformRef.current.elementId;

    const current = elements.find((el) => el.id === id);
    if (!current) return;

    let updatedElement = current;

    if (current.type === 'pen') {
      updatedElement = {
        ...current,
        points: transformRef.current.startPoints!.map((p) => ({
          x: p.x + dx,
          y: p.y + dy,
        })),
      };
    } else if (current.type === 'line') {
      updatedElement = {
        ...current,
        x1: transformRef.current.startLine!.x1 + dx,
        y1: transformRef.current.startLine!.y1 + dy,
        x2: transformRef.current.startLine!.x2 + dx,
        y2: transformRef.current.startLine!.y2 + dy,
      };
    } else {
      updatedElement = {
        ...current,
        x: transformRef.current.startElement!.x + dx,
        y: transformRef.current.startElement!.y + dy,
      };
    }

    setElements((prev) => {
      const next = prev.map((el) => (el.id === id ? updatedElement : el));
      return next;
    });

    events.handleUpdateElement(updatedElement);
  };
  const handleUpdateObjectUp = () => {
    const id = transformRef.current.elementId;
    push({
      type: 'UPDATE',
      id,
      before: transformRef.current.startEl!,
      after: elements.find((el) => el.id === id)!,
    });

    transformRef.current = {
      startEl: null,
      isDragging: false,
      elementId: '',
      startMouse: { x: 0, y: 0 },
      startElement: { x: 0, y: 0 },
      startPoints: [],
      startLine: { x1: 0, y1: 0, x2: 0, y2: 0 },
    };

    setSelectedElementMove('');
    setSelectedElementIds(id ? [id] : []);
  };

  return {
    selectedElementMove,
    handleUpdateObjectDown,
    handleUpdateObjectMove,
    handleUpdateObjectUp,
  };
};
