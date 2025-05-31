import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { topicsService } from '../../services/topics/topics.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  Topic,
  CreateTopicDto,
  UpdateTopicDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de temas.
 */
export const useAllTopics = () => {
  return useQuery<Topic[], ApiError>({
    queryKey: ['topics'],
    queryFn: async () => (await topicsService.getAllTopics()).data,
  });
};

/**
 * Hook para obtener temas filtrados por ID de unidad.
 */
export const useTopicsByUnityId = (unityId: string) => {
  const { data: allTopics, ...queryResult } = useAllTopics();

  const filteredTopics = allTopics?.filter(topic => topic.unityId === unityId) || [];

  return { data: filteredTopics, ...queryResult };
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
    },
  });
};

export const useUpdateTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Topic>, ApiError, { id: string, topicData: UpdateTopicDto }>({
    mutationFn: ({ id, topicData }) => topicsService.updateTopic(id, topicData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['topics', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success(data.message || 'Tema actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar tema:', error.message, error.details);
    },
  });
};

export const useDeleteTopic = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: topicsService.deleteTopic,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['topics', id] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
      toast.success('Tema eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar tema:', error.message, error.details);
    },
  });
};
