'use client';

import { Card, CardContent } from '@/components/ui/card';
import Description from '@/components/ui/description';
import Title from '@/components/ui/title';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { BoardT } from '@/types/Board';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { FC } from 'react';
import DropDownMenuBoard from './DropDownMenuBoard';

interface Props extends BoardT {
  isOwner: boolean;
  profile: string;
}

const Board: FC<Props> = (props) => {
  const t = useTranslations('boards');
  const access = props.access === 'public' ? t('public') : t('private');
  console.log(props.isOwner, props.profile, props.user_id);
  return (
    <Card className="h-full relative overflow-hidden">
      <CardContent className="h-full">
        {props.image && (
          <Link href={PAGES.BOARD(props.id)} className="flex  w-full flex-col">
            <img
              src={props.image}
              className="object-cover w-full aspect-video rounded-[5px]"
              alt={props.title}
            />
          </Link>
        )}
        <div className="mt-3 flex flex-1 flex-col p-2">
          <Link href={PAGES.BOARD(props.id)} className="flex w-full flex-col">
            <Title className="text-lg break-words">{props.title}</Title>
            <Description className="break-words">{props.description}</Description>
            <div className="mt-2">
              <Description>
                {t('access')}: {access}
              </Description>
              <Description>{t('members', { count: props.members_count })}</Description>
              <Description className="mt-2">
                {dayjs(props.created_at).format('DD MMM YYYY')}
              </Description>
            </div>
          </Link>
          <DropDownMenuBoard {...props} />
        </div>
      </CardContent>
    </Card>
  );
};

export default Board;
