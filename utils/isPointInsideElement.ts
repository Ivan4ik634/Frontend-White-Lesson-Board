import { ElementT } from '@/types/Element';

export function isPointInsideElement({ x, y, el }: { x: number; y: number; el: ElementT }) {
  switch (el.type) {
    case 'rectangle':
    case 'image':
    case 'text':
      return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;

    case 'circle': {
      const centerX = el.x + el.width / 2;
      const centerY = el.y + el.height / 2;
      const radius = Math.min(el.width, el.height) / 2;

      return (x - centerX) ** 2 + (y - centerY) ** 2 <= radius ** 2;
    }

    case 'pen':
      return el.points.some((p) => {
        return Math.abs(x - p.x) < 20 && Math.abs(y - p.y) < 20;
      });
  }
}
