import { PAGES } from '@/configs/PAGES';
import { Share2 } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { RiTelegram2Fill } from 'react-icons/ri';

export const footerLinks = [
  { label: 'about', href: '#about' },
  { label: 'features', href: '#features' },
  { label: 'login', href: PAGES.LOGIN },
  { label: 'register', href: PAGES.REGISTER },
];

export const socialLinks = [
  { label: 'copyLink', href: null, icon: Share2 },
  { label: 'Twitter', href: 'https://x.com/claroboard', icon: FaXTwitter },
  { label: 'Telegram', href: 'https://t.me/claro_communication', icon: RiTelegram2Fill },
];
