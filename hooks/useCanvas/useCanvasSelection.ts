import { ElementT, EventsCanvas } from '@/types/Element';
import { getWorld } from '@/utils/canvas';
import { isIntersecting } from '@/utils/isIntersecting';
import { PointerEvent, RefObject, useEffect, useRef, useState } from 'react';

interface Props {
  zoom: number;
  elements: ElementT[];
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  canvasRef: RefObject<HTMLDivElement | null>;
  events: EventsCanvas;
}
export const useCanvasSelection = ({ zoom, elements, events, setElements, canvasRef }: Props) => {
  const startPointSelectionRef = useRef({ x: 0, y: 0 });
  const endPointSelectionRef = useRef({ x: 0, y: 0 });
  const isSelectionRef = useRef(false);
  const [selection, setSelection] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const selectedRef = useRef<string[]>([]);
  const handleSelectionStart = (e: PointerEvent<HTMLDivElement>) => {
    if (!e.ctrlKey) return;
    if (!canvasRef.current) return;
    isSelectionRef.current = true;
    const { x, y } = getWorld({ e, zoom, canvasRef });

    startPointSelectionRef.current = { x, y };
  };

  const handleSelectionMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isSelectionRef.current) return;

    const { x, y } = getWorld({ e, zoom, canvasRef });

    const start = startPointSelectionRef.current;

    const width = x - start.x;
    const height = y - start.y;

    endPointSelectionRef.current = { x: x, y: y };

    setSelection({
      x: width < 0 ? x : start.x,
      y: height < 0 ? y : start.y,
      width: Math.abs(width),
      height: Math.abs(height),
    });
  };

  const handleSelectionEnd = () => {
    isSelectionRef.current = false;

    const start = startPointSelectionRef.current;

    const end = endPointSelectionRef.current;

    const selectedIds = elements
      .filter((el) => isIntersecting({ start, end, el }))
      .map((el) => el.id);

    setSelectedElementIds(selectedIds);

    startPointSelectionRef.current = { x: 0, y: 0 };
    setSelection({ x: 0, y: 0, width: 0, height: 0 });
  };

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        startPointSelectionRef.current = { x: 0, y: 0 };
        setSelection({ x: 0, y: 0, width: 0, height: 0 });
        isSelectionRef.current = false;
        setSelectedElementIds([]);
      }
      if (e.key === 'Delete') {
        setElements((prev) => prev.filter((el) => !selectedRef.current.includes(el.id)));
        for (let i = 0; i < selectedRef.current.length; i++) {
          await events.handleDeleteElement(selectedRef.current[i]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [events, setElements]);

  useEffect(() => {
    selectedRef.current = selectedElementIds;
  }, [selectedElementIds]);

  return {
    handleSelectionStart,
    selection,
    isSelectionRef,
    selectedElementIds,
    handleSelectionMove,
    handleSelectionEnd,
    setSelectedElementIds,
  };
};
