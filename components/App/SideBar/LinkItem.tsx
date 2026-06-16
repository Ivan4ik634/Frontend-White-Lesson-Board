'use client';

import { LinkT } from '@/types/LinkT';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { FC } from 'react';

interface Props extends LinkT {}

const LinkItem: FC<Props> = (props) => {
  const pathname = usePathname();
  const t = useTranslations('sidebar');
  return (
    <Link
      href={props.href}
      className={`flex w-full cursor-pointer items-center rounded-[5px] px-3 py-2 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-stone-950 ${pathname === props.href ? 'bg-slate-100 dark:bg-stone-950' : ''}`}>
      <props.icon className="size-5 shrink-0" />
      <span className="ml-2 truncate">{t(props.name)}</span>
    </Link>
  );
};

export default LinkItem;
