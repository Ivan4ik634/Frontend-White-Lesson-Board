'use client';

import { Button } from '@/components/ui/button';
import Title from '@/components/ui/title';
import { useBoardsStore } from '@/store/useBoards';
import { useFilterBoards } from '@/store/useFilterBoards';
import { filtersBoards } from '@/utils/filtersBoards';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import DialogCreateBoard from '../DialogCreateBoard';
import Board from './Board';
import FiltersBoards from './Filters';

interface Props {}

const BoardsPage: FC<Props> = (props) => {
  const { boards } = useBoardsStore();
  const { filters } = useFilterBoards();
  const t = useTranslations('boards');
  const { filteredBoards } = filtersBoards(boards, filters);
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Title>{t('title')}</Title>
        <DialogCreateBoard>
          <Button size="lg" className="w-full sm:w-auto">
            {t('create')}
          </Button>
        </DialogCreateBoard>
      </div>
      <FiltersBoards />
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredBoards.map((board) => (
          <Board key={board.id} {...board} />
        ))}
      </div>
    </div>
  );
};

export default BoardsPage;
