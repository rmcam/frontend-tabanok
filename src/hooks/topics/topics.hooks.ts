import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { topicsService } from '@/services/topics/topics.service';
import { ApiError } from '@/services/_shared';
import type { ApiResponse } from '@/types/common/common.d';
import type { Topic, CreateTopicDto, UpdateTopicDto } from '@/types/learning/learning.d';
import type { TopicQueryParams } from '@/types/topics/topics.d';

/**
 * Hooks para los endpoints de temas.
 */
export const useAllTopics = (params?: TopicQueryParams) => {
  return useQuery<Topic[], ApiError>({
    queryKey: ['topics', params],
    queryFn: async () => (await topicsService.getAllTopics(params)).data,
  });
};

/**
 * Hook para obtener temas filtrados por ID de unidad.
 */
export const useTopicsByUnityId = (unityId: string, params?: TopicQueryParams) => {
  const { data: allTopics, ...queryResult } = useAllTopics({ ...params, unityId }); // Pasar unityId como parte de los params

  return { data: allTopics, ...queryResult };
};


export const useTopicById = (id: string) => {
  return useQuery<Topic, ApiError>({
    queryKey: ['topics', id],
    queryFn: async () => (await topicsService.getTopicById(id)).data,
    enabled: !!id,
  });
};

export const useCreateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Topic>, ApiError, CreateTopicDto>({
    mutationFn: topicsService.createTopic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Tema creado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al crear tema:', error.message, error.details);
      toast.error('Error al crear tema.');
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Topic>, ApiError, { id: string, topicData: UpdateTopicDto }>({
    mutationFn: ({ id, topicData }) => topicsService.updateTopic(id, topicData),
    onSuccess: (data, variables) => {
      toast.success(data.message || 'Tema actualizado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['topics', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: (error) => {
      console.error('Error al actualizar tema:', error.message, error.details);
      toast.error('Error al actualizar tema.');
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: topicsService.deleteTopic,
    onSuccess: (_, id) => {
      toast.success('Tema eliminado exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['topics', id] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
    onError: (error) => {
      console.error('Error al eliminar tema:', error.message, error.details);
      toast.error('Error al eliminar tema.');
    },
  });
};
