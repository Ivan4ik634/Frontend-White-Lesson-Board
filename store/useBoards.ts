import { BoardT } from '@/types/Board';
import { create } from 'zustand';

type Boards = {
  boards: BoardT[];
  setBoards: (value: BoardT[]) => void;
  deleteBoard: (id: string) => void;
};

export const useBoardsStore = create<Boards>((set) => ({
  boards: [],
  setBoards: (value) => set({ boards: value }),
  deleteBoard(id) {
    set((state) => ({
      boards: state.boards.filter((board) => board.id !== id),
    }));
  },
}));
