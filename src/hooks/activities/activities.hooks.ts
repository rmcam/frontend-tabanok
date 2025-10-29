import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { activitiesService } from '@/services/activities/activities.service';
import { ApiError } from '@/services/_shared';
import type { Activity, CreateActivityDto, UpdateActivityDto, ActivityQueryParams } from '@/types/activities/activities.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hook para crear una nueva actividad.
 */
export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Activity>, ApiError, CreateActivityDto>({
    mutationFn: (data) => activitiesService.createActivity(data),
    onSuccess: () => {
      toast.success('Actividad creada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Error al crear actividad:', error.message, error.details);
      toast.error('Error al crear actividad.');
    },
  });
}

/**
 * Hook para obtener todas las actividades.
 */
export function useAllActivities(params?: ActivityQueryParams) {
  return useQuery<Activity[], ApiError>({
    queryKey: ['activities', params],
    queryFn: async () => (await activitiesService.getAllActivities(params)).data,
  });
}

/**
 * Hook para obtener una actividad por su ID.
 */
export function useActivityById(id: string) {
  return useQuery<Activity, ApiError>({
    queryKey: ['activity', id],
    queryFn: async () => (await activitiesService.getActivityById(id)).data,
    enabled: !!id,
  });
}

/**
 * Hook para actualizar una actividad por su ID.
 */
export function useUpdateActivity() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Activity>, ApiError, { id: string; data: UpdateActivityDto }>({
    mutationFn: ({ id, data }) => activitiesService.updateActivity(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Actividad actualizada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Error al actualizar actividad:', error.message, error.details);
      toast.error('Error al actualizar actividad.');
    },
  });
}

/**
 * Hook para eliminar una actividad por su ID.
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: (id) => activitiesService.deleteActivity(id),
    onSuccess: () => {
      toast.success('Actividad eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Error al eliminar actividad:', error.message, error.details);
      toast.error('Error al eliminar actividad.');
    },
  });
}

/**
 * Hook para actualizar los puntos de una actividad.
 */
export function useUpdateActivityPoints() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Activity>, ApiError, { id: string; points: number }>({
    mutationFn: ({ id, points }) => activitiesService.updateActivityPoints(id, points),
    onSuccess: (_, { id }) => {
      toast.success('Puntos de actividad actualizados.');
      queryClient.invalidateQueries({ queryKey: ['activity', id] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    },
    onError: (error) => {
      console.error('Error al actualizar puntos de actividad:', error.message, error.details);
      toast.error('Error al actualizar puntos de actividad.');
    },
  });
}
