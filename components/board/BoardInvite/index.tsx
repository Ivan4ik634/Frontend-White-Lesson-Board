'use client';

import { Button } from '@/components/ui/button';
import { PAGES } from '@/configs/PAGES';
import { useProfile } from '@/hooks/useProfile';
import { boardUserService } from '@/services/board-user.service';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface BoardInviteProps {
  boardId: string;
}

export function BoardInvite({ boardId }: BoardInviteProps) {
  const router = useRouter();
  const { profile, loading, error: profileError } = useProfile();
  const [joining, setJoining] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (loading || startedRef.current) return;

    if (profileError || !profile) {
      return;
    }

    startedRef.current = true;
    const userId = profile.id;

    async function acceptInvite() {
      setJoining(true);
      setFailed(false);

      const { data } = await boardUserService.findInBoard(boardId);
      if (!data) {
        setFailed(true);
        setJoining(false);
        toast.error('Board not found');
        return;
      }

      if (data.some((item) => item.user_id.id === userId)) {
        router.replace(PAGES.BOARD(boardId));
        return;
      }
      if (data.length >= 4) {
        setFailed(true);
        setJoining(false);
        toast.error('Board is full');

        router.replace(PAGES.HOME);
        return;
      }

      const { error } = await boardUserService.create(boardId, userId);

      console.log(error);
      if (error) {
        if (error.code === '23505') {
          router.replace(PAGES.BOARD(boardId));
          return;
        }
        if (error.code === '42501') {
          toast.error('Board private');
          setFailed(true);
          setJoining(false);
          router.replace(PAGES.HOME);
          return;
        }
        setFailed(true);
        setJoining(false);
        toast.error(error.message);
        return;
      }

      toast.success('Invitation accepted');
      router.replace(PAGES.BOARD(boardId));
    }

    void acceptInvite();
  }, [attempt, boardId, loading, profile, profileError, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-[calc(2.5rem+env(safe-area-inset-top))]">
      <section className="flex w-full max-w-sm flex-col items-center gap-4 rounded-lg border border-border bg-card px-5 py-8 text-center shadow-sm sm:px-6">
        {joining && !failed ? (
          <Loader2 className="size-7 animate-spin text-muted-foreground" aria-hidden />
        ) : null}
        <div className="space-y-2">
          <h1 className="text-balance text-2xl font-semibold tracking-tight">
            {failed ? 'Could not accept invite' : 'Joining board'}
          </h1>
          <p className="text-pretty text-sm leading-6 text-muted-foreground">
            {failed
              ? 'Please try again or ask for a new invite link.'
              : 'Your invite is being accepted.'}
          </p>
        </div>
        {failed ? (
          <Button
            type="button"
            className="h-10 w-full sm:w-auto"
            onClick={() => {
              startedRef.current = false;
              setJoining(true);
              setFailed(false);
              setAttempt((value) => value + 1);
            }}>
            Try again
          </Button>
        ) : null}
      </section>
    </main>
  );
}
