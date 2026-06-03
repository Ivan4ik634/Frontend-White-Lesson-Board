import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { boardService } from '@/services/board.service';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { BoardT } from '@/types/Board';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useProfile } from './useProfile';

interface Props {
  boardId: string;
}
export const useBoardAccess = ({ boardId }: Props) => {
  const router = useRouter();
  const { profile } = useProfile();

  const [board, setBoard] = useState<BoardT | null>(null);
  const [leaving, setLeaving] = useState(false);
  const { users, removeUser } = useUsersInBoard();

  const [kickingUserId, setKickingUserId] = useState<string | null>(null);
  const adminChannelRef = useRef<RealtimeChannel | null>(null);

  const isOwner = board?.user_id === profile?.id;
  const currentUserId = profile?.id;
  const adminUsers = useMemo(
    () => users.filter((boardUser) => boardUser.user_id.id !== currentUserId),
    [currentUserId, users],
  );

  useEffect(() => {
    let ignore = false;

    async function getBoard() {
      const { data, error } = await boardService.findOne(boardId);

      if (ignore) return;

      if (error) {
        toast.error(error.message);
        return;
      }

      setBoard(data);
    }

    void getBoard();

    return () => {
      ignore = true;
    };
  }, [boardId]);

  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabase
      .channel(`board-admin-${boardId}`)
      .on('broadcast', { event: 'user-kicked' }, ({ payload }) => {
        const kickedUserId = (payload as { user_id?: string }).user_id;

        removeUser(kickedUserId ?? '');

        if (kickedUserId !== currentUserId) return;

        toast.error('You were removed from this board');
        router.replace(PAGES.HOME);
      })
      .on('broadcast', { event: 'user-leaved' }, ({ payload }) => {
        const leavedUserId = (payload as { user_id?: string }).user_id;

        removeUser(leavedUserId ?? '');

        if (leavedUserId !== currentUserId) return;

        router.replace(PAGES.HOME);
      })
      .subscribe();

    adminChannelRef.current = channel;

    return () => {
      adminChannelRef.current = null;
      void supabase.removeChannel(channel);
    };
  }, [boardId, currentUserId, removeUser, router]);

  useEffect(() => {
    if (!board || !currentUserId || isOwner) return;

    let ignore = false;
    const userId = currentUserId;

    async function checkMembership() {
      const { error } = await boardUserService.findOne(userId, boardId);

      if (ignore || !error) return;

      toast.error('You do not have access to this board');
      router.replace(PAGES.HOME);
    }

    void checkMembership();

    return () => {
      ignore = true;
    };
  }, [board, boardId, currentUserId, isOwner, router]);

  async function leaveBoard() {
    if (!currentUserId) return;

    setLeaving(true);

    const { error } = await boardUserService.delete(boardId, currentUserId);

    setLeaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    removeUser(currentUserId);

    await adminChannelRef.current?.send({
      type: 'broadcast',
      event: 'user-leaved',
      payload: { user_id: profile?.id },
    });
    router.replace(PAGES.HOME);
  }

  async function kickUser(userId: string) {
    if (!isOwner || userId === currentUserId) return;

    setKickingUserId(userId);

    const { error } = await boardUserService.delete(boardId, userId);

    setKickingUserId(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    removeUser(userId);
    await adminChannelRef.current?.send({
      type: 'broadcast',
      event: 'user-kicked',
      payload: { user_id: userId },
    });
    toast.success('User removed from board');
  }

  return {
    board,
    isOwner,
    currentUserId,
    adminUsers,
    leaving,
    kickUser,
    leaveBoard,
    kickingUserId,
  };
};
