import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { objectService } from '@/services/object.service';
import { ElementT } from '@/types/Element';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useEffect, useRef, useState } from 'react';
import { useProfile } from './useProfile';

interface useBoardEventsProps {
  boardId: string;
}

export const useBoardStore = ({ boardId }: useBoardEventsProps) => {
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

      const { data: user } = await boardUserService.findOne(profile?.id, boardId);
      const { data: objects } = await objectService.findInBoard(boardId);

      if (objects) {
        setElements(objects.flatMap((item) => item.object));
      }
      if (user) {
        setCameraInit({ x: user.x, y: user.y });
      }

      setLoading(false);
    };

    get();
  }, [boardId, profile]);

  const handleCreateElement = async (element: ElementT) => {
    if (!profile?.id) return;

    await objectService.create(boardId, profile.id, element);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'object-created',
      payload: {
        ...element,
        user_id: profile.id,
      },
    });
  };

  const handleUpdateElement = async (element: ElementT) => {
    if (!profile?.id) return;

    const now = Date.now();

    if (now - lastUpdateRef.current < 50) return;

    lastUpdateRef.current = now;

    setElements((prev) => prev.map((el) => (el.id === element.id ? element : el)));

    await objectService.update(element.id, element);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'object-updated',
      payload: {
        ...element,
        user_id: profile.id,
      },
    });
  };

  const handleDeleteElement = async (id: string) => {
    if (!profile?.id) return;

    setElements((prev) => prev.filter((el) => el.id !== id));

    await objectService.delete(id);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'object-deleted',
      payload: {
        id,
        user_id: profile.id,
      },
    });
  };

  useEffect(() => {
    if (!profile) return;

    const handleCreateElementRealtime = (payload: ElementT & { user_id: string }) => {
      if (payload.user_id === profile.id) return;

      setElements((prev) => [...prev, payload]);
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

    channelRef.current = supabase
      .channel(`object-${boardId}`)
      .on('broadcast', { event: 'object-created' }, ({ payload }) =>
        handleCreateElementRealtime(payload as ElementT & { user_id: string }),
      )
      .on('broadcast', { event: 'object-updated' }, ({ payload }) =>
        handleUpdateElementRealtime(payload as ElementT & { user_id: string }),
      )
      .on('broadcast', { event: 'object-deleted' }, ({ payload }) =>
        handleDeleteElementRealtime(payload as { id: string; user_id: string }),
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
      handleUpdateElement,
      handleDeleteElement,
    },

    loading,

    profile,

    cameraInit,

    setElements,

    elements,
  };
};
