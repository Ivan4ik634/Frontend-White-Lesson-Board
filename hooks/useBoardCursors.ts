'use client';

import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { BoardUserT } from '@/types/Board';
import { RealtimeChannel } from '@supabase/supabase-js';
import { type RefObject, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useProfile } from './useProfile';

type UseBoardCursorsProps = {
  boardId: string;
  canvasRef: RefObject<HTMLDivElement | null>;
  zoom: number;
  mode: 'demo' | 'board';
};

const BROADCAST_INTERVAL = 40;
const PERSIST_INTERVAL = 1500;

export const useBoardCursors = ({ boardId, canvasRef, zoom, mode }: UseBoardCursorsProps) => {
  const { setUsers, addUser } = useUsersInBoard();
  const { profile } = useProfile();

  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    setUsers([]);
  }, [boardId]);

  useEffect(() => {
    if (mode === 'demo') return;
    const getUsers = async () => {
      const { data, error } = await boardUserService.findInBoard(boardId);
      if (error) {
        toast.error(error.message);
        return;
      }
      setUsers(data);
    };
    getUsers();
  }, []);

  useEffect(() => {
    if (mode === 'demo') return;
    const channel = supabase
      .channel(`user-add-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'board_user',
          filter: `board_id=eq.${boardId}`,
        },
        async (payload) => {
          const { data } = await boardUserService.findOne(payload.new.user_id, boardId);
          if (!data) return;
          addUser(data as BoardUserT);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [boardId]);

  useEffect(() => {
    if (mode === 'demo') return;
    channelRef.current = supabase
      .channel(`board-cursors-${boardId}`)
      .on('broadcast', { event: 'cursor-moved' }, async ({ payload }) => {
        const p = payload as {
          boardUserId: string;
          x: number;
          y: number;
        };

        setUsers((users) =>
          users.map((user) =>
            user.user_id.id === p.boardUserId
              ? {
                  ...user,
                  x: p.x,
                  y: p.y,
                }
              : user,
          ),
        );
      })
      .subscribe((status) => {});

    return () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [boardId]);

  const lastUpdateRef = useRef(0);
  const lastUpdatePersistRef = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (mode === 'demo') return;

    const canvas = canvasRef.current;

    const handlePointerMove = async (event: PointerEvent) => {
      if (!profile) return;

      const rect = canvas.getBoundingClientRect();

      const x = (event.clientX - rect.left) / zoom;
      const y = (event.clientY - rect.top) / zoom;

      if (Date.now() - lastUpdateRef.current < BROADCAST_INTERVAL) return;

      lastUpdateRef.current = Date.now();

      void channelRef.current?.send({
        type: 'broadcast',
        event: 'cursor-moved',
        payload: {
          boardUserId: profile.id,
          x,
          y,
        },
      });

      if (Date.now() - lastUpdatePersistRef.current < PERSIST_INTERVAL) return;

      lastUpdatePersistRef.current = Date.now();
      await boardUserService.update(boardId, profile.id, Math.round(x), Math.round(y));
    };

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [profile, zoom]);
};
