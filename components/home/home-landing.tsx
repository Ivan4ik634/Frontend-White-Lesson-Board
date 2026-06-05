'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { boardUserService } from '@/services/board-user.service';
import Cookies from 'js-cookie';
import { LogOut, Plus, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function HomeLanding() {
  const router = useRouter();
  const [boardId, setBoardId] = useState('');

  const { profile } = useProfile();

  const trimmed = boardId.trim();
  const canJoin = trimmed.length > 0;

  async function join() {
    if (!canJoin) return;

    const { data } = await supabase.from('board').select('*').eq('id', trimmed).maybeSingle();
    if (!data) return toast.error('Board not found');

    router.push(PAGES.INVITE_IN_BOARD(data.id));
  }
  async function logout() {
    await supabase.auth.signOut();
    Cookies.remove('auth');
    window.location.href = PAGES.LOGIN;
  }

  async function createBoard() {
    if (!profile) return;
    const { data } = await supabase
      .from('board')
      .insert({ user_id: profile?.id })
      .select()
      .single();
    await boardUserService.create(data.id, profile.id);
    router.push(PAGES.BOARD(data.id));
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 flex min-h-16 w-full items-center justify-between gap-3 border-b border-border/70 bg-background/85 px-4 py-3 backdrop-blur sm:min-h-[75px] sm:px-6">
        <div className="flex min-w-0 items-center">
          <Avatar size="lg" className="size-9 sm:size-10">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback>{profile?.name?.[0] ?? <User className="size-4" />}</AvatarFallback>
          </Avatar>
          <div className="ml-3 min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground sm:text-sm">
              Profile
            </p>
            <p className="truncate text-sm font-medium sm:text-base">{profile?.name}</p>
          </div>
        </div>
        <Button
          onClick={() => logout()}
          variant="outline"
          size="icon-lg"
          className="sm:h-9 sm:w-auto sm:px-3"
          aria-label="Log out">
          <LogOut className="size-4" />
          <span className="hidden ml-2 sm:inline">Log out</span>
        </Button>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8 sm:px-8 sm:py-14">
        <section className="flex w-full max-w-xl flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            Ready for your next shared board?
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            A calm space for work, study, friends, and creative plans. Enter a room code to join
            your group board, or start a new one in one click.
          </p>

          <div className="mt-8 space-y-3">
            <label htmlFor="board-code" className="sr-only">
              Board code
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Input
                id="board-code"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') join();
                }}
                placeholder="Enter your team board code"
                autoComplete="off"
                spellCheck={false}
                className="h-12 rounded-xl border-border/80 bg-background text-base shadow-sm sm:min-w-0 sm:flex-1"
              />
              <Button
                type="button"
                disabled={!canJoin}
                onClick={join}
                className={cn('h-12 w-full px-6 text-base font-medium sm:w-auto')}>
                Join
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Use the code someone shared with you, or any board ID you have used before.
            </p>
          </div>

          <div className="relative my-7 flex items-center justify-center gap-4 sm:my-8">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              or
            </span>
          </div>

          <Button
            onClick={createBoard}
            className="h-12 w-full rounded-xl border-border/80 text-base font-medium shadow-sm">
            <Plus className="size-4" aria-hidden />
            Start a new team board
          </Button>
        </section>
      </main>
    </div>
  );
}
