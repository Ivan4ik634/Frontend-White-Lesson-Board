import { Login } from '@/components/auth/Login';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return <Login />;
}
