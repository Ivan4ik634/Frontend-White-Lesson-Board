import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { FcGoogle } from 'react-icons/fc';

export function AuthFooter() {
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/callback/google`,
      },
    });

    if (error) {
      console.error('Ошибка входа:', error.message);
      return;
    }

    window.location.href = data.url;
  };

  return (
    <div className="mt-3">
      <Button onClick={() => signInWithGoogle()} className={'w-full'} size="lg" variant="outline">
        <FcGoogle />
        Sing in with Google
      </Button>
    </div>
  );
}
