import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { objectService } from '@/services/object.service';
import { ElementT } from '@/types/Element';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useProfile } from './useProfile';

interface UseBoardStoreProps {
  boardId: string;
}

export const useBoardStore = ({ boardId }: UseBoardStoreProps) => {
  const [elements, setElements] = useState<ElementT[]>([]);
  const [loading, setLoading] = useState(true);
  const [cameraInit, setCameraInit] = useState({ x: 0, y: 0 });

  const { profile } = useProfile();

  const lastUpdateRef = useRef(0);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!profile) return;

    const get = async () => {
      setLoading(true);

      const { data: user } = await boardUserService.findOne(profile.id, boardId);

      const { data: objects } = await objectService.findInBoard(boardId);

      if (objects) {
        setElements(objects.flatMap((item) => item.object));
      }

      if (user) {
        setCameraInit({
          x: user.x,
          y: user.y,
        });
      }

      setLoading(false);
    };

    get();
  }, [boardId, profile]);

  const broadcast = (event: string, payload: Record<string, unknown>) => {
    if (!profile?.id) return;

    channelRef.current?.send({
      type: 'broadcast',
      event,
      payload: {
        ...payload,
        user_id: profile.id,
      },
    });
  };

  const handleCreateElement = async (element: ElementT) => {
    if (!profile?.id) return;

    await objectService.create(boardId, profile.id, element);

    broadcast('object-created', element);
  };
  const handleReplaceBoard = async (nextElements: ElementT[]) => {
    if (!profile?.id) return;

    await objectService.replaceBoard(boardId, profile.id, nextElements);

    broadcast('board-replace', {
      elements: nextElements,
    });
  };

  const handleCreateElements = async (newElements: ElementT[]) => {
    if (!profile?.id || newElements.length === 0) return;

    await objectService.createMany(boardId, profile.id, newElements);

    broadcast('objects-created', {
      elements: newElements,
    });
  };

  const handleUpdateElement = async (element: ElementT) => {
    if (!profile?.id) return;

    const now = Date.now();

    if (now - lastUpdateRef.current < 50) return;

    lastUpdateRef.current = now;

    setElements((prev) => prev.map((el) => (el.id === element.id ? element : el)));

    await objectService.update(element.id, element);

    broadcast('object-updated', element);
  };

  const handleDeleteElement = async (id: string) => {
    if (!profile?.id) return;

    setElements((prev) => prev.filter((el) => el.id !== id));

    await objectService.delete(id);

    broadcast('object-deleted', { id });
  };

  const handleDeleteElements = async (ids: string[]) => {
    if (!profile?.id || ids.length === 0) return;

    setElements((prev) => prev.filter((el) => !ids.includes(el.id)));

    await objectService.deleteMany(ids);

    broadcast('objects-deleted', { ids });
  };

  useEffect(() => {
    if (!profile) return;
    const handleReplaceBoardRealtime = (payload: { elements: ElementT[]; user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements(payload.elements);
    };

    const handleCreateElementRealtime = (payload: ElementT & { user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => [...prev, payload]);
    };

    const handleCreateElementsRealtime = (payload: { elements: ElementT[]; user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => [...prev, ...payload.elements]);
    };

    const handleUpdateElementRealtime = (payload: ElementT & { user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => {
        const exists = prev.some((el) => el.id === payload.id);

        if (!exists) {
          return [...prev, payload];
        }

        return prev.map((el) => (el.id === payload.id ? payload : el));
      });
    };

    const handleDeleteElementRealtime = (payload: { id: string; user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => prev.filter((el) => el.id !== payload.id));
    };

    const handleDeleteElementsRealtime = (payload: { ids: string[]; user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => prev.filter((el) => !payload.ids.includes(el.id)));
    };

    channelRef.current = supabase
      .channel(`object-${boardId}`)
      .on('broadcast', { event: 'object-created' }, ({ payload }) =>
        handleCreateElementRealtime(
          payload as ElementT & {
            user_id: string;
          },
        ),
      )
      .on('broadcast', { event: 'objects-created' }, ({ payload }) =>
        handleCreateElementsRealtime(
          payload as {
            elements: ElementT[];
            user_id: string;
          },
        ),
      )
      .on('broadcast', { event: 'board-replace' }, ({ payload }) =>
        handleReplaceBoardRealtime(
          payload as {
            elements: ElementT[];
            user_id: string;
          },
        ),
      )
      .on('broadcast', { event: 'object-updated' }, ({ payload }) =>
        handleUpdateElementRealtime(
          payload as ElementT & {
            user_id: string;
          },
        ),
      )
      .on('broadcast', { event: 'object-deleted' }, ({ payload }) =>
        handleDeleteElementRealtime(
          payload as {
            id: string;
            user_id: string;
          },
        ),
      )
      .on('broadcast', { event: 'objects-deleted' }, ({ payload }) =>
        handleDeleteElementsRealtime(
          payload as {
            ids: string[];
            user_id: string;
          },
        ),
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [profile, boardId]);

  return {
    events: {
      handleCreateElement,
      handleCreateElements,
      handleUpdateElement,
      handleDeleteElement,
      handleDeleteElements,
      handleReplaceBoard,
    },

    loading,
    profile,
    cameraInit,

    elements,
    setElements,
  };
};
