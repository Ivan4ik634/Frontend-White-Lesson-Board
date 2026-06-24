'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import { boardUserService } from '@/services/board-user.service';
import { boardService } from '@/services/board.service';
import { useBoardsStore } from '@/store/useBoards';
import { BoardT } from '@/types/Board';
import { RealtimeChannel } from '@supabase/supabase-js';
import { EllipsisVertical } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FC, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import DialogFormBoard from '../DialogFormBoard';

interface Props extends BoardT {
  isOwner: boolean;
  profile: string;
}

const DropDownMenuBoard: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('boards');
  const { deleteBoard } = useBoardsStore();
  const handleDeleteBoard = async () => {
    deleteBoard(props.id);
    await boardService.delete(props.id);
    toast.success(t('boardDeleted'));
  };
  const adminChannelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase.channel(`board-admin-${props.id}`).subscribe();

    adminChannelRef.current = channel;

    return () => {
      channel.unsubscribe();
    };
  }, [props.id]);

  async function leaveBoard() {
    if (props.isOwner) return;

    const { error } = await boardUserService.delete(props.id, props.profile);

    if (error) {
      toast.error(error.message);
      return;
    }

    await adminChannelRef.current?.send({
      type: 'broadcast',
      event: 'user-leaved',
      payload: { user_id: props.profile || '' },
    });
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex  justify-end">
            <EllipsisVertical />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={props.isOwner ? handleDeleteBoard : leaveBoard}>
              {props.isOwner ? t('boardDelete') : t('boardLeave')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpen(true)}>{t('boardEdit')}</DropdownMenuItem>
            <Link href={PAGES.BOARD(props.id)}>
              <DropdownMenuItem>{t('boardView')}</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <DialogFormBoard
        setOpen={setOpen}
        open={open}
        type="edit"
        boardId={props.id}
        initData={props}
      />
    </>
  );
};

export default DropDownMenuBoard;
