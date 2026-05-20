import type { Metadata } from 'next';

import { Register } from '@/components/auth/Register';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return <Register />;
}
