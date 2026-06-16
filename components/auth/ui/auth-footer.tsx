import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useTranslations } from 'next-intl';
import { FcGoogle } from 'react-icons/fc';

export function AuthFooter() {
  const t = useTranslations('auth');

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback/google`,
      },
    });

    if (error) {
      console.error('Google sign-in error:', error.message);
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="mt-3">
      <Button onClick={() => signInWithGoogle()} className="w-full" size="lg" variant="outline">
        <FcGoogle />
        {t('signInWithGoogle')}
      </Button>
    </div>
  );
}
