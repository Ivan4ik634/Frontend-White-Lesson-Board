import { ElementT } from './Element';

export type ObjectBoard = {
  id: string;
  objectId: string;
  board_id: string;
  user_id: string;
  created_at: string;
  object: ElementT;
  last_change_user?: string;
};
