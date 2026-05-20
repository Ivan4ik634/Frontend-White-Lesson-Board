import { ObjectBoard } from '@/types/ObjectBoard';
import { TLShape } from '@tldraw/tldraw';

export const normalizeShape = (shape: TLShape): ObjectBoard => ({
  id: shape.id,
  type: shape.type,
  x: shape.x,
  y: shape.y,
  props: shape.props,
});
