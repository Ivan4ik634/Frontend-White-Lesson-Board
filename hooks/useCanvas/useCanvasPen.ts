import { BoardTool } from '@/components/board/BoardToolRail';
import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef } from 'react';

interface Props {
  zoom: number;
  tool: BoardTool;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
  elements: ElementT[];
  color: string;
}

export const useCanvasPen = ({
  zoom,
  color,
  elements,
  events,
  tool,
  canvasRef,
  setElements,
}: Props) => {
  const pathIdRef = useRef('');
  const objectRef = useRef<ElementT | null>(null);
  const isDrawingRef = useRef(false);

  const { push } = useHistoryStore();

  const handlePenStart = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pen') return;

    const point = getWorld({ e, zoom, canvasRef });

    if (!point) return;

    const id = crypto.randomUUID();

    pathIdRef.current = id;
    isDrawingRef.current = true;

    const element: ElementT = {
      id,
      color,
      type: 'pen',
      points: [point],
    };
    objectRef.current = element;

    setElements((prev) => [element, ...prev]);
    await events.handleCreateElement(element);
  };

  const handlePenMove = async (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'pen') return;
    if (!isDrawingRef.current) return;

    const point = getWorld({ e, zoom, canvasRef });

    if (!point) return;

    const id = pathIdRef.current;

    let updatedElement: ElementT | null = null;

    setElements((prev) => {
      const current = prev.find((el) => el.id === id && el.type === 'pen');

      if (!current || current.type !== 'pen') {
        return prev;
      }

      updatedElement = {
        ...current,
        points: [...current.points, point],
      };

      return prev.map((el) => (el.id === id ? updatedElement! : el));
    });

    if (updatedElement) {
      events.handleUpdateElement(updatedElement);
    }
  };

  const handlePenEnd = () => {
    push({
      type: 'UPDATE',
      id: objectRef.current!.id,
      before: objectRef.current!,
      after: elements.find((el) => el.id === objectRef.current!.id)!,
    });

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
