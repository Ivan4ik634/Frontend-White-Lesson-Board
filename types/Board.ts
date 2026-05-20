import { UserT } from './UserT';

export interface BoardT {
  id: string;
  user_id: string;
  access: 'public' | 'private';
  created_at: string;
}

export interface BoardUserT {
  id: string;
  user_id: UserT;
  board_id: string;
  x: number;
  y: number;
}
