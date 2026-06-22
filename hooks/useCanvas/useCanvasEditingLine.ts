import { ElementT } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { PointerEvent, RefObject, useRef, useState } from 'react';
interface Props {
  zoom: number;
  canvasRef: RefObject<HTMLDivElement | null>;
  elements: ElementT[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
}
export const useCanvasEditingLine = ({ zoom, setElements, canvasRef, elements }: Props) => {
  const [isEditingLine, setIsEditingLine] = useState(false);
  const objectRef = useRef({
    startMouseX: 0,
    startMouseY: 0,

    startX: 0,
    startY: 0,
    handle: '',
    id: '',
  });
  const handleEditingLineDown = (
    e: PointerEvent<SVGCircleElement>,
    handle: 'start' | 'end',
    id: string,
  ) => {
    const { x, y } = getWorld({ e, zoom, canvasRef });
    setIsEditingLine(true);

    const element = elements.find((el) => el.id === id);

    if (!element || element.type !== 'line') return;

    objectRef.current = {
      startMouseX: x,
      startMouseY: y,
      startX: handle === 'start' ? element.x1 : element.x2,
      startY: handle === 'start' ? element.y1 : element.y2,
      handle,
      id,
    };
  };
  const handleEditingLineMove = (e: PointerEvent<SVGCircleElement>) => {
    if (!isEditingLine) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const { id, handle } = objectRef.current;

    setElements((prev) =>
      prev.map((el) => {
        if (el.id !== id) return el;

        if (handle === 'start') {
          return {
            ...el,
            x1: x,
            y1: y,
          };
        }

        return {
          ...el,
          x2: x,
          y2: y,
        };
      }),
    );
  };
  const handleEditingLineUp = () => {
    if (!isEditingLine) return;
    setIsEditingLine(false);
    objectRef.current = {
      startMouseX: 0,
      startMouseY: 0,
      startX: 0,
      startY: 0,
      handle: '',
      id: '',
    };
  };
  return { handleEditingLineDown, handleEditingLineMove, handleEditingLineUp };
};
