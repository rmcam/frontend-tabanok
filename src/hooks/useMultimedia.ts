import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Multimedia } from '@/types/multimediaTypes';

function useMultimedia() {
  const { data, isLoading, isError, error } = useQuery<Multimedia[], Error>({
    queryKey: ['multimedia'],
    queryFn: async () => {
      // TODO: Verificar la estructura exacta de la respuesta de /multimedia
      const result = await api.get('/multimedia');
      return result;
    },
  });

  return {
    multimedia: data as Multimedia[],
    loading: isLoading,
    error: isError ? error : null,
  };
}

export default useMultimedia;
