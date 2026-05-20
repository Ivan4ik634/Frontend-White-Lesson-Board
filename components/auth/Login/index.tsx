'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/ui/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import { loginDefaultValues, loginSchema, type LoginFormValues } from '@/types/UserT';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { AuthFooter } from '../ui/auth-footer';

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
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
    <>
      <AuthShell
        title="Login"
        footer={
          <>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-primary underline-offset-4 hover:underline">
              Register
            </Link>
          </>
        }>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <Input
              type="email"
              autoComplete="email"
              placeholder="Email..."
              aria-label="Email"
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
              placeholder="Password..."
              aria-label="Password"
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
            Submit
          </Button>
        </form>
        <AuthFooter />
      </AuthShell>
    </>
  );
}
