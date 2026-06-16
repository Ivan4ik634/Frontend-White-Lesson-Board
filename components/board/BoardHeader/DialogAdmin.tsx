'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BoardUserT } from '@/types/Board';
import { Shield, UserMinus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props {
  isOwner: boolean;
  adminUsers: BoardUserT[];
  onlineUsers: string[];
  kickUser: (userId: string) => void;
  kickingUserId: string | null;
}

const DialogAdmin: FC<Props> = ({ isOwner, adminUsers, onlineUsers, kickUser, kickingUserId }) => {
  const t = useTranslations('whiteboard');

  return isOwner ? (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="icon-sm" />}>
        <Shield className="size-4" aria-hidden />
        <span className="sr-only">{t('adminMenu')}</span>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none">
        <DialogHeader>
          <DialogTitle>{t('adminMenu')}</DialogTitle>
          <DialogDescription>{t('adminDescription')}</DialogDescription>
        </DialogHeader>

        <div className="grid max-h-72 gap-2 overflow-y-auto pr-1">
          {adminUsers.length > 0 ? (
            adminUsers.map((boardUser) => {
              const user = boardUser.user_id;
              const online = onlineUsers.includes(user.id);
              const kicking = kickingUserId === user.id;

              return (
                <div
                  key={boardUser.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-2">
                  <Avatar size="sm" className="size-8">
                    <AvatarImage src={user.avatar ?? ''} alt={user.name ?? 'User'} />
                    <AvatarFallback>{user.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name ?? 'User'}</p>
                    <Badge variant={online ? 'secondary' : 'outline'} className="mt-1">
                      {online ? t('online') : t('offline')}
                    </Badge>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={kicking}
                    onClick={() => kickUser(user.id)}>
                    <UserMinus className="size-3.5" aria-hidden />
                    {kicking ? t('kicking') : t('kick')}
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
              {t('noUsers')}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default DialogAdmin;
