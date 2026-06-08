import { features } from '@/data/features';

export function LandingFeatures() {
  return (
    <section id="features" className="bg-white px-4 py-20 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            Features
          </p>
          <h2 className="mt-4  text-3xl font-semibold tracking-normal sm:text-4xl">
            Everything teams need to turn ideas into clear, structured outcomes.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Claro gives teams a shared space to explain ideas, plan work, organize tasks, and learn
            or build together.
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
