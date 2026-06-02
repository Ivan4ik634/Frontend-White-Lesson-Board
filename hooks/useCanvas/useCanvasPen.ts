import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef } from 'react';

export interface PenPoint {
  x: number;
  y: number;
}

export interface PenPath {
  id: string;
  points: PenPoint[];
}

interface Props {
  zoom: number;
  tool: BoardTool;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
  elements: ElementT[];
}

export const useCanvasPen = ({ zoom, elements, events, tool, canvasRef, setElements }: Props) => {
  const pathIdRef = useRef('');
  const isDrawingRef = useRef(false);

  const handlePenStart = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pen') return;

    const point = getWorld({ e, zoom, canvasRef });

    if (!point) return;

    const id = crypto.randomUUID();
    pathIdRef.current = id;
    isDrawingRef.current = true;

    const element: ElementT = {
      id,
      type: 'pen',
      points: [point],
    };

    setElements((prev) => [...prev, element]);

    await events.handleCreateElement(element);
  };

  const handlePenMove = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pen') return;
    if (!isDrawingRef.current) return;

    const point = getWorld({ e, zoom, canvasRef });
    if (!point) return;

    const id = pathIdRef.current;

    const current = elements.find((el) => el.id === id && el.type === 'pen');

    if (!current || current.type !== 'pen') return;

    const updatedElement: ElementT = {
      ...current,
      points: [...current.points, point],
    };

    setElements((prev) =>
      prev.map((el) => (el.id === id && el.type === 'pen' ? updatedElement : el)),
    );

    await events.handleUpdateElement(updatedElement);
  };

  const handlePenEnd = () => {
    isDrawingRef.current = false;
    pathIdRef.current = '';
  };

  return {
    isDrawingRef,
    handlePenStart,
    handlePenMove,
    handlePenEnd,
  };
};
