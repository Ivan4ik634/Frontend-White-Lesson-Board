import { Login } from '@/components/auth/Login';
import { noIndexRobots } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your Claro shared board workspace.',
  robots: noIndexRobots,
};

export default function LoginPage() {
  return <Login />;
}
