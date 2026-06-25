'use client';

import { useHistoryStore } from '@/store/useHistoryStore';
import { ElementT, EventsCanvas } from '@/types/Element';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

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

type UseCanvasHistoryProps = {
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
  events: EventsCanvas;
};

export function useCanvasHistory({ setElements, events }: UseCanvasHistoryProps) {
  const { undoStack, redoStack, undo, redo, reset } = useHistoryStore();

  const pathname = usePathname();

  useEffect(() => {
    reset();
  }, [pathname, reset]);

  const applyUndo = async (action: Action) => {
    switch (action.type) {
      case 'CREATE': {
        await events.handleDeleteElement(action.element.id);

        setElements((prev) => prev.filter((el) => el.id !== action.element.id));

        break;
      }

      case 'DELETE': {
        await events.handleCreateElement(action.element);

        setElements((prev) => [...prev, action.element]);

        break;
      }

      case 'UPDATE': {
        const before = {
          ...action.before,
          id: action.id,
        } as ElementT;

        setElements((prev) => prev.map((el) => (el.id === action.id ? { ...el, ...before } : el)));

        // 2. sync отдельно
        void events.handleUpdateElement(before);

        break;
      }
    }
  };
  const applyRedo = async (action: Action) => {
    switch (action.type) {
      case 'CREATE': {
        await events.handleCreateElement(action.element);

        setElements((prev) => [...prev, action.element]);

        break;
      }

      case 'DELETE': {
        await events.handleDeleteElement(action.element.id);

        setElements((prev) => prev.filter((el) => el.id !== action.element.id));

        break;
      }

      case 'UPDATE': {
        const after = {
          ...action.after,
          id: action.id,
        } as ElementT;
        setElements((prev) => prev.map((el) => (el.id === action.id ? { ...el, ...after } : el)));

        void events.handleUpdateElement(after);

        break;
      }
    }
  };

  const handleUndo = () => {
    const action = undo();

    if (!action) return;

    applyUndo(action);
  };

  const handleRedo = () => {
    const action = redo();

    if (!action) return;

    applyRedo(action);
  };

  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    handleUndo,
    handleRedo,
  };
}
