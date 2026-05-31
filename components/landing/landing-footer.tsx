'use client';
import { footerLinks, socialLinks } from '@/data/footer';
import Link from 'next/link';
import { toast } from 'sonner';

export function LandingFooter() {
  return (
    <footer className="bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-3">
            <img src="Logo.png" className="h-10 w-10 object-cover rounded-[6px]" />
            <span className="text-lg font-semibold tracking-tight text-white">Claro</span>
          </Link>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            A collaborative whiteboard for teams, study groups, friends, and creators to brainstorm,
            organize ideas, and work together in real time on learning, planning, and projects.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 md:gap-14">
          <div>
            <h2 className="text-sm font-semibold text-white">Navigation</h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-400">
              {footerLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-white">Social</h2>
            <div className="mt-4 flex gap-2">
              {socialLinks.map((link) => {
                if (link.href === null)
                  return (
                    <div
                      key={link.label}
                      aria-label={link.label}
                      onClick={() =>
                        navigator.clipboard
                          .writeText(window.location.href)
                          .then(() => toast.success('Link copied'))
                      }
                      className="flex cursor-pointer size-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white">
                      <link.icon className="size-4" aria-hidden />
                    </div>
                  );
                return (
                  <Link
                    target="_blank"
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="flex size-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:-translate-y-0.5 hover:border-white/30 hover:text-white">
                    <link.icon className="size-4" aria-hidden />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-slate-500">
        Copyright {new Date().getFullYear()} Claro. All rights reserved.
      </div>
    </footer>
  );
}
