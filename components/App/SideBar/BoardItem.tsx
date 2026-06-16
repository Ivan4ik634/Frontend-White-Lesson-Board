'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { BoardT } from '@/types/Board';
import { FC } from 'react';

interface Props extends BoardT {}

const BoardItem: FC<Props> = (props) => {
  return (
    <Link
      href={PAGES.BOARD(props.id)}
      className={`flex w-full cursor-pointer items-center rounded-[5px] px-3 py-2 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-stone-950`}>
      <Avatar className="shrink-0">
        <AvatarFallback>{props.title?.[0] || 'B'}</AvatarFallback>
        <AvatarImage src={props.image} alt={props.title} />
      </Avatar>
      <span className="ml-2 truncate">{props.title}</span>
    </Link>
  );
};

export default BoardItem;
