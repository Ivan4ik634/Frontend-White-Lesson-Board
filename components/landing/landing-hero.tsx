import { Button } from '@/components/ui/button';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { ArrowRight, CirclePlay, UsersRound } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge } from '../ui/badge';
import Description from '../ui/description';
import Title from '../ui/title';
import { LandingCanvasPreview } from './landing-canvas-preview';

const stats = [
  { value: '1 board', label: 'for notes, sketches, tasks, and plans' },
  { value: 'Live', label: 'teamwork for work, study, and friends' },
  { value: '0 setup', label: 'create a room, share the code, start together' },
];

export function LandingHero() {
  const t = useTranslations('landing');
  return (
    <section className="relative overflow-hidden  px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <Badge
            variant="outline"
            className="px-3 text-sm font-medium py-4 text-slate-950 dark:text-slate-50">
            <UsersRound />
            {t('badge')}
          </Badge>

          <Title className="mt-7  text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
            {t('headline')}
          </Title>
          <Description className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8  sm:text-xl">
            {t('description')}
          </Description>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 gap-2 rounded-lg  w-full sm:w-auto  px-6 text-base font-medium  shadow-sm transition hover:-translate-y-0.5 ">
              <Link href={PAGES.REGISTER}>
                {t('start')}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 gap-2 rounded-lg w-full  sm:w-auto px-6 text-base font-medium shadow-sm transition hover:-translate-y-0.5 ">
              <Link href="#about">
                <CirclePlay className="size-4" aria-hidden />
                {t('learnMore')}
              </Link>
            </Button>
          </div>

          {/* <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-left shadow-sm">
                <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </div>

        <LandingCanvasPreview />
      </div>
    </section>
  );
}
