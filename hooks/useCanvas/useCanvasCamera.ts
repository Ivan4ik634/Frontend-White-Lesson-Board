import { BoardTool } from '@/components/board/BoardToolRail';
import { PointerEvent, useRef, useState, WheelEvent } from 'react';

export const useCanvasCamera = (tool: BoardTool) => {
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const lastPointRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  const handleCaremaStart = (e: PointerEvent<HTMLDivElement>) => {
    if (tool !== 'grab') return;
    isDraggingRef.current = true;

    lastPointRef.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };
  const handleCameraMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return;
    if (tool !== 'grab') return;

    const dx = e.clientX - lastPointRef.current.x;
    const dy = e.clientY - lastPointRef.current.y;

    setCamera((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPointRef.current = { x: e.clientX, y: e.clientY };
  };
  const handleZoom = (e: WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.ctrlKey) return;
    if (e.deltaY > 0 && zoom > 0.1) {
      setZoom((prev) => Number((prev - 0.1).toFixed(1)));
    }
    if (e.deltaY < 0 && zoom < 2) {
      setZoom((prev) => Number((prev + 0.1).toFixed(1)));
    }
  };

  const handleCameraEnd = () => {
    isDraggingRef.current = false;
  };

  return {
    camera,
    zoom,
    setCamera,
    setZoom,
    handleCaremaStart,
    handleCameraMove,
    handleZoom,
    handleCameraEnd,
  };
};
