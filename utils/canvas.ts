import { ElementT } from '@/types/Element';
import { MouseEvent, PointerEvent, RefObject } from 'react';

interface GetWorldProps {
  e: MouseEvent<HTMLDivElement> | PointerEvent<HTMLDivElement> | MouseEvent | PointerEvent;
  zoom: number;
  canvasRef: RefObject<HTMLDivElement | null>;
}
export const getWorld = ({ e, zoom, canvasRef }: GetWorldProps): { x: number; y: number } => {
  if (!canvasRef.current) return { x: 0, y: 0 };
  const rect = canvasRef.current.getBoundingClientRect();

  const x = (e.clientX - rect.left) / zoom;
  const y = (e.clientY - rect.top) / zoom;

  return { x, y };
};
export const getCanvasCenter = ({
  zoom,
  camera,
  canvasRef,
}: {
  zoom: number;
  camera: { x: number; y: number };
  canvasRef: RefObject<HTMLDivElement | null>;
}) => {
  if (!canvasRef.current) return { x: 0, y: 0 };

  const rect = canvasRef.current.getBoundingClientRect();

  return {
    x: (rect.width / 2 - camera.x) / zoom,
    y: (rect.height / 2 - camera.y) / zoom,
  };
};

export const getFontSize = (text: string, targetWidth: number) => {
  let min = 1;
  let max = 500;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  while (min < max) {
    const mid = Math.floor((min + max + 1) / 2);

    ctx!.font = `${mid}px sans-serif`;

    const width = ctx!.measureText(text).width;

    if (width <= targetWidth) {
      min = mid;
    } else {
      max = mid - 1;
    }
  }

  return min;
};

interface findHitElementProps {
  x: number;
  y: number;
  elements: ElementT[];
}
export const findHitElement = ({ x, y, elements }: findHitElementProps) => {
  return elements.find((el) => {
    if (el.type === 'pen') {
      return el.points.some((p) => {
        return Math.abs(x - p.x) < 20 && Math.abs(y - p.y) < 20;
      });
    }
    return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
  });
};
