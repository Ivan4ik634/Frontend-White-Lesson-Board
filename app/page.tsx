import { HomeLanding } from '@/components/home/home-landing';

export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
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
