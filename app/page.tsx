import { HomeLanding } from '@/components/home/home-landing';
import { siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.title,
  },
  description: siteConfig.description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: '/',
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: siteConfig.name,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  url: siteConfig.url,
  description: siteConfig.description,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.72_0.12_180/0.18),transparent_55%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,oklch(0.45_0.08_180/0.2),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_100%_60%,oklch(0.62_0.18_290/0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_70%_50%_at_100%_60%,oklch(0.42_0.12_290/0.15),transparent_50%)]"
        aria-hidden
      />
      <div className="relative">
        <HomeLanding />
      </div>
    </div>
  );
}
