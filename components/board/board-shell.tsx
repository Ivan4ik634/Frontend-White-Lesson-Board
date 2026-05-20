'use client';

import { BoardCanvas } from '@/components/board/board-canvas';
import BoardHeader from './BoardHeader';

type BoardShellProps = {
  boardId: string;
};

export function BoardShell({ boardId }: BoardShellProps) {
  return (
    <div className="bg-muted/35 flex h-dvh flex-col">
      <BoardHeader boardId={boardId} />
      <div className="min-h-0 flex-1 p-2 md:p-3">
        <BoardCanvas boardId={boardId} />
      </div>
    </div>
  );
}
