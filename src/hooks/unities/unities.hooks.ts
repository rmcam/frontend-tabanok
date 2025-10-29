import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { unitiesService } from '@/services/unities/unities.service';
import { ApiError } from '@/services/_shared';
import type { ApiResponse } from '@/types/common/common.d';
import type { Unity, CreateUnityDto, UpdateUnityDto, Topic } from '@/types/learning/learning.d';
import type { Lesson } from '@/types/lessons/lessons.d';
import type { UnityQueryParams } from '@/types/unities/unities.d';

/**
 * Hooks para los endpoints de unidades de aprendizaje.
 */
export const useAllUnities = (params?: UnityQueryParams) => {
  return useQuery<Unity[], ApiError>({
    queryKey: ['unities', params],
    queryFn: async () => await unitiesService.getAllUnities(params),
  });
};

export const useUnityById = (id: string) => {
  return useQuery<Unity, ApiError>({
    queryKey: ['unities', id],
    queryFn: async () => await unitiesService.getUnityById(id),
    enabled: !!id,
  });
};

/**
 * Hook para obtener una unidad por su ID con tópicos y contenido anidado.
 */
export const useUnityWithTopicsAndContent = (id: string) => {
  return useQuery<Unity, ApiError>({
    queryKey: ['unities', id, 'detailed'],
    queryFn: async () => await unitiesService.getDetailedUnityById(id),
    enabled: !!id,
  });
};

export const useLessonsByUnityId = (unityId: string) => {
  return useQuery<Lesson[], ApiError>({
    queryKey: ['unities', unityId, 'lessons'],
    queryFn: async () => await unitiesService.getLessonsByUnityId(unityId),
    enabled: !!unityId,
  });
};

export const useTopicsByUnityId = (unityId: string) => {
  return useQuery<Topic[], ApiError>({
    queryKey: ['unities', unityId, 'topics'],
    queryFn: async () => await unitiesService.getTopicsByUnityId(unityId),
    enabled: !!unityId,
  });
};

export const useCreateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<Unity, ApiError, CreateUnityDto>({
    mutationFn: unitiesService.createUnity,
    onSuccess: (data) => {
      toast.success('Unidad creada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      queryClient.invalidateQueries({ queryKey: ['unities', data.id] });
    },
    onError: (error: ApiError) => {
      console.error('Error al crear unidad:', error.message, error.details);
      toast.error('Error al crear unidad.');
    },
  });
};

export const useUpdateUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<Unity, ApiError, { id: string, unityData: UpdateUnityDto }>({
    mutationFn: ({ id, unityData }) => unitiesService.updateUnity(id, unityData),
    onSuccess: (data) => {
      toast.success('Unidad actualizada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['unities', data.id] });
      queryClient.invalidateQueries({ queryKey: ['unities'] });
    },
    onError: (error: ApiError) => {
      console.error('Error al actualizar unidad:', error.message, error.details);
      toast.error('Error al actualizar unidad.');
    },
  });
};

export const useDeleteUnity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: unitiesService.deleteUnity,
    onSuccess: (_, id) => {
      toast.success('Unidad eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['unities', id] });
      queryClient.invalidateQueries({ queryKey: ['unities'] });
    },
    onError: (error: ApiError) => {
      console.error('Error al eliminar unidad:', error.message, error.details);
      toast.error('Error al eliminar unidad.');
    },
  });
};

/**
 * Hook para alternar el bloqueo de una unidad.
 */
export function useToggleUnityLock() {
  const queryClient = useQueryClient();
  return useMutation<Unity, ApiError, string>({
    mutationFn: (id) => unitiesService.toggleUnityLock(id),
    onSuccess: (data) => {
      toast.success('Estado de bloqueo de unidad actualizado.');
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      queryClient.invalidateQueries({ queryKey: ['unities', data.id] });
    },
    onError: (error) => {
      console.error('Error al alternar bloqueo de unidad:', error.message, error.details);
      toast.error('Error al alternar bloqueo de unidad.');
    },
  });
}

/**
 * Hook para actualizar los puntos de una unidad.
 */
export function useUpdateUnityPoints() {
  const queryClient = useQueryClient();
  return useMutation<Unity, ApiError, { id: string; points: number }>({
    mutationFn: ({ id, points }) => unitiesService.updateUnityPoints(id, points),
    onSuccess: (data) => {
      toast.success('Puntos de unidad actualizados.');
      queryClient.invalidateQueries({ queryKey: ['unities'] });
      queryClient.invalidateQueries({ queryKey: ['unities', data.id] });
    },
    onError: (error) => {
      console.error('Error al actualizar puntos de unidad:', error.message, error.details);
      toast.error('Error al actualizar puntos de unidad.');
    },
  });
}
