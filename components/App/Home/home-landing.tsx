'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import DialogFormBoard from '../DialogFormBoard';
export function HomeLanding() {
  const router = useRouter();
  const [boardId, setBoardId] = useState('');
  const [open, setOpen] = useState(false);

  const t = useTranslations('home');

  const trimmed = boardId.trim();
  const canJoin = trimmed.length > 0;

  async function join() {
    if (!canJoin) return;

    const { data } = await supabase.from('board').select('*').eq('id', trimmed).maybeSingle();
    if (!data) return toast.error('Board not found');

    router.push(PAGES.INVITE_IN_BOARD(data.id));
  }

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col">
      <main className="flex flex-1 flex-col items-center justify-center py-8 sm:py-14">
        <section className="flex w-full max-w-xl flex-col justify-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
            {t('homeTitle')}
          </h1>
          <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t('homeDescription')}
          </p>

          <div className="mt-8 space-y-3">
            <label htmlFor="board-code" className="sr-only">
              {t('boardCode')}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <Input
                id="board-code"
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') join();
                }}
                placeholder={t('placeholderBoardCode')}
                autoComplete="off"
                spellCheck={false}
                className="h-12 rounded-xl border-border/80 bg-background text-base shadow-sm sm:min-w-0 sm:flex-1"
              />
              <Button
                type="button"
                disabled={!canJoin}
                onClick={join}
                className={cn('h-12 w-full px-6 text-base font-medium sm:w-auto')}>
                {t('joinBoard')}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{t('joinBoardDescription')}</p>
          </div>

          <div className="relative my-7 flex items-center justify-center gap-4 sm:my-8">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              {t('or')}
            </span>
          </div>
          <Button
            onClick={() => setOpen(true)}
            className="h-12 w-full rounded-xl border-border/80 text-base font-medium shadow-sm">
            <Plus className="size-4" aria-hidden />
            {t('addBoard')}
          </Button>
          <DialogFormBoard open={open} setOpen={setOpen} type="create" />
        </section>
      </main>
    </div>
  );
}
