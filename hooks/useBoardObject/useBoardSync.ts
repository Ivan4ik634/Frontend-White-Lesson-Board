import { supabase } from '@/lib/supabase';
import { objectService } from '@/services/object.service';
import { ObjectBoard } from '@/types/ObjectBoard';
import { normalizeShape } from '@/utils/normalizeShape';
import { useEditor } from '@tldraw/editor';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useProfile } from '../useProfile';

const LOCAL_CHANGE_IGNORE_MS = 500;

export const useBoardSync = (localChangeExpiresAt = useRef(new Map<string, number>())) => {
  const editor = useEditor();

  const markLocalChange = (shapeId: string) => {
    localChangeExpiresAt.current.set(shapeId, Date.now() + LOCAL_CHANGE_IGNORE_MS);
  };
  const { profile } = useProfile();
  const params = useParams<{ id: string }>();
  useEffect(() => {
    if (!profile) return;
    const channel = supabase.channel(`board-objects:${params.id}`);

    let updateTimeout: ReturnType<typeof setTimeout> | null = null;
    const pendingUpdates = new Map<string, ObjectBoard>();

    const flushUpdates = async () => {
      updateTimeout = null;
      const updates = [...pendingUpdates.entries()];
      pendingUpdates.clear();

      await Promise.all(
        updates.map(([objectId, object]) => objectService.update(objectId, object)),
      );
    };

    const scheduleUpdate = (object: ObjectBoard) => {
      markLocalChange(object.id);
      channel.send({
        type: 'broadcast',
        event: 'shape-update',
        payload: {
          object,
        },
      });

      if (updateTimeout) return;

      updateTimeout = setTimeout(() => {
        void flushUpdates();
      }, 100);
    };

    const cleanup = editor.store.listen(
      ({ changes }) => {
        for (const [, [, next]] of Object.entries(changes.updated)) {
          if (next.typeName === 'shape') {
            scheduleUpdate(normalizeShape(next));
          }
        }

        Object.values(changes.added).forEach(async (shape) => {
          if (shape.typeName !== 'shape') return;

          markLocalChange(shape.id);
          await objectService.create(params.id, profile.id, normalizeShape(shape));
        });

        Object.values(changes.removed).forEach(async (shape) => {
          if (shape.typeName !== 'shape') return;

          markLocalChange(shape.id);
          await objectService.delete(shape.id);
        });
      },
      { source: 'user', scope: 'document' },
    );

    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }

      void flushUpdates();
      cleanup();
    };
  }, [editor, params.id, profile]);
};
