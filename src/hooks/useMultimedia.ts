import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

interface MultimediaItem {
  id: string;
  title: string;
  description: string;
  type: "video" | "audio" | "image";
  url: string;
  lessonId: string;
  metadata: object;
}

function useMultimedia() {
  const { data, isLoading, isError, error } = useQuery<MultimediaItem[], Error>({
    queryKey: ['multimedia'],
    queryFn: async () => {
      // TODO: Verificar la estructura exacta de la respuesta de /multimedia
      const result = await api.get('/multimedia'); // Corregido el endpoint
      return result;
    },
  });

  return {
    multimedia: data,
    loading: isLoading,
    error: isError ? error : null,
  };
}

export default useMultimedia;
