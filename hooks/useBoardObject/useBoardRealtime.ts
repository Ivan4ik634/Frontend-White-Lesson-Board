import { supabase } from '@/lib/supabase';
import { objectService } from '@/services/object.service';
import { ObjectBoard, ObjectT } from '@/types/ObjectBoard';
import { TLShapeId, TLShapePartial, useEditor } from '@tldraw/editor';
import { useParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

type RealtimeObjectRow = ObjectT & {
  objectId?: string;
};

type ObjectRealtimePayload = {
  new: Partial<RealtimeObjectRow>;
  old: Partial<RealtimeObjectRow>;
};

export const useBoardRealtime = (
  rowIdToShapeId = useRef(new Map<string, string>()),
  isLocalChangeEcho = (shapeId: string) => false,
) => {
  const params = useParams<{ id: string }>();

  const editor = useEditor();

  useEffect(() => {
    const handleRemoteInsert = (payload: ObjectRealtimePayload) => {
      const object = payload.new.object;

      if (!object) return;

      if (payload.new.id) {
        rowIdToShapeId.current.set(payload.new.id, object.id);
      }

      if (isLocalChangeEcho(object.id)) return;

      editor.store.mergeRemoteChanges(() => {
        if (editor.getShape(object.id as TLShapeId)) {
          editor.updateShapes([object as TLShapePartial]);
          return;
        }

        editor.createShapes([object as TLShapePartial]);
      });
    };

    const handleRemoteUpdate = async (payload: { object: ObjectBoard }) => {
      const object = payload.object;

      if (!object) return;

      editor.store.mergeRemoteChanges(() => {
        if (editor.getShape(object.id as TLShapeId)) {
          editor.updateShapes([object as TLShapePartial]);
          return;
        }
        editor.createShapes([object as TLShapePartial]);
      });
      await objectService.update(object.id, object);
    };

    const handleRemoteDelete = (payload: ObjectRealtimePayload) => {
      const rowId = payload.old.id;
      const objectId =
        payload.old.object?.id ??
        payload.old.objectId ??
        (rowId ? rowIdToShapeId.current.get(rowId) : undefined);

      if (!objectId || !editor.getShape(objectId as TLShapeId)) return;

      if (rowId) {
        rowIdToShapeId.current.delete(rowId);
      }

      editor.store.mergeRemoteChanges(() => {
        editor.deleteShapes([objectId as TLShapeId]);
      });
    };

    const channel = supabase
      .channel(`board-objects:${params.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'object', filter: `board_id=eq.${params.id}` },
        handleRemoteInsert,
      )
      .on('broadcast', { event: 'shape-update' }, ({ payload }) => handleRemoteUpdate(payload))
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'object' },
        handleRemoteDelete,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [editor, params.id]);
};
