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
  const resizeRef = useRef({
    isResizing: false,

    elementId: '',

    direction: '',

    startMouse: { x: 0, y: 0 },

    startElement: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    },
  });
  const handleResizeStart = (
    e: PointerEvent<HTMLDivElement>,
    corner: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right',
    id: string,
  ) => {
    e.stopPropagation();

    const element = elements.find((el) => el.id === id);

    if (!element) return;
    if (element.type === 'pen' || element.type === 'text') return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    resizeRef.current = {
      isResizing: true,
      elementId: id,
      direction: corner,
      startMouse: { x, y },
      startElement: {
        x: element.x,
        y: element.y,
        width: element.width,
        height: element.height,
      },
    };
  };
  const handleResizeMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!resizeRef.current.isResizing) return;

    const { x, y } = getWorld({
      e,
      zoom,
      canvasRef,
    });

    const dx = x - resizeRef.current.startMouse.x;
    const dy = y - resizeRef.current.startMouse.y;

    const direction = resizeRef.current.direction;

    const current = elements.find((el) => el.id === resizeRef.current.elementId);

    if (!current) return;
    if (current.type === 'pen' || current.type === 'text') return;

    let newX = resizeRef.current.startElement.x;
    let newY = resizeRef.current.startElement.y;

    let newWidth = resizeRef.current.startElement.width;
    let newHeight = resizeRef.current.startElement.height;

    if (direction === 'bottom-right') {
      newWidth += dx;
      newHeight += dy;
    }

    if (direction === 'bottom-left') {
      newX += dx;
      newWidth -= dx;

      newHeight += dy;
    }

    if (direction === 'top-right') {
      newY += dy;

      newWidth += dx;
      newHeight -= dy;
    }

    if (direction === 'top-left') {
      newX += dx;
      newY += dy;

      newWidth -= dx;
      newHeight -= dy;
    }

    const updatedElement = {
      ...current,

      x: newX,
      y: newY,

      width: Math.max(20, newWidth),
      height: Math.max(20, newHeight),
    };

    setElements((prev) => prev.map((el) => (el.id === updatedElement.id ? updatedElement : el)));

    events.handleUpdateElement(updatedElement);
  };
  const handleResizeEnd = () => {
    resizeRef.current = {
      isResizing: false,

      elementId: '',

      direction: '',

      startMouse: { x: 0, y: 0 },

      startElement: {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      },
    };
  };
  return {
    handleResizeStart,
    resizeRef,
    handleResizeMove,
    handleResizeEnd,
  };
};
