export type ElementT =
  | {
      id: string;
      type: 'rectangle' | 'circle';

      x: number;
      y: number;

      width: number;
      height: number;
    }
  | {
      id: string;
      type: 'text';

      x: number;
      y: number;

      text: string;
      isEditing?: boolean;
    }
  | {
      id: string;
      type: 'pen';

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
