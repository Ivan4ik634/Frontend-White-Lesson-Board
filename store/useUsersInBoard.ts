import { BoardUserT } from '@/types/Board';
import { create } from 'zustand';

type useUsersInBoard = {
  users: BoardUserT[];
  setUsers: (value: BoardUserT[]) => void;
  addUser: (user: BoardUserT) => void;
};

export const useUsersInBoard = create<useUsersInBoard>((set) => ({
  users: [],
  setUsers: (value) => set({ users: value }),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
}));
