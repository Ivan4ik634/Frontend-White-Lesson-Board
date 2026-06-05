import { ElementT } from '@/types/Element';

export function isPointInsideElement({ x, y, el }: { x: number; y: number; el: ElementT }) {
  switch (el.type) {
    case 'rectangle':
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;

    case 'circle': {
      const centerX = el.x + el.width / 2;
      const centerY = el.y + el.height / 2;
      const radius = Math.min(el.width, el.height) / 2;

      return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
    }

    case 'text':
      // временно хотя бы по точке текста
      return Math.abs(x - el.x) < 10 && Math.abs(y - el.y) < 10;

    case 'pen':
      return el.points.some((point) => Math.hypot(point.x - x, point.y - y) < 5);
  }
}
