'use client';

import { useBoardCursors } from '@/hooks/useBoardCursors';
import { useBoardStore } from '@/hooks/useBoardStore';
import BoardHeader from './BoardHeader';
import { Canvas } from './canvas';

type BoardShellProps = {
  boardId: string;
};

export function BoardShell({ boardId }: BoardShellProps) {
  const { events, elements, profile, setElements, loading } = useBoardStore({ boardId });
  const { cursors, handleCursorMove } = useBoardCursors({ boardId });

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-muted/35 px-4 text-sm text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-muted/35">
      <BoardHeader boardId={boardId} />
      <div className="min-h-0 flex-1 p-1.5 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:p-2 md:p-3">
        <Canvas
          profile={profile}
          initData={elements}
          setElements={setElements}
          events={events}
          cursors={cursors}
          onCursorMove={handleCursorMove}
        />
      </div>
    </div>
  );
}
