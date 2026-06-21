'use client';

import { Button } from '@/components/ui/button';
import { useCanvasHistory } from '@/hooks/useCanvas/useCanvasHistory';
import { cn } from '@/lib/utils';
import { ElementT, EventsCanvas } from '@/types/Element';
import { Minus, Plus, Redo2, Undo2 } from 'lucide-react';
import { FC } from 'react';

interface Props {
  zoom: number;
  addZoom: (zoom: number) => void;
  events: EventsCanvas;
  setElements: React.Dispatch<React.SetStateAction<ElementT[]>>;
}

const CanvasZoom: FC<Props> = ({ zoom, setElements, events, addZoom }) => {
  const { canUndo, canRedo, handleUndo, handleRedo } = useCanvasHistory({ events, setElements });

  const renderHistoryControls = () => (
    <div className="flex items-center justify-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Undo"
        title="Undo"
        disabled={!canUndo}
        onClick={handleUndo}
        className="size-8 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40 sm:size-10">
        <Undo2 className="size-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Redo"
        title="Redo"
        disabled={!canRedo}
        onClick={handleRedo}
        className="size-8 rounded-md text-muted-foreground hover:text-foreground disabled:opacity-40 sm:size-10">
        <Redo2 className="size-4" aria-hidden />
      </Button>
    </div>
  );

  return (
    <>
      <div
        onPointerDown={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur sm:hidden">
        {renderHistoryControls()}
      </div>
      <div
        onPointerDown={(event) => event.stopPropagation()}
        onPointerMove={(event) => event.stopPropagation()}
        onPointerUp={(event) => event.stopPropagation()}
        className="absolute bottom-2 right-2 z-20 hidden rounded-[5px] border border-border bg-background/95 p-3 shadow-sm backdrop-blur sm:flex sm:flex-col">
        {renderHistoryControls()}
        <div className="mt-5 flex items-center gap-x-3">
          <Minus
            className={cn(
              'cursor-pointer opacity-75 transition-all duration-300 hover:opacity-100',
              zoom <= 0.3 && 'pointer-events-none opacity-40',
            )}
            onClick={() => zoom > 0.3 && addZoom(-0.1)}
            size={18}
          />
          <p className="no-select min-w-10 text-center text-sm">{Number(zoom * 100).toFixed(0)}%</p>
          <Plus
            className={cn(
              'cursor-pointer opacity-75 transition-all duration-300 hover:opacity-100',
              zoom >= 1.5 && 'pointer-events-none opacity-40',
            )}
            onClick={() => zoom < 1.5 && addZoom(0.1)}
            size={18}
          />
        </div>
      </div>
    </>
  );
};

export default CanvasZoom;
