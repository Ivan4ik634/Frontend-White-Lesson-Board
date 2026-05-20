import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { BoardUserT } from '@/types/Board';
import { UserT } from '@/types/UserT';
import { useEditor } from '@tldraw/tldraw';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from './useProfile';
import { useSupabaseQuery } from './useSupabaseQuery';

export const useBoardCursors = () => {
  const params = useParams<{ id: string }>();
  const editor = useEditor();
  const { profile } = useProfile();
  const { setUsers, addUser } = useUsersInBoard();
  const [positions, setPositions] = useState<{ x: number; y: number; user_id: UserT }[]>([]);

  const { data } = useSupabaseQuery<BoardUserT[]>(() => boardUserService.findInBoard(params.id), {
    onError: (error) => toast.error(error.message),
  });
  useEffect(() => {
    if (!data) return;
    setPositions(data.map((user) => ({ x: user.x, y: user.y, user_id: user.user_id })));
    setUsers(data);
  }, [data]);
  const lastSentRef = useRef(0);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!profile) return;
    if (initializedRef.current) return;

    initializedRef.current = true;

    const channel = supabase.channel(`board-users:${params.id}`);
    const handlePointerMove = async () => {
      const point = editor.inputs.getCurrentPagePoint();
      const now = Date.now();

      if (now - lastSentRef.current < 20) return;

      lastSentRef.current = now;

      channel.send({
        type: 'broadcast',
        event: 'cursor-update',
        payload: {
          x: Math.round(point.x),
          y: Math.round(point.y),
          user_id: profile.id,
        },
      });
    };

    if (!initializedRef.current) return;
    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      initializedRef.current = false;
    };
  }, [editor, profile]);

  useEffect(() => {
    if (!profile) return;
    const handleRemoteUpdate = async (payload: { x: number; y: number; user_id: string }) => {
      if (!payload) return;

      setPositions((prev) => {
        return prev.map((item) => {
          if (item.user_id.id === payload.user_id) {
            return {
              user_id: item.user_id,
              x: payload.x!,
              y: payload.y!,
            };
          }
          return item;
        });
      });
      await boardUserService.update(
        params.id,
        profile.id,
        Math.round(payload.x),
        Math.round(payload.y),
      );
    };
    const channel = supabase
      .channel(`board-users:${params.id}`)
      .on('broadcast', { event: 'cursor-update' }, ({ payload }) => handleRemoteUpdate(payload))
      .subscribe();

    const channel_create_user = supabase
      .channel('board-user-inserts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'board_user',
          filter: `board_id=eq.${params.id}`,
        },
        async (payload) => {
          console.log(payload.new);
          const { data, error } = await boardUserService.findOne(payload.new.user_id, params.id);
          console.log(data, error);
          if (!data) return;
          setPositions((prev) => [...prev, { x: 0, y: 0, user_id: data.user_id }]);
          addUser(data);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
      void supabase.removeChannel(channel_create_user);
    };
  }, [profile]);

  return { positions };
};
