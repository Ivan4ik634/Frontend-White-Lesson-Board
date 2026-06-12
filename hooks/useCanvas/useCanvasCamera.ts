import { BoardTool } from '@/components/board/BoardToolRail';
import {
  PointerEvent,
  RefObject,
  TouchEvent,
  useEffect,
  useRef,
  useState,
  WheelEvent,
} from 'react';

export const useCanvasCamera = (
  tool: BoardTool,
  canvasRef: RefObject<HTMLDivElement | null>,
  cameraInit?: { x: number; y: number },
) => {
  const [camera, setCamera] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const ref = useRef<HTMLDivElement>(null);

  const lastPointRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (cameraInit) {
      setCamera(cameraInit);
    }
  }, [cameraInit]);

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

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newZoom =
      e.deltaY > 0
        ? Math.max(0.3, Number((zoom - 0.1).toFixed(1)))
        : Math.min(1.5, Number((zoom + 0.1).toFixed(1)));

    if (newZoom === zoom) return;

    const worldX = (mouseX - camera.x) / zoom;
    const worldY = (mouseY - camera.y) / zoom;

    setCamera({
      x: mouseX - worldX * newZoom,
      y: mouseY - worldY * newZoom,
    });

    setZoom(newZoom);
  };
  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const handleWheel = (e: globalThis.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleCameraEnd = () => {
    isDraggingRef.current = false;
  };

  const addZoom = (z: number) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const newZoom = Math.max(0.3, Math.min(1.5, Number((zoom + z).toFixed(1))));

    if (newZoom === zoom) return;

    const worldX = (centerX - camera.x) / zoom;
    const worldY = (centerY - camera.y) / zoom;

    setCamera({
      x: centerX - worldX * newZoom,
      y: centerY - worldY * newZoom,
    });

    setZoom(newZoom);
  };

  const lastDistance = useRef(0);

  const getDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 2) return;

    e.preventDefault();

    const distance = getDistance(e.touches);

    if (lastDistance.current) {
      const scale = distance / lastDistance.current;

      setZoom((prev) => Math.max(0.3, Math.min(1.5, prev * scale)));
    }

    lastDistance.current = distance;
  };

  const handleTouchEnd = () => {
    lastDistance.current = 0;
  };

  return {
    camera,
    zoom,
    ref,
    setCamera,
    setZoom,
    addZoom,
    handleCaremaStart,
    handleCameraMove,
    handleZoom,
    handleTouchMove,
    handleTouchEnd,
    handleCameraEnd,
  };
};
