import { BoardTool } from '@/components/board/BoardToolRail';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { isPointInsideElement } from '@/utils/isPointInsideElement';
import { PointerEvent, RefObject, useEffect, useRef, useState } from 'react';

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
  const [elementsIdsRemove, setElementsIdsRemove] = useState<string[]>([]);
  const lastPointRef = useRef({ x: 0, y: 0 });
  const handleEraserStart = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'eraser') return;
    setIsErasing(true);
    const { x, y } = getWorld({ e, zoom, canvasRef });

    lastPointRef.current = { x, y };

    return;
  };
  const handleEraserMove = async (e: PointerEvent<HTMLDivElement>) => {
    if (!isErasing) return;
    if (tool !== 'eraser') return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const newIds: string[] = [];

    for (const element of elements) {
      if (
        isPointInsideElement({
          x,
          y,
          el: element,
        })
      ) {
        newIds.push(element.id);
      }
    }

    setElementsIdsRemove((prev) => [...new Set([...prev, ...newIds])]);
  };
  useEffect(() => {
    console.log(elementsIdsRemove);
  }, [elementsIdsRemove]);
  const handleEraserEnd = async () => {
    setIsErasing(false);
    for (const id of elementsIdsRemove) {
      setElements((prev) => prev.filter((el) => el.id !== id));
      await events.handleDeleteElement(id);
    }
    setElementsIdsRemove([]);
  };
  return {
    isErasing,
    handleEraserStart,
    handleEraserMove,
    elementsIdsRemove,
    handleEraserEnd,
  };
};
