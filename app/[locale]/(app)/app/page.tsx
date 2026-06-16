import { HomeLanding } from '@/components/App/Home/home-landing';
import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'App',
  description: 'Create or join a private collaborative board for work, study, friends, and teams.',
  alternates: {
    canonical: '/app',
  },
  robots: noIndexRobots,
};

export default function AppHomePage() {
  return (
    <div className="relative">
      <HomeLanding />
    </div>
  );
}
