'use client';

import { useRef } from 'react';

import { ObjectT } from '@/types/ObjectBoard';
import { useInitialLoad } from './useBoardInit';
import { useBoardRealtime } from './useBoardRealtime';
import { useBoardSync } from './useBoardSync';

export function useBoardObjectsSync(objects: ObjectT[]) {
  const rowIdToShapeId = useRef(new Map<string, string>());
  const localChangeExpiresAt = useRef(new Map<string, number>());
  const isLocalChangeEcho = (shapeId: string) => {
    const expiresAt = localChangeExpiresAt.current.get(shapeId);

    if (!expiresAt) return false;

    if (expiresAt < Date.now()) {
      localChangeExpiresAt.current.delete(shapeId);
      return false;
    }

    return true;
  };

  useInitialLoad(objects, rowIdToShapeId);
  useBoardSync(localChangeExpiresAt);
  useBoardRealtime(rowIdToShapeId, isLocalChangeEcho);
}
