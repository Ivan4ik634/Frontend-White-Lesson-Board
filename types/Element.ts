import { BoardUserT } from './Board';

export type ElementT =
  | {
      id: string;
      type: 'rectangle' | 'circle' | 'image';

      x: number;
      y: number;

      color: string;

      width: number;
      height: number;

      file?: string;
    }
  | {
      id: string;
      type: 'text';

      color: string;

      x: number;
      y: number;

      width: number;
      height: number;

      fontSize: number;
      text: string;
      isEditing?: boolean;
    }
  | {
      id: string;
      type: 'pen';

      color: string;

      points: {
        x: number;
        y: number;
      }[];
    };

export type EventsCanvas = {
  handleCreateElement: (element: ElementT) => Promise<void>;
  handleCreateElements: (newElements: ElementT[]) => Promise<void>;
  handleUpdateElement: (element: ElementT) => Promise<void>;
  handleDeleteElement: (id: string) => Promise<void>;
  handleDeleteElements: (ids: string[]) => Promise<void>;
  handleReplaceBoard: (nextElements: ElementT[]) => Promise<void>;
};
export interface CursorsCanvas extends BoardUserT {}
