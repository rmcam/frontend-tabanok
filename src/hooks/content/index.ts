import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService } from '../../services/content';
import type { Content, CreateContentDto, UpdateContentDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const contentQueryKeys = {
  all: ['content'] as const,
  details: () => [...contentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...contentQueryKeys.details(), id] as const,
  byUnityAndTopic: (unityId: string, topicId: string) => [...contentQueryKeys.all, 'byUnityAndTopic', unityId, topicId] as const,
};

/**
 * Hook para obtener un contenido educativo específico por su ID.
 * @param contentId El ID del contenido.
 * @returns Un objeto con los datos del contenido, estado de carga y error.
 */
export const useContentById = (contentId: string) => {
  return useQuery<Content, Error>({
    queryKey: contentQueryKeys.detail(contentId),
    queryFn: () => contentService.getContentById(contentId),
    enabled: !!contentId,
  });
};

/**
 * Hook para obtener contenido por una unidad y un tema específicos.
 * @param unityId El ID de la unidad.
 * @param topicId El ID del tema.
 * @returns Un objeto con los datos del contenido, estado de carga y error.
 */
export const useContentByUnityAndTopic = (unityId: string, topicId: string) => {
  return useQuery<Content[], Error>({
    queryKey: contentQueryKeys.byUnityAndTopic(unityId, topicId),
    queryFn: () => contentService.getContentByUnityAndTopic(unityId, topicId),
    enabled: !!unityId && !!topicId,
  });
};

/**
 * Hook para crear un nuevo contenido.
 * Invalida las consultas de contenido después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateContent = () => {
  const queryClient = useQueryClient();
  return useMutation<Content, Error, CreateContentDto>({
    mutationFn: contentService.createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar un contenido existente.
 * Invalida las consultas de contenido y el detalle del contenido después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateContent = () => {
  const queryClient = useQueryClient();
  return useMutation<Content, Error, { id: string; data: UpdateContentDto }>({
    mutationFn: ({ id, data }) => contentService.updateContent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.detail(data.id as string) });
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar un contenido.
 * Invalida las consultas de contenido después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteContent = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: contentService.deleteContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentQueryKeys.all });
    },
  });
};
