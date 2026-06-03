import { BoardUserT } from '@/types/Board';
import { create } from 'zustand';

type useUsersInBoard = {
  users: BoardUserT[];
  setUsers: (value: BoardUserT[] | ((prev: BoardUserT[]) => BoardUserT[])) => void;
  addUser: (user: BoardUserT) => void;
  removeUser: (userId: string) => void;
};

export const useUsersInBoard = create<useUsersInBoard>((set) => ({
  users: [],
  setUsers: (value) =>
    set((state) => ({
      users: typeof value === 'function' ? value(state.users) : value,
    })),
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  removeUser: (userId) =>
    set((state) => ({ users: state.users.filter((user) => user.user_id.id !== userId) })),
}));
