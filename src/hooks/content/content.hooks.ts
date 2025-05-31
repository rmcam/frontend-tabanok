import { useQuery } from '@tanstack/react-query';
import { contentService } from '@/services/content/content.service'; // Asegúrate de que la ruta sea correcta
import { ApiError } from '@/services/_shared'; // Asegúrate de que la ruta sea correcta
import type { Content } from '@/types/api'; // Asumiendo que existe un tipo Content

/**
 * Hook para obtener el contenido de un tema específico dentro de una unidad.
 */
export const useContentByUnityAndTopicId = (unityId: string, topicId: string) => {
  return useQuery<Content[], ApiError>({
    queryKey: ['content', { unityId, topicId }],
    queryFn: async () => {
      const response = await contentService.getContentByUnityAndTopicId(unityId, topicId);
      console.log('useContentByUnityAndTopicId - API Response:', response); // Debugging
      return response;
    },
    enabled: !!unityId && !!topicId, // Habilitar la query solo si ambos IDs están presentes
  });
};
