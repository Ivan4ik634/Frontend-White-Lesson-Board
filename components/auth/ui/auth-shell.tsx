import type { ReactNode } from 'react';

import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type AuthShellProps = {
  title: string;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthShell({ title, children, footer }: AuthShellProps) {
  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-[min(100%,22rem)]">
        <CardHeader className="space-y-1 pb-2 text-center">
          <CardTitle className="font-heading text-2xl font-semibold tracking-tight">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-0">{children}</CardContent>
        <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
      </div>
    </div>
  );
}
