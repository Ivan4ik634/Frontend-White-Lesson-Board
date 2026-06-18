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
  handleCreateElement: (element: ElementT) => void;
  handleUpdateElement: (element: ElementT) => void;
  handleDeleteElement: (id: string) => void;
};
export interface CursorsCanvas extends BoardUserT {}
