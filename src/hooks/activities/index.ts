import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activitiesService } from '../../services/activities';
import type { Activity, CreateActivityDto, UpdateActivityDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const activityQueryKeys = {
  all: ['activities'] as const,
  details: () => [...activityQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener una actividad específica por su ID.
 * @param activityId El ID de la actividad.
 * @returns Un objeto con los datos de la actividad, estado de carga y error.
 */
export const useActivityById = (activityId: string) => {
  return useQuery<Activity, Error>({
    queryKey: activityQueryKeys.detail(activityId),
    queryFn: () => activitiesService.getActivityById(activityId),
    enabled: !!activityId,
  });
};

/**
 * Hook para crear una nueva actividad.
 * Invalida las consultas de actividades después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<Activity, Error, CreateActivityDto>({
    mutationFn: activitiesService.createActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar una actividad existente.
 * Invalida las consultas de actividades y el detalle de la actividad después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<Activity, Error, { id: string; data: UpdateActivityDto }>({
    mutationFn: ({ id, data }) => activitiesService.updateActivity(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar una actividad.
 * Invalida las consultas de actividades después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: activitiesService.deleteActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};
