import { ObjectT } from '@/types/ObjectBoard';
import { TLShapePartial, useEditor } from '@tldraw/tldraw';
import { useEffect, useRef } from 'react';

export function useInitialLoad(
  objects: ObjectT[],
  rowIdToShapeId = useRef(new Map<string, string>()),
) {
  const editor = useEditor();
  const didLoadInitialObjects = useRef(false);

  useEffect(() => {
    if (didLoadInitialObjects.current) return;

    didLoadInitialObjects.current = true;
    editor.store.mergeRemoteChanges(() => {
      editor.createShapes(objects.map((o) => o.object as TLShapePartial));
    });
  }, [editor, objects]);
  useEffect(() => {
    objects.forEach((row) => {
      rowIdToShapeId.current.set(row.id, row.object.id);
    });
  }, [objects]);
}
