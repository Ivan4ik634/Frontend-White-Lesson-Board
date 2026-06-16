'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from '@/store/useTheme';
import { useTranslations } from 'next-intl';

export default function Theme() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('settings');

  return (
    <Card>
      <CardContent>
        <CardHeader>
          <CardTitle>{t('theme')}</CardTitle>
        </CardHeader>

        <div className="mt-2 grid gap-4 sm:grid-cols-2">
          <div onClick={() => setTheme('light')} className="flex flex-col items-start p-4 relative">
            <div className="w-full h-40 rounded-md bg-white border" />
            <div className=" absolute top-[50%] transform text-black -translate-1/2 left-[50%]">
              {t('light')}
            </div>
          </div>

          <div onClick={() => setTheme('dark')} className="flex flex-col items-start p-4 relative">
            <div className="w-full h-40 rounded-md  bg-black border" />
            <div className=" text-white absolute top-[50%] transform -translate-1/2 left-[50%]">
              {t('dark')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
