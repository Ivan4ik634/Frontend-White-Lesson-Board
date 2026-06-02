import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { isIntersecting } from '@/utils/isIntersecting';
import { PointerEvent, RefObject, useRef, useState } from 'react';

interface Props {
  zoom: number;
  elements: ElementT[];
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
  tool: BoardTool;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
}
export const useCanvasEraser = ({
  zoom,
  elements,
  setElements,
  canvasRef,
  events,
  tool,
}: Props) => {
  const [isErasing, setIsErasing] = useState(false);
  const lastPointRef = useRef({ x: 0, y: 0 });
  console.log('qq');
  const handleEraserStart = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'eraser') return;
    console.log('eraser');
    setIsErasing(true);
    const { x, y } = getWorld({ e, zoom, canvasRef });

    lastPointRef.current = { x, y };

    return;
  };
  const handleEraserMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isErasing) return;
    if (tool !== 'eraser') return;
    console.log('eraser');

    const { x, y } = getWorld({ e, zoom, canvasRef });
    for (const element of elements) {
      if (isIntersecting({ start: lastPointRef.current, end: { x, y }, el: element })) {
        setElements((prev) => prev.filter((el) => el.id !== element.id));
        events.handleDeleteElement(element.id);
      }
    }
  };

  const handleEraserEnd = () => {
    setIsErasing(false);
  };
  return {
    isErasing,
    handleEraserStart,
    handleEraserMove,
    handleEraserEnd,
  };
};
