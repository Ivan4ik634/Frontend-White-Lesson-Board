import { PAGES } from '@/configs/PAGES';
import { LinkT } from '@/types/LinkT';
import { FolderOpen, Home, Settings } from 'lucide-react';
export const links: LinkT[] = [
  {
    href: PAGES.HOME,
    name: 'home',
    icon: Home,
  },
  {
    href: PAGES.BOARDS,
    name: 'boards',
    icon: FolderOpen,
  },
  {
    href: PAGES.SETTINGS,
    name: 'settings',
    icon: Settings,
  },
];
