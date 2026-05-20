import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: noIndexRobots,
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="flex min-h-svh flex-col bg-background text-foreground">{children}</div>;
}
