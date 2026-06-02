'use client';

import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
import { Loader2 } from 'lucide-react';
import { FC, useEffect } from 'react';

interface Props {}

const CallBackGoogle: FC<Props> = (props) => {
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log(session);

      if (!session) return;

      const user = session.user;

      const { data: profile } = await supabase
        .from('profile')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        await supabase.from('profile').insert({
          id: user.id,
          name: user.user_metadata.full_name,
          avatar: user.user_metadata.avatar_url,
        });

        console.log('Profile created');
      } else {
        console.log('Profile exists');
      }
      Cookies.set('auth', 'true', { expires: 30 });
      window.location.href = PAGES.HOME;
    };

    checkUser();
  }, []);
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Loader2 className="text-text-main animate-spin" />
    </div>
  );
};

export default CallBackGoogle;
