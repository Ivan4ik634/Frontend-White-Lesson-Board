'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLogout } from '@/hooks/useLogout';
import { useProfile } from '@/hooks/useProfile';
import { usePathname, useRouter } from '@/i18n/navigation';
import { localeLabels, routing, type Locale } from '@/i18n/routing';
import { userService } from '@/services/user.service';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function General() {
  const { handleLogout } = useLogout();
  const { profile } = useProfile();
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('settings');
  const common = useTranslations('common');

  const handleLanguageChange = async (value: Locale | null) => {
    if (!value) return;
    const nextLocale = value as Locale;

    Cookies.set('CLARO_LOCALE', nextLocale, { expires: 365 });
    Cookies.set('NEXT_LOCALE', nextLocale, { expires: 365 });

    if (profile?.id) {
      const { error } = await userService.update(profile.id, { language: nextLocale });
      if (error) toast.error(error.message);
      else toast.success(t('languageSaved'));
    }

    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('general')}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('language')}</p>
          </div>
          <Select value={profile?.language || locale} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {routing.locales.map((item) => (
                <SelectItem key={item} value={item}>
                  {localeLabels[item]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>

      <CardFooter>
        <div className="ml-auto w-full sm:w-auto">
          <Button variant="destructive" onClick={handleLogout} className="w-full sm:w-auto">
            {common('logout')}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
