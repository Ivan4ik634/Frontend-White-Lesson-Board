import type { TLShape } from '@tldraw/tldraw';

export type ObjectBoard = {
  id: string;
  type: string;
  x: number;
  y: number;
  props: TLShape['props'];
};
export interface ObjectT {
  id: string;
  user_id: string;
  board_id: string;
  object: ObjectBoard;
  last_change_user: string;
}
