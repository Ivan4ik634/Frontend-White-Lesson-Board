import { points } from '@/data/about';
import { useTranslations } from 'next-intl';
import Description from '../ui/description';
import Title from '../ui/title';

export function LandingAbout() {
  const t = useTranslations('landing');

  return (
    <section id="about" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
            {t('about')}
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-normal  sm:text-4xl">
            {t('aboutTitle')}
          </h2>
          <p className="mt-5 text-lg leading-8">
            {t('aboutDescription')}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:gap-5">
          {points.map((point, index) => (
            <article
              key={point.title}
              className="group rounded-lg border p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex size-11 items-center justify-center rounded-lg shadow-sm ring-1 ">
                <point.icon className="size-5" aria-hidden />
              </div>
              <Title className="mt-5 text-lg font-semibold">
                {t(`point${index + 1}Title`)}
              </Title>
              <Description className="mt-3 text-sm leading-6">
                {t(`point${index + 1}Text`)}
              </Description>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
