import CallBackGoogle from '@/components/auth/CallBack/Google';
import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';
import { FC } from 'react';

export const metadata: Metadata = {
  title: 'Google Sign In',
  robots: noIndexRobots,
};

const CallBackGooglePage: FC = () => {
  return <CallBackGoogle />;
};

export default CallBackGooglePage;
