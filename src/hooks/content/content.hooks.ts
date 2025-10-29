import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contentService } from '@/services/content/content.service';
import { ApiError } from '@/services/_shared';
import type { Content, CreateContentDto, UpdateContentDto, ContentQueryParams } from '@/types/content/content.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hook para crear nuevo contenido educativo.
 */
export function useCreateContent() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Content>, ApiError, CreateContentDto>({
    mutationFn: (data) => contentService.createContent(data),
    onSuccess: () => {
      toast.success('Contenido creado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error) => {
      console.error('Error al crear contenido:', error.message, error.details);
      toast.error('Error al crear contenido.');
    },
  });
}

/**
 * Hook para obtener todo el contenido educativo.
 */
export function useAllContent(params?: ContentQueryParams) {
  return useQuery<Content[], ApiError>({
    queryKey: ['content', params],
    queryFn: async () => (await contentService.getAllContent(params)).data,
  });
}

/**
 * Hook para obtener contenido educativo por ID.
 */
export function useContentById(id: string) {
  return useQuery<Content, ApiError>({
    queryKey: ['content', id],
    queryFn: async () => (await contentService.getContentById(id)).data,
    enabled: !!id,
  });
}

/**
 * Hook para actualizar contenido educativo por ID.
 */
export function useUpdateContent() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Content>, ApiError, { id: string; data: UpdateContentDto }>({
    mutationFn: ({ id, data }) => contentService.updateContent(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Contenido actualizado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['content', id] });
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error) => {
      console.error('Error al actualizar contenido:', error.message, error.details);
      toast.error('Error al actualizar contenido.');
    },
  });
}

/**
 * Hook para eliminar contenido educativo por ID.
 */
export function useDeleteContent() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: (id) => contentService.deleteContent(id),
    onSuccess: () => {
      toast.success('Contenido eliminado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
    onError: (error) => {
      console.error('Error al eliminar contenido:', error.message, error.details);
      toast.error('Error al eliminar contenido.');
    },
  });
}

/**
 * Hook para obtener el contenido de un tema específico dentro de una unidad.
 */
export const useContentByUnityAndTopicId = (unityId: string, topicId: string) => {
  return useQuery<Content[], ApiError>({
    queryKey: ['content', { unityId, topicId }],
    queryFn: async () => (await contentService.getContentByUnityAndTopicId(unityId, topicId)).data,
    enabled: !!unityId && !!topicId,
  });
};
