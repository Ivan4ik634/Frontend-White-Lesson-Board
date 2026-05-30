import { supabase } from '@/lib/supabase';
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

  const { profile } = useProfile();

  const lastUpdateRef = useRef(0);

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const getObjects = async () => {
      setLoading(true);

      const { data } = await objectService.findInBoard(boardId);

      if (data) {
        setElements(data.flatMap((item) => item.object));
      }

      setLoading(false);
    };

    getObjects();
  }, [boardId]);

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

    if (now - lastUpdateRef.current < 80) return;

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

      setElements((prev) => prev.map((el) => (el.id === payload.id ? payload : el)));
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

    setElements,

    elements,
  };
};
