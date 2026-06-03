'use client';

import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { BoardUserT } from '@/types/Board';
import { CursorsCanvas } from '@/types/Element';
import { UserT } from '@/types/UserT';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from './useProfile';

type CursorPoint = {
  x: number;
  y: number;
};

type CursorMovedPayload = CursorPoint & {
  board_id: string;
  board_user_id: string;
  user_id: UserT;
};

type CursorLeftPayload = {
  board_user_id: string;
};

type UseBoardCursorsProps = {
  boardId: string;
};

const BROADCAST_INTERVAL = 40;
const PERSIST_INTERVAL = 500;

export const useBoardCursors = ({ boardId }: UseBoardCursorsProps) => {
  const { profile } = useProfile();
  const { setUsers } = useUsersInBoard();
  const [cursors, setCursors] = useState<CursorsCanvas[]>([]);
  const boardUserRef = useRef<BoardUserT | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const lastBroadcastRef = useRef(0);
  const lastPersistRef = useRef(0);

  const upsertBoardUser = useCallback(
    (nextUser: BoardUserT) => {
      setUsers((prev) => {
        const exists = prev.some((user) => user.id === nextUser.id);

        if (!exists) return [...prev, nextUser];

        return prev.map((user) => (user.id === nextUser.id ? nextUser : user));
      });

      if (nextUser.user_id.id === profile?.id) return;

      setCursors((prev) => {
        const nextCursors = prev.filter(
          (cursor) => cursor.id !== nextUser.id && cursor.user_id.id !== nextUser.user_id.id,
        );

        return [...nextCursors, nextUser];
      });
    },
    [profile?.id, setUsers],
  );

  const fetchBoardUser = useCallback(
    async (userId: string) => {
      const { data, error } = await boardUserService.findOne(userId, boardId);

      if (error) {
        toast.error(error.message);
        return null;
      }

      if (data.user_id.id === profile?.id) {
        boardUserRef.current = data;
      }

      upsertBoardUser(data);
      return data;
    },
    [boardId, profile?.id, upsertBoardUser],
  );

  useEffect(() => {
    const channel = supabase
      .channel(`board-users-${boardId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'board_user',
          filter: `board_id=eq.${boardId}`,
        },
        async (payload) => {
          const newRequest = payload.new;

          await fetchBoardUser(newRequest.user_id);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'board_user',
          filter: `board_id=eq.${boardId}`,
        },
        async (payload) => {
          const updatedRequest = payload.new;

          await fetchBoardUser(updatedRequest.user_id);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [boardId, fetchBoardUser]);

  useEffect(() => {
    const getBoardUsers = async () => {
      const { data } = await boardUserService.findInBoard(boardId);

      if (!data) return;

      setUsers(data);
      boardUserRef.current = data.find((boardUser) => boardUser.user_id.id === profile?.id) ?? null;
      setCursors(data.filter((boardUser) => boardUser.user_id.id !== profile?.id));
    };

    void getBoardUsers();
  }, [boardId, profile?.id, setUsers]);

  useEffect(() => {
    if (!profile) return;

    const handleCursorMoved = (payload: CursorMovedPayload) => {
      if (payload.board_id !== boardId || payload.user_id.id === profile.id) return;

      upsertBoardUser({
        id: payload.board_user_id,
        board_id: payload.board_id,
        user_id: payload.user_id,
        x: payload.x,
        y: payload.y,
      });
    };

    const handleCursorLeft = (payload: CursorLeftPayload) => {
      setCursors((prev) => prev.filter((cursor) => cursor.id !== payload.board_user_id));
    };

    channelRef.current = supabase
      .channel(`cursor-${boardId}`)
      .on('broadcast', { event: 'cursor-moved' }, ({ payload }) =>
        handleCursorMoved(payload as CursorMovedPayload),
      )
      .on('broadcast', { event: 'cursor-left' }, ({ payload }) =>
        handleCursorLeft(payload as CursorLeftPayload),
      )
      .subscribe();

    return () => {
      if (boardUserRef.current) {
        void channelRef.current?.send({
          type: 'broadcast',
          event: 'cursor-left',
          payload: {
            board_user_id: boardUserRef.current.id,
          },
        });
      }

      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [boardId, profile, upsertBoardUser]);

  const handleCursorMove = useCallback(
    async ({ x, y }: CursorPoint) => {
      if (!profile) return;

      let boardUser = boardUserRef.current;

      if (!boardUser) {
        boardUser = await fetchBoardUser(profile.id);
        if (!boardUser) return;
      }

      const now = Date.now();

      if (now - lastBroadcastRef.current >= BROADCAST_INTERVAL) {
        lastBroadcastRef.current = now;

        void channelRef.current?.send({
          type: 'broadcast',
          event: 'cursor-moved',
          payload: {
            board_id: boardId,
            board_user_id: boardUser.id,
            user_id: profile,
            x,
            y,
          },
        });
      }

      if (now - lastPersistRef.current < PERSIST_INTERVAL) return;

      lastPersistRef.current = now;
      boardUserRef.current = {
        ...boardUser,
        x,
        y,
      };

      await boardUserService.update(boardId, profile.id, x, y);
    },
    [boardId, profile],
  );

  return {
    cursors,
    handleCursorMove,
  };
};
