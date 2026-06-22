import { ElementT } from '@/types/Element';
import { pointToSegmentDistance } from './canvas';

export function isPointInsideElement({ x, y, el }: { x: number; y: number; el: ElementT }) {
  switch (el.type) {
    case 'rectangle':
    case 'image':
    case 'text':
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;

    case 'circle': {
      const cx = el.x + el.width / 2;
      const cy = el.y + el.height / 2;
      const r = Math.min(el.width, el.height) / 2;

      return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
    }

    case 'pen':
      return el.points.some((p) => Math.abs(x - p.x) < 20 && Math.abs(y - p.y) < 20);

    case 'line': {
      const d = pointToSegmentDistance(x, y, el.x1, el.y1, el.x2, el.y2);

      return d < 6;
    }
  }
}
