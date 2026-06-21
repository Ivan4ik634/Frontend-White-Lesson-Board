import { ElementT } from '@/types/Element';
import { create } from 'zustand';

type ElementsState = ElementT[];

type HistoryStore = {
  past: ElementsState[];
  present: ElementsState;
  future: ElementsState[];

  setHistory: (next: ElementsState) => void;

  undo: () => ElementsState | null;
  redo: () => ElementsState | null;
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  past: [],
  present: [],
  future: [],

  setHistory: (next) => {
    const { past, present } = get();
    set({
      past: [...past, present],
      present: next,
      future: [],
    });
  },

  undo: () => {
    const { past, present, future } = get();
    if (past.length === 0) return null;

    const previous = past[past.length - 1];

    set({
      past: past.slice(0, -1),
      present: previous,
      future: [present, ...future],
    });

    return previous;
  },

  redo: () => {
    const { past, present, future } = get();
    if (future.length === 0) return null;

    const next = future[0];

    set({
      past: [...past, present],
      present: next,
      future: future.slice(1),
    });

    return next;
  },
}));
