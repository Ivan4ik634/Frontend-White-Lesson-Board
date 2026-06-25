import { ElementT } from '@/types/Element';
import { MouseEvent, PointerEvent, RefObject } from 'react';
import { isPointInsideElement } from './isPointInsideElement';

interface GetWorldProps {
  e:
    | MouseEvent<HTMLDivElement>
    | globalThis.PointerEvent
    | PointerEvent<HTMLDivElement>
    | MouseEvent
    | PointerEvent;
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
  return [...elements].reverse().find((el) => isPointInsideElement({ x, y, el }));
};
export function pointToSegmentDistance(
  x: number,
  y: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let param = -1;
  if (lenSq !== 0) param = dot / lenSq;

  let xx: number, yy: number;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = x - xx;
  const dy = y - yy;

  return Math.sqrt(dx * dx + dy * dy);
}
