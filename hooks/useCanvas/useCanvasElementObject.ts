import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef } from 'react';

interface Props {
  zoom: number;
  tool: BoardTool;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
  color: string;
}
export const useCanvasElementObject = ({
  events,
  canvasRef,
  zoom,
  color,
  tool,
  setElements,
}: Props) => {
  const startPointRef = useRef({ x: 0, y: 0 });
  const objectIdRef = useRef<string>('');
  const isDrawingRef = useRef(false);

  const handleElementStart = async (
    e: PointerEvent<HTMLDivElement>,
    type: 'rectangle' | 'circle',
  ) => {
    if (tool !== type) return;
    isDrawingRef.current = true;
    const { x, y } = getWorld({ e, zoom, canvasRef });

    startPointRef.current = { x, y };

    const id = crypto.randomUUID();
    objectIdRef.current = id;
    const element = {
      id,
      x,
      y,
      width: 0,
      height: 0,
      type,
      color,
    };
    setElements((prev) => [...prev, element]);

    events.handleCreateElement(element);
  };

  const handleElementMove = async (
    e: PointerEvent<HTMLDivElement>,
    type: 'rectangle' | 'circle',
  ) => {
    if (!isDrawingRef.current) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const start = startPointRef.current;

    const width = x - start.x;
    const height = y - start.y;

    if (Math.abs(width) < 2 || Math.abs(height) < 2) {
      return; // игнор мусора
    }

    const size = Math.max(Math.abs(width), Math.abs(height));
    const element = {
      id: objectIdRef.current,

      x: width < 0 ? x : start.x,
      y: height < 0 ? y : start.y,

      type: type,
      color,

      width: type === 'circle' ? size : Math.abs(width),
      height: type === 'circle' ? size : Math.abs(height),
    };

    setElements((prev) =>
      prev.map((el) =>
        el.id === objectIdRef.current
          ? {
              ...el,
              ...element,
            }
          : el,
      ),
    );
    await events.handleUpdateElement(element);
  };

  const handleElementEnd = () => {
    isDrawingRef.current = false;
  };

  return { handleElementStart, handleElementMove, handleElementEnd };
};
