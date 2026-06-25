import { ElementT } from '@/types/Element';
import { create } from 'zustand';

type Action =
  | {
      type: 'CREATE';
      element: ElementT;
    }
  | {
      type: 'DELETE';
      element: ElementT;
    }
  | {
      type: 'UPDATE';
      id: string;
      before: Partial<ElementT>;
      after: Partial<ElementT>;
    };

type HistoryStore = {
  undoStack: Action[];
  redoStack: Action[];

  push: (action: Action) => void;

  undo: () => Action | null;
  redo: () => Action | null;

  reset: () => void;
};

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  undoStack: [],
  redoStack: [],

  push: (action) => {
    set((state) => ({
      undoStack: [...state.undoStack, action],
      redoStack: [],
    }));
  },

  undo: () => {
    const { undoStack, redoStack } = get();

    if (!undoStack.length) return null;

    const action = undoStack[undoStack.length - 1];

    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [...redoStack, action],
    });

    return action;
  },

  redo: () => {
    const { undoStack, redoStack } = get();

    if (!redoStack.length) return null;

    const action = redoStack[redoStack.length - 1];

    set({
      undoStack: [...undoStack, action],
      redoStack: redoStack.slice(0, -1),
    });

    return action;
  },

  reset: () =>
    set({
      undoStack: [],
      redoStack: [],
    }),
}));
