import type { PostgrestError } from '@supabase/supabase-js';
import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react';

type SupabaseQueryResponse<TData, TError = PostgrestError> = {
  data: TData | null;
  error: TError | null;
};

type UseSupabaseQueryOptions<TData, TError> = {
  enabled?: boolean;
  initialData?: TData | null;
  onError?: (error: TError) => void;
  onSuccess?: (data: TData | null) => void;
};

type UseSupabaseQueryResult<TData, TError> = {
  data: TData | null;
  error: TError | null;
  loading: boolean;
  refetch: () => Promise<SupabaseQueryResponse<TData, TError> | null>;
};

export function useSupabaseQuery<TData, TError = PostgrestError>(
  query: () => PromiseLike<SupabaseQueryResponse<TData, TError>>,
  options: UseSupabaseQueryOptions<TData, TError> = {},
  deps: DependencyList = [],
): UseSupabaseQueryResult<TData, TError> {
  const { enabled = true, initialData = null, onError, onSuccess } = options;
  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);
  const [data, setData] = useState<TData | null>(initialData);
  const [error, setError] = useState<TError | null>(null);
  const [loading, setLoading] = useState(enabled);

  const refetch = useCallback(async () => {
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;
    setLoading(true);
    setError(null);

    const result = await query();

    if (!mountedRef.current || requestId !== requestIdRef.current) return null;

    if (result.error) {
      setError(result.error);
      onError?.(result.error);
    } else {
      setData(result.data);
      onSuccess?.(result.data);
    }

    setLoading(false);
    return result;
  }, [onError, onSuccess, query]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const timeoutId = setTimeout(() => {
      void refetch();
    }, 0);

    return () => clearTimeout(timeoutId);
    // Caller controls when the query reruns through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  return { data, error, loading, refetch };
}
