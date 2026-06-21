import { create } from 'zustand';

type OpenAiChat = {
  open: boolean;
  setOpen: (value: boolean) => void;
};

export const useOpenAiChat = create<OpenAiChat>((set) => ({
  open: false,
  setOpen: (value) => set({ open: value }),
}));
