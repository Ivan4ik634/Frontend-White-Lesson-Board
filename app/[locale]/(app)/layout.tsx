import LocalePreferenceSync from '@/components/App/LocalePreferenceSync';
import SideBar from '@/components/App/SideBar';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <LocalePreferenceSync />
      <SideBar />
      <main className="w-full px-4 pb-24 pt-4 sm:px-6 lg:ml-[300px] lg:w-[calc(100%-300px)] lg:px-8 lg:py-4">
        {children}
      </main>
    </div>
  );
}
