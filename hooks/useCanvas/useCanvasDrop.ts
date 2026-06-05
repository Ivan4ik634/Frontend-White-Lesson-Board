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
    isDragging: boolean;
    elementId: string;
    startMouse: { x: number; y: number };
    startElement?: { x: number; y: number };
    startPoints?: { x: number; y: number }[];
  }>({
    isDragging: false,
    elementId: '',
    startMouse: { x: 0, y: 0 },
    startElement: { x: 0, y: 0 },
    startPoints: [],
  });

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
        isDragging: true,
        elementId: hit.id,

        startMouse: { x, y },

        startPoints: hit.points,
      };

      return;
    }

    transformRef.current = {
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
    } else {
      updatedElement = {
        ...current,
        x: transformRef.current.startElement!.x + dx,
        y: transformRef.current.startElement!.y + dy,
      };
    }

    setElements((prev) => prev.map((el) => (el.id === id ? updatedElement : el)));

    await events.handleUpdateElement(updatedElement);
  };
  const handleUpdateObjectUp = () => {
    const id = transformRef.current.elementId;

    transformRef.current = {
      isDragging: false,
      elementId: '',
      startMouse: { x: 0, y: 0 },
      startElement: { x: 0, y: 0 },
      startPoints: [],
    };

    setSelectedElementMove('');
    setSelectedElementIds(id ? [id] : []);
  };

  return {
    handleUpdateObjectDown,
    selectedElementMove,
    handleUpdateObjectMove,
    handleUpdateObjectUp,
  };
};
