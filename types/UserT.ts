import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const createLoginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
    password: z.string().min(1, t('passwordRequired')),
  });

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    name: z.string().min(1, 'Name is required'),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const createRegisterSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z.string().min(1, t('emailRequired')).email(t('invalidEmail')),
      name: z.string().min(1, t('nameRequired')),
      password: z.string().min(8, t('passwordMin')),
      confirmPassword: z.string().min(1, t('confirmPasswordRequired')),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordsDoNotMatch'),
      path: ['confirmPassword'],
    });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const registerDefaultValues: RegisterFormValues = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
};

export interface UserT {
  id: string;
  name: string;
  created_at: string;
  email: string;
  avatar: string;
  language?: 'en' | 'uk' | 'fr';
}
export type UserProfile = Omit<UserT, 'id' | 'created_at'>;
export type UserProfileUpdate = Partial<UserProfile>;
