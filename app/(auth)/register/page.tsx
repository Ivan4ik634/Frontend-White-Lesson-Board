import type { Metadata } from 'next';

import { Register } from '@/components/auth/Register';
import { noIndexRobots } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create a Claro account to start shared study boards with your team.',
  robots: noIndexRobots,
};

export default function RegisterPage() {
  return <Register />;
}
