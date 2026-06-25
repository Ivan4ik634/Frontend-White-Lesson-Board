import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef } from 'react';

interface Props {
  elements: ElementT[];
  zoom: number;
  canvasRef: RefObject<HTMLDivElement | null>;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  events: EventsCanvas;
}
export const useCanvasResize = ({ elements, zoom, events, setElements, canvasRef }: Props) => {
  const resizeRef = useRef<{
    isResizing: boolean;
    elementId: string;
    direction: string;
    startMouse: { x: number; y: number };
    startElement: ElementT | null;
  }>({
    isResizing: false,

    elementId: '',

    direction: '',

    startMouse: { x: 0, y: 0 },

    startElement: null,
  });
  const { push } = useHistoryStore();

  const handleResizeStart = (
    e: PointerEvent<HTMLDivElement>,
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    id: string,
  ) => {
    e.stopPropagation();

    const element = elements.find((el) => el.id === id);

    if (!element) return;
    if (element.type === 'pen' || element.type === 'line') return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    resizeRef.current = {
      isResizing: true,
      elementId: id,
      direction: corner,
      startMouse: { x, y },
      startElement: element,
    };
  };
  const handleResizeMove = async (e: PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current.isResizing) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const dx = x - resizeRef.current.startMouse.x;
    const dy = y - resizeRef.current.startMouse.y;

    const direction = resizeRef.current.direction;

    const current = elements.find((el) => el.id === resizeRef.current.elementId);

    if (!current || current.type === 'pen' || current.type === 'line') return;
    if (
      resizeRef.current.startElement?.type === 'line' ||
      resizeRef.current.startElement?.type === 'pen'
    )
      return;

    let newX = resizeRef.current.startElement!.x;
    let newY = resizeRef.current.startElement!.y;
    let newW = resizeRef.current.startElement!.width;
    let newH = resizeRef.current.startElement!.height;

    // resize logic
    if (direction === 'bottom-right') {
      newW += dx;
      newH += dy;
    }

    if (direction === 'bottom-left') {
      newX += dx;
      newW -= dx;
      newH += dy;
    }

    if (direction === 'top-right') {
      newY += dy;
      newW += dx;
      newH -= dy;
    }

    if (direction === 'top-left') {
      newX += dx;
      newY += dy;
      newW -= dx;
      newH -= dy;
    }

    if (newW < 0) {
      newX += newW;
      newW = Math.abs(newW);
    }

    if (newH < 0) {
      newY += newH;
      newH = Math.abs(newH);
    }

    // min size
    const MIN = 20;
    if (newW < MIN) newW = MIN;
    if (newH < MIN) newH = MIN;

    const updatedElement = {
      ...current,
      x: newX,
      y: newY,
      width: newW,
      height: newH,
    };

    setElements((prev) => prev.map((el) => (el.id === updatedElement.id ? updatedElement : el)));

    events.handleUpdateElement(updatedElement);
  };
  const handleResizeEnd = () => {
    if (!resizeRef.current.isResizing) return;
    push({
      type: 'UPDATE',
      id: resizeRef.current.elementId,
      before: resizeRef.current.startElement!,
      after: elements.find((el) => el.id === resizeRef.current.elementId)!,
    });
    resizeRef.current = {
      isResizing: false,

      elementId: '',

      direction: '',

      startMouse: { x: 0, y: 0 },

      startElement: null,
    };
  };
  return {
    handleResizeStart,
    resizeRef,
    handleResizeMove,
    handleResizeEnd,
  };
};
