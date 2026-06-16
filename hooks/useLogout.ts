import { supabase } from '@/lib/supabase';
import Cookies from 'js-cookie';
export const useLogout = () => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    Cookies.remove('auth');
  };
  return { handleLogout };
};
