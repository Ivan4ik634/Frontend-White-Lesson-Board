import { ElementT } from '@/types/Element';

interface Props {
  start: { x: number; y: number };
  end: { x: number; y: number };
  el: ElementT;
}

export const isIntersecting = ({ start, end, el }: Props) => {
  const selLeft = Math.min(start.x, end.x);
  const selRight = Math.max(start.x, end.x);
  const selTop = Math.min(start.y, end.y);
  const selBottom = Math.max(start.y, end.y);

  if (el.type === 'pen') {
    const xs = el.points.map((p) => p.x);
    const ys = el.points.map((p) => p.y);

    const elLeft = Math.min(...xs);
    const elRight = Math.max(...xs);
    const elTop = Math.min(...ys);
    const elBottom = Math.max(...ys);

    return elLeft <= selRight && elRight >= selLeft && elTop <= selBottom && elBottom >= selTop;
  }
  if (el.type === 'line') {
    const padding = 6;

    const minX = Math.min(el.x1, el.x2) - padding;
    const maxX = Math.max(el.x1, el.x2) + padding;
    const minY = Math.min(el.y1, el.y2) - padding;
    const maxY = Math.max(el.y1, el.y2) + padding;

    return minX <= selRight && maxX >= selLeft && minY <= selBottom && maxY >= selTop;
  }

  const width = el.width ?? 0;
  const height = el.height ?? 0;

  const elLeft = el.x;
  const elRight = el.x + width;
  const elTop = el.y;
  const elBottom = el.y + height;

  return elLeft <= selRight && elRight >= selLeft && elTop <= selBottom && elBottom >= selTop;
};
