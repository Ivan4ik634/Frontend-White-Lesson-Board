'use client';

import { useBoardStore } from '@/hooks/useBoardStore';
import BoardAiChat from './BoardAiChat';
import BoardHeader from './BoardHeader';
import { Canvas } from './canvas';

type BoardShellProps = {
  boardId: string;
};

export function BoardShell({ boardId }: BoardShellProps) {
  const { events, elements, profile, setElements, loading, cameraInit } = useBoardStore({
    boardId,
  });

  if (loading) {
    return (
      <div className="flex h-dvh items-center justify-center bg-muted/35 px-4 text-sm text-muted-foreground">
        Loading board...
      </div>
    );
  }

  return (
    <div className="h-dvh flex bg-muted/35 overflow-hidden">
      <div className="flex h-full w-full  flex-col  ">
        <BoardHeader boardId={boardId} />
        <div className="min-h-0 flex-1 p-1.5 pb-2 sm:p-2 md:p-3 pr-0">
          <Canvas
            mode="board"
            profile={profile}
            initData={elements}
            cameraInit={cameraInit}
            setElements={setElements}
            events={events}
            boardId={boardId}
          />
        </div>
      </div>
      <BoardAiChat events={events} setElements={setElements} />
    </div>
  );
}
