import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProgressService from '../../services/progress/progress.service';
import { ApiError } from '../../services/_shared';
import type { UserModuleProgressResponse, UserUnityProgressResponse, UserLessonProgressResponse, UserExerciseProgressResponse, CreateProgressDto } from '../../types/progress/progress.d';
import { useUserStore } from '../../stores/userStore';

interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * @interface UserGeneralProgress
 * @description Interfaz para el progreso general de un usuario, incluyendo IDs de ejercicios y contenido completado.
 */
export interface UserGeneralProgress {
  completedExerciseIds: string[];
  completedContentIds: string[];
}

/**
 * Hook para obtener el progreso general de un usuario, incluyendo ejercicios y contenido completado.
 * @param userId El ID del usuario.
 * @param pagination Parámetros de paginación (opcional).
 * @returns Un objeto de React Query con los datos de progreso, estado de carga y error.
 */
export function useGetProgressByUser(userId: string | undefined, pagination?: PaginationParams) {
  return useQuery<UserGeneralProgress, Error>({
    queryKey: ['userGeneralProgress', userId, pagination],
    queryFn: async () => {
      if (!userId) {
        return { completedExerciseIds: [], completedContentIds: [] };
      }
      const progressList = await ProgressService.getProgressByUser(userId, pagination);
      const completedExerciseIds = progressList
        .filter(p => p.isCompleted && p.exercise?.id) // Acceder a p.exercise.id
        .map(p => p.exercise.id);

      // Si el backend ya no devuelve contentId en el progreso de ejercicios,
      // esta parte se dejará como un array vacío o se obtendrá de otro endpoint.
      // Por ahora, se asume que no hay contentId en UserExerciseProgressResponse.
      const completedContentIds: string[] = [];

      return { completedExerciseIds, completedContentIds };
    },
    enabled: !!userId,
  });
}

/**
 * Hook para crear un nuevo progreso.
 * @returns Un objeto de React Query con la función de mutación para crear progreso.
 */
export const useCreateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    UserExerciseProgressResponse, // Cambiado de ProgressDto
    ApiError,
    CreateProgressDto,
    { previousUserGeneralProgress?: UserGeneralProgress; previousAllUserLessonProgress?: UserLessonProgressResponse[]; previousAllUserUnityProgress?: UserUnityProgressResponse[] } // Tipos actualizados
  >({
    mutationFn: (progressData: CreateProgressDto) => ProgressService.createProgress(progressData),
    onMutate: async (newProgressData) => {
      // Cancelar cualquier refetching pendiente para las queries afectadas
      await queryClient.cancelQueries({ queryKey: ['userGeneralProgress', newProgressData.userId] });
      await queryClient.cancelQueries({ queryKey: ['allUserLessonProgress', newProgressData.userId] });
      await queryClient.cancelQueries({ queryKey: ['allUserUnityProgress', newProgressData.userId] });

      // Snapshot del valor anterior
      const previousUserGeneralProgress = queryClient.getQueryData<UserGeneralProgress>(['userGeneralProgress', newProgressData.userId]);
      const previousAllUserLessonProgress = queryClient.getQueryData<UserLessonProgressResponse[]>(['allUserLessonProgress', newProgressData.userId]);
      const previousAllUserUnityProgress = queryClient.getQueryData<UserUnityProgressResponse[]>(['allUserUnityProgress', newProgressData.userId]);

      // Optimistic update para userGeneralProgress
      if (previousUserGeneralProgress) {
        queryClient.setQueryData<UserGeneralProgress>(['userGeneralProgress', newProgressData.userId], (old: UserGeneralProgress | undefined) => { // Tipado explícito para 'old'
          if (!old) return old;
          const currentCompletedExerciseIds = old.completedExerciseIds || [];
          const currentCompletedContentIds = old.completedContentIds || [];

          const updatedExerciseIds = newProgressData.exerciseId
            ? [...currentCompletedExerciseIds, newProgressData.exerciseId]
            : currentCompletedExerciseIds;
          const updatedContentIds = newProgressData.contentId
            ? [...currentCompletedContentIds, newProgressData.contentId]
            : currentCompletedContentIds;
          return {
            ...old,
            completedExerciseIds: updatedExerciseIds,
            completedContentIds: updatedContentIds,
          };
        });
      }

      // No se puede hacer un optimistic update para allUserLessonProgress y allUserUnityProgress
      // porque el cálculo del porcentaje de completitud y el score es complejo y depende de muchos factores.
      // La invalidación es la mejor estrategia aquí.

      return { previousUserGeneralProgress, previousAllUserLessonProgress, previousAllUserUnityProgress };
    },
    onSuccess: (_newProgress) => { // Renombrado a _newProgress para evitar la advertencia de no utilizado
      toast.success('Progreso registrado exitosamente.');
    },
    onError: (error, newProgressData, context) => {
      console.error('Error al registrar progreso:', error.message, error.details);
      toast.error('Error al registrar progreso.');

      // Revertir a los datos anteriores en caso de error
      if (context?.previousUserGeneralProgress) {
        queryClient.setQueryData(['userGeneralProgress', newProgressData.userId], context.previousUserGeneralProgress);
      }
      // No hay rollback para lesson/unity progress ya que no se hizo optimistic update
    },
    onSettled: (_data, _error, variables) => { // Renombrados a _data y _error
      // Asegurar que las queries se refetcheen después de que la mutación se asiente
      queryClient.invalidateQueries({ queryKey: ['userGeneralProgress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserLessonProgress', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserUnityProgress', variables.userId] });
    },
  });
};

/**
 * Hook para obtener el progreso de todas las lecciones de un usuario.
 * @param pagination Parámetros de paginación (opcional).
 * @returns Un objeto de React Query con los datos de progreso de lecciones, estado de carga y error.
 */
export function useAllUserLessonProgress(pagination?: PaginationParams) {
  const { user } = useUserStore();
  const userId = user?.id;

  return useQuery<UserLessonProgressResponse[], Error>({ // Tipo actualizado
    queryKey: ['allUserLessonProgress', userId, pagination],
    queryFn: () => ProgressService.getAllUserLessonProgress(userId!, pagination),
    enabled: !!userId,
  });
}

/**
 * Hook para obtener el progreso de todas las unidades de un usuario.
 * @param pagination Parámetros de paginación (opcional).
 * @returns Un objeto de React Query con los datos de progreso de unidades, estado de carga y error.
 */
export function useAllUserUnityProgress(pagination?: PaginationParams) {
  const { user } = useUserStore();
  const userId = user?.id;

  return useQuery<UserUnityProgressResponse[], Error>({ // Tipo actualizado
    queryKey: ['allUserUnityProgress', userId, pagination],
    queryFn: () => ProgressService.getAllUserUnityProgress(userId!, pagination),
    enabled: !!userId,
  });
}

// Fin de los cambios para refrescar el compilador.
