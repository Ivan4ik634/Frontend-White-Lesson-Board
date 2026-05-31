import { points } from '@/data/about';

export function LandingAbout() {
  return (
    <section id="about" className="border-y border-slate-200 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">About</p>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
            A calmer way for people to work together.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Projects work better when everyone can see the plan. Claro turns work sessions, study
            groups, creative planning, and friendly brainstorms into shared visual spaces where
            ideas are easier to discuss, improve, and finish together.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
          {points.map((point) => (
            <article
              key={point.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex size-11 items-center justify-center rounded-lg bg-white text-slate-950 shadow-sm ring-1 ring-slate-200">
                <point.icon className="size-5" aria-hidden />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
