import { create } from 'zustand';

interface OnlineUsers {
  onlineUsers: string[];
  setOnlineUsers: (onlineUsers: string[]) => void;
}

export const useOnlineUsers = create<OnlineUsers>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),
}));
