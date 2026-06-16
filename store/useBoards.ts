import { BoardT } from '@/types/Board';
import { create } from 'zustand';

type Boards = {
  boards: BoardT[];
  setBoards: (value: BoardT[]) => void;
};

export const useBoardsStore = create<Boards>((set) => ({
  boards: [],
  setBoards: (value) => set({ boards: value }),
}));
