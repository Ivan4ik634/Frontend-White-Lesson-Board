'use client';

import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { objectService } from '@/services/object.service';
import { ObjectT } from '@/types/ObjectBoard';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import { BoardToolRail } from './BoardToolRail';

type BoardCanvasProps = {
  boardId: string;
};
export function BoardCanvas({ boardId }: BoardCanvasProps) {
  const { data: objects, loading } = useSupabaseQuery<ObjectT[]>(() =>
    objectService.findAll(boardId),
  );

  return (
    <div className="bg-card relative h-full min-h-[420px] w-full overflow-hidden rounded-xl border border-border shadow-sm">
      <Tldraw
        components={{
          PageMenu: null,
        }}
        overrides={{
          actions(editor, actions) {
            delete actions['new-page'];
            delete actions['duplicate-page'];
            delete actions['rename-page'];
            delete actions['delete-page'];

            return actions;
          },
        }}
        key={boardId}
        hideUi
        className="h-full w-full">
        {!loading && objects ? <BoardToolRail objects={objects} /> : ''}
      </Tldraw>
    </div>
  );
}
