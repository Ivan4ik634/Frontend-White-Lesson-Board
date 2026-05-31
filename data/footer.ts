import { PAGES } from '@/configs/PAGES';
import { Share2 } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { RiTelegram2Fill } from 'react-icons/ri';

export const footerLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Login', href: PAGES.LOGIN },
  { label: 'Register', href: PAGES.REGISTER },
];

export const socialLinks = [
  { label: 'Social feed', href: null, icon: Share2 },
  { label: 'Twitter', href: '#', icon: FaXTwitter },
  { label: 'Telegram', href: '#', icon: RiTelegram2Fill },
];
