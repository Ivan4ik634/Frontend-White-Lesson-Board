import { Button } from '@/components/ui/button';
import { PAGES } from '@/configs/PAGES';
import { ArrowRight, CirclePlay, UsersRound } from 'lucide-react';
import Link from 'next/link';
import { LandingCanvasPreview } from './landing-canvas-preview';

const stats = [
  { value: '1 board', label: 'for class notes, sketches, and tasks' },
  { value: 'Live', label: 'teamwork for lessons and group projects' },
  { value: '0 setup', label: 'create a room, share the code, start together' },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8">
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
            <UsersRound className="size-4 text-slate-700" aria-hidden />
            Built for school lessons, study groups, and class teams
          </div>

          <h1 className="mt-7 text-balance text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
            A shared whiteboard for teamwork.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-8 text-slate-600 sm:text-xl">
            Claro helps classmates explain ideas, draw diagrams, split assignment tasks, and keep
            the whole group moving together during lessons and projects.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 gap-2 rounded-lg bg-slate-950 px-6 text-base font-medium text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">
              <Link href={PAGES.REGISTER}>
                Start Teamwork
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 gap-2 rounded-lg border-slate-200 bg-white px-6 text-base font-medium text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50">
              <Link href="#about">
                <CirclePlay className="size-4" aria-hidden />
                Learn More
              </Link>
            </Button>
          </div>

          <div className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.value}
                className="rounded-lg border border-slate-200 bg-white px-5 py-4 text-left shadow-sm">
                <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm leading-5 text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <LandingCanvasPreview />
      </div>
    </section>
  );
}
