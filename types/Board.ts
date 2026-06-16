import { UserT } from './UserT';

export interface BoardT {
  id: string;
  user_id: string;
  access: 'public' | 'private';
  created_at: string;
  description: string;
  members_count: number;
  title: string;
  image: string;
}

export interface BoardUserT {
  id: string;
  user_id: UserT;
  board_id: string;
  x: number;
  y: number;
}
export interface BoardUserWithBoard {
  id: string;
  user_id: string;
  board_id: BoardT;
  x: number;
  y: number;
}
export interface BoardCreateForm {
  title: string;
  description: string;
  access: 'public' | 'private';
}
export interface BoardCreate extends BoardCreateForm {
  user_id: string;
  image: string;
}
export interface FilterBoardsT {
  sortByMembers: 'Ascending' | 'Descending';
  search: string;
  sortByDate: 'Ascending' | 'Descending';
  sortByAccess: 'Private' | 'Public' | 'All';
}
