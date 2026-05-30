import {
  Blocks,
  Brush,
  Gauge,
  Layers3,
  MonitorSmartphone,
  MousePointer2,
  Palette,
  UsersRound,
} from 'lucide-react';

const features = [
  {
    icon: UsersRound,
    title: 'Live class teamwork',
    text: 'Work on one board while everyone in the group sees ideas, notes, and sketches appear in real time.',
  },
  {
    icon: Layers3,
    title: 'Group project planning',
    text: 'Plan roles, collect research, map concepts, and turn a class assignment into a clear shared plan.',
  },
  {
    icon: Gauge,
    title: 'Quick lesson flow',
    text: 'A lightweight interface keeps drawing, moving, and editing smooth when the lesson is already moving fast.',
  },
  {
    icon: Brush,
    title: 'Visual explanations',
    text: 'Sketch formulas, timelines, mind maps, and examples so classmates can understand the topic together.',
  },
  {
    icon: MousePointer2,
    title: 'Easy for classmates',
    text: 'Simple controls help students join by code, add their part, and stay focused without extra setup.',
  },
  {
    icon: Palette,
    title: 'Organized notes',
    text: 'Keep sketches, short explanations, and task ideas in one tidy place instead of losing them in chats.',
  },
  {
    icon: Blocks,
    title: 'Shared task space',
    text: 'Use the board as a place for brainstorming, homework planning, presentation prep, and lesson summaries.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Works from anywhere',
    text: 'Designed for classmates in the same classroom, at home, or split across different study groups.',
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="bg-white px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Features
          </p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-normal sm:text-4xl">
            Everything a class team needs to turn discussion into a finished idea.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Claro gives school groups a shared place to explain topics, divide work, prepare
            presentations, and understand the lesson together.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="group rounded-lg border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex size-11 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover:scale-105">
                <feature.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
