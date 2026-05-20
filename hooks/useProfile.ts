import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';
import { UserT } from '@/types/UserT';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useSupabaseQuery } from './useSupabaseQuery';

export const useProfile = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        setAuthError(error);
        toast.error(error.message);
      }

      setUserId(user?.id ?? null);
      setAuthLoading(false);
    };

    void getUser();
  }, []);

  const {
    data: profile,
    error: profileError,
    loading: profileLoading,
  } = useSupabaseQuery<UserT>(
    () => supabase.from('profile').select('*').eq('id', userId).single(),
    {
      enabled: Boolean(userId),
      onError: (error) => toast.error(error.message),
    },
    [userId],
  );

  const error: Error | PostgrestError | null = authError ?? profileError;
  const loading = authLoading || (Boolean(userId) && profileLoading);

  return { profile, error, loading };
};
