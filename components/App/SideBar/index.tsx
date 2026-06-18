'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { links } from '@/data/links';
import { useLogout } from '@/hooks/useLogout';
import { useProfile } from '@/hooks/useProfile';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { Link, usePathname } from '@/i18n/navigation';
import { boardUserService } from '@/services/board-user.service';
import { useBoardsStore } from '@/store/useBoards';
import { LogOut, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import DialogCreateBoard from '../DialogCreateBoard';
import BoardItem from './BoardItem';
import LinkItem from './LinkItem';
interface Props {}

const SideBar: FC<Props> = (props) => {
  const { profile } = useProfile();
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  const common = useTranslations('common');
  const { setBoards } = useBoardsStore();

  const { data, loading } = useSupabaseQuery(
    () => boardUserService.findAll(profile?.id || ''),
    {
      onSuccess: (data) => {
        if (data) setBoards(data.flatMap((item) => item.board_id));
      },
      enabled: !!profile?.id,
    },
    [profile?.id],
  );

  const { handleLogout } = useLogout();

  return (
    <>
      <aside className="fixed left-0 top-0 z-20 hidden h-full w-[300px] flex-col gap-4 border-r bg-slate-50 px-3 py-5 dark:bg-stone-900 lg:flex">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <img src="../Logo.png" className="h-10 w-10 rounded-[5px] object-cover" />
          <span className="text-lg font-semibold tracking-tight">Claro</span>
        </Link>
        <div className="shrink-0">
          <p className="opacity-50 mb-3 text-sm">{t('navigation')}</p>
          <div className="flex flex-col gap-y-3">
            {links.slice(0, 2).map((link) => (
              <LinkItem {...link} key={link.name} />
            ))}
          </div>
        </div>
        <div className="min-h-0 flex-1">
          <p className="opacity-50 mb-3 text-sm">{t('boards')}</p>
          <ScrollArea className="h-[540px]">
            <div className="flex flex-col gap-y-3">
              {loading ? (
                <div>{common('loading')}</div>
              ) : data && data.length !== 0 ? (
                data.map((board) => <BoardItem {...board.board_id} key={board.board_id.id} />)
              ) : (
                ''
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="shrink-0">
          <p className="opacity-50 mb-3 text-sm">{t('general')}</p>
          <div className="flex flex-col gap-y-3">
            {links.slice(-1).map((link) => (
              <LinkItem {...link} key={link.name} />
            ))}
            <div
              onClick={handleLogout}
              className={`flex w-full cursor-pointer items-center rounded-[5px] px-3 py-2 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-stone-950`}>
              <LogOut className="size-5 shrink-0" />
              <span className="ml-2 truncate">{common('logout')}</span>
            </div>
          </div>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-slate-50/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur dark:bg-stone-900/95 lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {links.map((link, i) => {
            const isActive = pathname === link.href;

            return (
              <>
                {i === 2 && (
                  <DialogCreateBoard>
                    <div
                      key={link.name}
                      className={`flex min-w-0 flex-col items-center text-muted-foreground justify-center gap-1 rounded-[5px] px-2 py-2 text-xs transition-colors hover:bg-slate-100 dark:hover:bg-stone-950 
                `}>
                      <Plus className="size-5 shrink-0 " />
                    </div>
                  </DialogCreateBoard>
                )}
                <Link
                  href={link.href}
                  key={link.name}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-[5px] px-2 py-2 text-xs transition-colors hover:bg-slate-100 dark:hover:bg-stone-950 ${
                    isActive
                      ? 'bg-slate-100 text-foreground dark:bg-stone-950'
                      : 'text-muted-foreground'
                  }`}>
                  <link.icon className="size-5 shrink-0" />
                  <span className="w-full truncate text-center">{t(link.name)}</span>
                </Link>
              </>
            );
          })}
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-w-0 flex-col items-center justify-center gap-1 rounded-[5px] px-2 py-2 text-xs text-muted-foreground transition-colors hover:bg-slate-100 dark:hover:bg-stone-950">
            <LogOut className="size-5 shrink-0" />
            <span className="w-full truncate text-center">{common('logout')}</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
