'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { AuthShell } from '@/components/auth/ui/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';
import { userService } from '@/services/user.service';
import { createRegisterSchema, registerDefaultValues, type RegisterFormValues } from '@/types/UserT';
import { AuthFooter } from '../ui/auth-footer';

export function Register() {
  const t = useTranslations('auth');
  const common = useTranslations('common');
  const validation = useTranslations('validation');
  const locale = useLocale() as 'en' | 'uk' | 'fr';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(validation)),
    defaultValues: registerDefaultValues,
    mode: 'onTouched',
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const {
      error,
      data: { user },
    } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      toast.error(error.message);
    } else {
      await userService.create(user?.id || '', {
        name: data.name,
        email: data.email,
        avatar: '',
        language: locale,
      });
      toast.success(t('accountCreated'));

      Cookies.set('auth', 'true', { expires: 30 });
      window.location.href = PAGES.HOME;
    }
  };

  return (
    <AuthShell
      title={t('register')}
      footer={
        <>
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            {t('login')}
          </Link>
        </>
      }>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="flex flex-col gap-1.5">
          <Input
            type="text"
            autoComplete="name"
            placeholder={t('namePlaceholder')}
            aria-label={common('name')}
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>
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
            autoComplete="new-password"
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
        <div className="flex flex-col gap-1.5">
          <Input
            type="password"
            autoComplete="new-password"
            placeholder={t('confirmPasswordPlaceholder')}
            aria-label={t('confirmPassword')}
            aria-invalid={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-destructive" role="alert">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          className="mt-1 h-11 w-full text-base font-medium"
          disabled={isSubmitting}>
          {t('register')}
        </Button>
      </form>
      <AuthFooter />
    </AuthShell>
  );
}
