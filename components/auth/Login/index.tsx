'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AuthShell } from '@/components/auth/ui/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { createLoginSchema, loginDefaultValues, type LoginFormValues } from '@/types/UserT';
import { AuthFooter } from '../ui/auth-footer';

export function Login() {
  const t = useTranslations('auth');
  const common = useTranslations('common');
  const validation = useTranslations('validation');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(validation)),
    defaultValues: loginDefaultValues,
    mode: 'onTouched',
  });

  const onSubmit = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      Cookies.set('auth', 'true', { expires: 30 });
      window.location.href = PAGES.HOME;
    }
  };

  return (
    <AuthShell
      title={t('login')}
      footer={
        <>
          {t('dontHaveAccount')}{' '}
          <Link href="/register" className="font-medium text-primary underline-offset-4 hover:underline">
            {t('register')}
          </Link>
        </>
      }>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1.5">
          <Input
            type="email"
            autoComplete="email"
            placeholder={t('emailPlaceholder')}
            aria-label={common('email')}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Input
            type="password"
            autoComplete="current-password"
            placeholder={t('passwordPlaceholder')}
            aria-label={common('password')}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && (
            <p className="text-xs text-destructive" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="mt-1 h-11 w-full text-base font-medium"
          disabled={isSubmitting}>
          {common('submit')}
        </Button>
      </form>
      <AuthFooter />
    </AuthShell>
  );
}
