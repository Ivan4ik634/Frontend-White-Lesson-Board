'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

import { AuthShell } from '@/components/auth/ui/auth-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import { registerDefaultValues, registerSchema, type RegisterFormValues } from '@/types/UserT';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { AuthFooter } from '../ui/auth-footer';

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
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
      await supabase.from('profile').insert({ name: data.name, id: user?.id });
      toast.success('Account created successfully');

      Cookies.set('auth', 'true', { expires: 30 });
      window.location.href = PAGES.HOME;
    }
  };

  return (
    <>
      <AuthShell
        title="Register"
        footer={
          <>
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-primary underline-offset-4 hover:underline">
              Login
            </Link>
          </>
        }>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex flex-col gap-1.5">
            <Input
              type="text"
              autoComplete="name"
              placeholder="Name..."
              aria-label="Name"
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
              autoComplete="new-password"
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
          <div className="flex flex-col gap-1.5">
            <Input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm Password..."
              aria-label="Confirm password"
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
            Register
          </Button>
        </form>
        <AuthFooter />
      </AuthShell>
    </>
  );
}
