import { PAGES } from '@/configs/PAGES';
import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
export const useLogout = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove('auth');
    window.location.href = PAGES.HOME;
  };
  return { handleLogout };
};
