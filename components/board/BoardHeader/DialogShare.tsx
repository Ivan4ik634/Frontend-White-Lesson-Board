'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { boardService } from '@/services/board.service';
import { BoardT } from '@/types/Board';
import { Check, Copy, Globe2, LockKeyhole, Share2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const DialogShare = () => {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [access, setAccess] = useState<BoardT['access']>('private');
  const param: { id: string } = useParams();

  const { data: board, refetch: refetchBoard } = useSupabaseQuery<BoardT>(
    () => boardService.findOne(param.id),
    {
      onError: (error) => toast.error(error.message),
      onSuccess: (data) => {
        if (data?.access) setAccess(data.access);
      },
    },
    [param.id],
  );
  async function copyBoardLink() {
    const url = `${window.location.origin}/board/${param.id}/invite`;

    try {
      await navigator.clipboard.writeText(url);
      toast.success('Invite link copied');
    } catch {
      toast.error('Could not copy board link');
    }
  }

  async function updateAccess() {
    setSaving(true);

    const { error } = await boardService.update(param.id, { access });

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await refetchBoard();
    setOpen(false);
    toast.success(`Board is now ${access}`);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <Share2 className="size-3.5" aria-hidden />
        <span className="hidden sm:inline">Share</span>
      </DialogTrigger>
      <DialogContent className="max-w-sm max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:top-auto max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-b-none">
        <DialogHeader>
          <DialogTitle>Board access</DialogTitle>
          <DialogDescription>Choose who can open this board by link.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          {(['private', 'public'] as const).map((value) => {
            const selected = access === value;
            const Icon = value === 'public' ? Globe2 : LockKeyhole;

            return (
              <Button
                key={value}
                type="button"
                variant={selected ? 'secondary' : 'outline'}
                className="h-auto justify-start gap-3 p-3 text-left"
                onClick={() => setAccess(value)}>
                <Icon className="size-4" aria-hidden />
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium capitalize">{value}</span>
                  <span className="block text-xs font-normal text-muted-foreground">
                    {value === 'public'
                      ? 'Anyone with the link can open it.'
                      : 'Only invited users can open it.'}
                  </span>
                </span>
                {selected && <Check className="size-4 text-primary" aria-hidden />}
              </Button>
            );
          })}
        </div>

        <p className="opacity-50">Note: Max users: 4</p>

        <DialogFooter className="max-sm:[&_[data-slot=button]]:h-10">
          <Button type="button" variant="outline" onClick={copyBoardLink}>
            <Copy className="size-4" aria-hidden />
            Copy link
          </Button>
          <Button type="button" disabled={saving || !board} onClick={updateAccess}>
            {saving ? 'Saving...' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogShare;
