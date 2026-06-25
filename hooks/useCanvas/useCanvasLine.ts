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
export const useCanvasLine = ({
  zoom,
  tool,
  setElements,
  canvasRef,
  events,
  elements,
  color,
}: Props) => {
  const objectRefId = useRef<string>('');
  const objectRef = useRef<ElementT | null>(null);

  const isDrawingRef = useRef(false);
  const { push } = useHistoryStore();

  const handleLineDown = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'line') return;
    const { x, y } = getWorld({ e, zoom, canvasRef });
    isDrawingRef.current = true;
    const line: ElementT = {
      id: crypto.randomUUID(),
      type: 'line',
      color,
      x1: x,
      y1: y,
      x2: x,
      y2: y,
    };

    setElements((prev) => {
      const next = [line, ...prev];
      return next;
    });
    objectRefId.current = line.id;
    objectRef.current = line;
    events.handleCreateElement(line);
  };
  const handleLineMove = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'line') return;
    if (!objectRefId.current) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const element = elements.find((el) => el.id === objectRefId.current);

    if (!element || element.type !== 'line') return;

    setElements((prev) => {
      const next = prev.map((el) => (el.id === objectRefId.current ? { ...el, x2: x, y2: y } : el));

      const updated = next.find((el) => el.id === objectRefId.current);

      if (updated) {
        events.handleUpdateElement(updated);
      }

      return next;
    });
  };
  const handleLineUp = () => {
    push({
      type: 'UPDATE',
      id: objectRefId.current,
      before: objectRef.current!,
      after: elements.find((el) => el.id === objectRef.current!.id)!,
    });
    objectRefId.current = '';
    objectRef.current = null;
  };

  return {
    handleLineDown,
    handleLineMove,
    handleLineUp,
  };
};
