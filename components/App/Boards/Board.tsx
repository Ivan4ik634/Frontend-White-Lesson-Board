'use client';

import { Card, CardContent } from '@/components/ui/card';
import Description from '@/components/ui/description';
import Title from '@/components/ui/title';
import { PAGES } from '@/configs/PAGES';
import { BoardT } from '@/types/Board';
import dayjs from 'dayjs';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props extends BoardT {}

const Board: FC<Props> = (props) => {
  const t = useTranslations('boards');
  const access = props.access === 'public' ? t('public') : t('private');

  return (
    <Card className="h-full overflow-hidden">
      <CardContent className="h-full">
        <Link href={PAGES.BOARD(props.id)} className="flex h-full w-full flex-col">
          {props.image && (
            <img
              src={props.image}
              className="object-cover w-full aspect-video rounded-[5px]"
              alt={props.title}
            />
          )}
          <div className="mt-3 flex flex-1 flex-col p-2">
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
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default Board;
