'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { boardUserService } from '@/services/board-user.service';
import Cookies from 'js-cookie';
import { LogOut, Plus } from 'lucide-react';
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
    if (!data) return toast.error('Not found lesson board');

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
    <>
      <header className="fixed px-6  flex justify-between items-center top-0 left-0 w-full h-[75px]">
        <div className="flex items-center">
          <Avatar size="lg">
            <AvatarImage src={profile?.avatar} />
            <AvatarFallback>{profile?.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-bold">Profile</p>
            <p>{profile?.name}</p>
          </div>
        </div>
        <div>
          <Button onClick={() => logout()}>
            <LogOut className="size-4" />
            <p>Log out</p>
          </Button>
        </div>
      </header>
      <div className="flex h-dvh flex-col">
        <main className="flex flex-1 flex-col items-center justify-center px-4 py-10 sm:px-8 sm:py-14">
          <section className="order-1 flex flex-col justify-center lg:order-2 lg:pl-2">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Ready for your next lesson?
            </h1>
            <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              A calm space to sketch, explain, and work together. Enter a room code to join an
              existing board, or start a new one in one click.
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
                  placeholder="Enter a board or room code"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-12 rounded-xl border-border/80 bg-background text-base shadow-sm sm:min-w-0 sm:flex-1"
                />
                <Button
                  type="button"
                  disabled={!canJoin}
                  onClick={join}
                  className={cn('h-12  px-6 text-base font-medium ')}>
                  Join
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Use the code your teacher shared, or any ID you have used before.
              </p>
            </div>

            <div className="relative my-8 flex justify-center items-center gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                or
              </span>
            </div>

            <div className="w-full flex i">
              <Button
                onClick={createBoard}
                className="h-12 w-full rounded-xl border-border/80 text-base font-medium shadow-sm ">
                <Plus className="size-4" aria-hidden />
                Start a new board
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
