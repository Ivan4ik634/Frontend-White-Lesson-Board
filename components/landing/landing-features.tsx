import { features } from '@/data/features';
import { useTranslations } from 'next-intl';
import Description from '../ui/description';
import Title from '../ui/title';

export function LandingFeatures() {
  const t = useTranslations('landing');

  return (
    <section id="features" className=" px-4 py-20sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] mt-4 text-slate-500">
            {t('features')}
          </p>
          <h2 className="mt-4  text-3xl font-semibold tracking-normal sm:text-4xl">
            {t('featuresTitle')}
          </h2>
          <p className="mt-5 text-lg leading-8 ">
            {t('featuresDescription')}
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-lg border p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5">
              <div className="flex size-11 items-center justify-center rounded-lg shadow-sm ring-1  transition duration-300 group-hover:scale-105">
                <feature.icon className="size-5" aria-hidden />
              </div>
              <Title className="mt-5 text-lg font-semibold">
                {t(`feature${index + 1}Title`)}
              </Title>
              <Description className="mt-3 text-sm leading-6 ">
                {t(`feature${index + 1}Text`)}
              </Description>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
