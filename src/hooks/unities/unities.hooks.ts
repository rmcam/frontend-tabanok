import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitiesService } from '../../services/unities/unities.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  CreateUnityDto,
  UpdateUnityDto,
} from '../../types';
import type { Unity, Lesson, Topic } from '../../types/learning/learning.d';

/**
 * Hooks para los endpoints de unidades de aprendizaje.
 */
export const useAllUnities = () => {
  return useQuery<Unity[], ApiError>({
    queryKey: ['unities'],
    queryFn: async () => {
      const response = await unitiesService.getAllUnities();
      return response;
    },
  });
};

export const useUnityById = (id: string) => {
  return useQuery<Unity | null, ApiError>({ // Cambiar el tipo de retorno a Unity | null
    queryKey: ['unities', id],
    queryFn: async () => {
      const response = await unitiesService.getUnityById(id);
      return response || null;
    },
    enabled: !!id,
    // Eliminar la función select para devolver el objeto Unity completo
  });
};

export const useLessonsByUnityId = (unityId: string) => {
  return useQuery<Lesson[], ApiError>({
    queryKey: ['unities', unityId, 'lessons'],
    queryFn: async () => {
      const response = await unitiesService.getLessonsByUnityId(unityId);
      return response || [];
    },
    enabled: !!unityId,
  });
};

export const useTopicsByUnityId = (unityId: string) => {
  return useQuery<Topic[], ApiError>({
    queryKey: ['unities', unityId, 'topics'],
    queryFn: async () => {
      const response = await unitiesService.getTopicsByUnityId(unityId);
      return response || [];
    },
    enabled: !!unityId,
  });
};

export const useCreateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Unity>, ApiError, CreateUnityDto>({
    mutationFn: unitiesService.createUnity,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      queryClient.invalidateQueries({ queryKey: ['unities', data.data.id] }); // Invalidar por el ID de la unidad creada
      toast.success('Unidad creada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al crear unidad:', error.message, error.details);
    },
  });
};

export const useUpdateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Unity>, ApiError, { id: string, unityData: UpdateUnityDto }>({
    mutationFn: ({ id, unityData }) => unitiesService.updateUnity(id, unityData),
    onSuccess: (data) => { // Acceder a data.data si la API devuelve ApiResponse
      queryClient.invalidateQueries({ queryKey: ['unities', data.data.id] }); // Invalidate by updated unity ID
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      toast.success('Unidad actualizada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al actualizar unidad:', error.message, error.details);
    },
  });
};

export const useDeleteUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: unitiesService.deleteUnity,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['unities', id] });
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      toast.success('Unidad eliminada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al eliminar unidad:', error.message, error.details);
    },
  });
};
