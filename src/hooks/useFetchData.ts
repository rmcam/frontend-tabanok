import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface UseFetchDataState<T> {
  data: T | undefined;
  loading: boolean;
  error: Error | null;
}

function useFetchData<T>(path: string | null | undefined): UseFetchDataState<T> {
  const { data, isLoading, isError, error } = useQuery<T, Error>({
    queryKey: [path],
    queryFn: async () => {
      // The `enabled: !!path` option prevents this from being called if path is null/undefined,
      // but we keep the check for safety and type narrowing.
      if (!path) {
         throw new Error('URL path is not provided.');
      }
      const result = await api.get(path);
      return result;
    },
    enabled: !!path, // Only run the query if path is not null or undefined
  });

  return {
    data,
    loading: isLoading,
    error: isError ? error : null,
  };
}

export default useFetchData;
