'use client';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGES } from '@/configs/PAGES';
import { cn } from '@/lib/utils';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import DialogShare from './DialogShare';

interface Props {
  boardId: string;
}

const BoardHeader: FC<Props> = ({ boardId }) => {
  const { users } = useUsersInBoard();

  return (
    <header className="bg-background flex justify-between h-11 shrink-0 items-center gap-2 border-b border-border px-2">
      <div className="flex min-w-0 items-center gap-1">
        <Link
          href={PAGES.HOME}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
            'shrink-0 text-muted-foreground hover:text-foreground',
          )}
          aria-label="Back to home">
          <ChevronLeft className="size-4" />
        </Link>
        <span className="text-muted-foreground truncate font-mono text-xs" title={boardId}>
          {boardId}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <DialogShare />
        <AvatarGroup className="flex items-center gap-2">
          {users
            ? users?.map((boardUser) => {
                console.log(boardUser);
                return (
                  <Avatar key={boardUser.user_id.id}>
                    <AvatarImage src={boardUser.user_id?.avatar ?? ''} alt="@shadcn" />
                    <AvatarFallback>{boardUser.user_id.name?.[0] || '0'}</AvatarFallback>
                  </Avatar>
                );
              })
            : Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
        </AvatarGroup>
      </div>
    </header>
  );
};

export default BoardHeader;
