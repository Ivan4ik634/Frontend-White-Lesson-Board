'use client';

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from '@/components/ui/avatar';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PAGES } from '@/configs/PAGES';
import { useBoardAccess } from '@/hooks/useBoardAccess';
import { cn } from '@/lib/utils';
import { useOnlineUsers } from '@/store/onlineUsers';
import { useUsersInBoard } from '@/store/useUsersInBoard';
import { ChevronLeft, LogOut } from 'lucide-react';
import Link from 'next/link';
import { FC } from 'react';
import DialogAdmin from './DialogAdmin';
import DialogShare from './DialogShare';

interface Props {
  boardId: string;
}

const BoardHeader: FC<Props> = ({ boardId }) => {
  const { users } = useUsersInBoard();
  const { onlineUsers } = useOnlineUsers();

  const { isOwner, currentUserId, adminUsers, leaving, kickUser, leaveBoard, kickingUserId } =
    useBoardAccess({ boardId });

  return (
    <header className="flex min-h-12 shrink-0 items-center justify-between gap-2 border-b border-border bg-background px-2 sm:h-11 sm:min-h-11">
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
      <div className="flex min-w-0 shrink-0 items-center gap-1.5 sm:gap-2">
        <DialogShare />
        <DialogAdmin
          isOwner={isOwner}
          adminUsers={adminUsers}
          onlineUsers={onlineUsers}
          kickUser={kickUser}
          kickingUserId={kickingUserId}
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          disabled={leaving || !currentUserId}
          onClick={leaveBoard}
          aria-label="Leave board">
          <LogOut className="size-4" aria-hidden />
        </Button>
        <AvatarGroup className="flex max-w-24 items-center overflow-hidden pl-2 sm:max-w-none">
          {users
            ? users?.slice(0, 3).map((boardUser) => {
                return (
                  <div className="relative flex items-center" key={boardUser.user_id.id}>
                    <Avatar key={boardUser.user_id.id} size="sm" className="sm:size-8">
                      <AvatarImage src={boardUser.user_id?.avatar ?? ''} alt="@shadcn" />
                      <AvatarFallback>{boardUser.user_id.name?.[0] || '0'}</AvatarFallback>
                    </Avatar>
                    {onlineUsers.includes(boardUser.user_id.id) ? (
                      <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border z-200 bg-green-500" />
                    ) : (
                      <div className="absolute bottom-0 right-0 h-2 w-2 rounded-full border z-200 bg-gray-500" />
                    )}
                  </div>
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
