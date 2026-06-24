'use client';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';
import { useProfile } from '@/hooks/useProfile';
import { useBoardsStore } from '@/store/useBoards';
import { useFilterBoards } from '@/store/useFilterBoards';
import { filtersBoards } from '@/utils/filtersBoards';
import { useTranslations } from 'next-intl';
import { FC, useState } from 'react';
import DialogFormBoard from '../DialogFormBoard';
import Board from './Board';
import FiltersBoards from './Filters';

interface Props {}

const BoardsPage: FC<Props> = (props) => {
  const [open, setOpen] = useState(false);

  const { boards } = useBoardsStore();
  const { filters } = useFilterBoards();
  const { profile } = useProfile();
  const t = useTranslations('boards');
  const { filteredBoards } = filtersBoards(boards, filters);
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title>{t('title')}</Title>
        <Button size="lg" onClick={() => setOpen(true)} className="w-full sm:w-auto">
          {t('create')}
        </Button>
        <DialogFormBoard setOpen={setOpen} open={open} type="create" />
      </div>
      <FiltersBoards />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {profile &&
          filteredBoards.map((board) => (
            <Board
              profile={profile.id}
              isOwner={board.user_id === profile.id}
              key={board.id}
              {...board}
            />
          ))}
      </div>
    </div>
  );
};

export default BoardsPage;
