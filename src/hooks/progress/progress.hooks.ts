import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProgressService from '@/services/progress/progress.service';
import { ApiError } from '@/services/_shared';
import type { UserUnityProgressResponse, UserLessonProgressResponse, CreateProgressDto, GetUserProgressFilters, PaginatedUserProgressResponse, SubmitExerciseRequestBody, SubmitExerciseResponse } from '@/types/progress/progress.d';
import { useUserStore } from '@/stores/userStore';
import type { ApiResponse } from '@/types/common/common.d';
import type { Exercise } from '@/types/exercises/exercises.d'; // Importar Exercise

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
  return useQuery<UserGeneralProgress, ApiError>({
    queryKey: ['userGeneralProgress', userId, pagination],
    queryFn: async () => {
      if (!userId) {
        return { completedExerciseIds: [], completedContentIds: [] };
      }
      const progressListResponse = await ProgressService.getProgressByUser(userId, pagination);
      const progressList = progressListResponse.data || []; // Asegurarse de que progressList sea un array

      const completedExerciseIds = progressList
        .filter(p => p.isCompleted && p.exerciseId)
        .map(p => p.exerciseId!);

      const completedContentIds: string[] = progressList
        .filter(p => p.isCompleted && p.contentId)
        .map(p => p.contentId!);

      return { completedExerciseIds, completedContentIds };
    },
    enabled: !!userId,
  });
}

/**
 * Hook para enviar las respuestas de un ejercicio y actualizar el progreso.
 * Utiliza el nuevo endpoint POST /progress/submit-exercise.
 * @returns Un objeto de React Query con la función de mutación para enviar el ejercicio.
 */
export const useSubmitExerciseProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useUserStore();
  const userId = user?.id;

  return useMutation<
    SubmitExerciseResponse,
    ApiError,
    Omit<SubmitExerciseRequestBody, 'userId'>
  >({
    mutationFn: async (submissionData) => {
      if (!userId) {
        throw new Error('User not authenticated.');
      }
      const fullSubmission: SubmitExerciseRequestBody = {
        ...submissionData,
        userId,
      };
      return ProgressService.submitExerciseProgress(fullSubmission);
    },
    onSuccess: (data) => {
      console.log('Respuesta completa del backend al enviar ejercicio:', data);
      // La lógica de onComplete y awardedPoints se maneja en los componentes de UI (ExerciseModal, ExerciseDetailPage)
      // Invalidar queries relevantes para reflejar el progreso actualizado
      queryClient.invalidateQueries({ queryKey: ['userGeneralProgress', userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserLessonProgress', userId] });
      queryClient.invalidateQueries({ queryKey: ['allUserUnityProgress', userId] });
      queryClient.invalidateQueries({ queryKey: ['userProgress', userId, { exerciseId: data.exerciseId }] });
      queryClient.invalidateQueries({ queryKey: ['exercises', data.exerciseId] }); // Invalidar el ejercicio específico
      queryClient.invalidateQueries({ queryKey: ['exercises', { withProgress: true }] }); // Invalidar la lista general con progreso
      // Si el ejercicio tiene un lessonId, invalidar también la lista de ejercicios de esa lección con progreso
      // Esto requeriría obtener el lessonId del ejercicio, lo cual no está directamente en SubmitExerciseResponse.
      // Podríamos refetch el ejercicio para obtener su lessonId o invalidar todas las listas de lecciones.
      // Por simplicidad, invalidaremos todas las lecciones si es necesario, o se puede refinar más tarde.
      // Para invalidar la caché de ejercicios por lección, necesitamos el lessonId del ejercicio.
      // Como SubmitExerciseResponse no lo incluye, tendríamos que hacer una consulta adicional
      // o pasar el lessonId como parte de la mutación si es relevante para el contexto actual.
      // Por ahora, se omite la invalidación específica por lessonId para evitar errores.
      // Si es crítico, se podría obtener el ejercicio completo (con lessonId) en onMutate.
    },
    onError: (error) => {
      console.error('Error al enviar ejercicio:', error.message, error.details);
      toast.error('Error al enviar el ejercicio.');
    },
  });
};

/**
 * Hook para crear un nuevo progreso.
 * @returns Un objeto de React Query con la función de mutación para crear progreso.
 */
export const useCreateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<any>, // Tipo de retorno corregido a any temporalmente
    ApiError,
    CreateProgressDto,
    { previousUserGeneralProgress?: UserGeneralProgress; previousAllUserLessonProgress?: ApiResponse<UserLessonProgressResponse[]>; previousAllUserUnityProgress?: ApiResponse<UserUnityProgressResponse[]> } // Tipos actualizados
  >({
    mutationFn: (progressData: CreateProgressDto) => ProgressService.createProgress(progressData),
    onMutate: async (newProgressData) => {
      // Cancelar cualquier refetching pendiente para las queries afectadas
      await queryClient.cancelQueries({ queryKey: ['userGeneralProgress', newProgressData.userId] });
      await queryClient.cancelQueries({ queryKey: ['allUserLessonProgress', newProgressData.userId] });
      await queryClient.cancelQueries({ queryKey: ['allUserUnityProgress', newProgressData.userId] });

      // Snapshot del valor anterior
      const previousUserGeneralProgress = queryClient.getQueryData<UserGeneralProgress>(['userGeneralProgress', newProgressData.userId]);
      const previousAllUserLessonProgress = queryClient.getQueryData<ApiResponse<UserLessonProgressResponse[]>>(['allUserLessonProgress', newProgressData.userId]);
      const previousAllUserUnityProgress = queryClient.getQueryData<ApiResponse<UserUnityProgressResponse[]>>(['allUserUnityProgress', newProgressData.userId]);

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

  return useQuery<UserLessonProgressResponse[], ApiError>({ // Tipo actualizado
    queryKey: ['allUserLessonProgress', userId, pagination],
    queryFn: async () => (await ProgressService.getAllUserLessonProgress(userId!, pagination)).data,
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

  return useQuery<UserUnityProgressResponse[], ApiError>({ // Tipo actualizado
    queryKey: ['allUserUnityProgress', userId, pagination],
    queryFn: async () => (await ProgressService.getAllUserUnityProgress(userId!, pagination)).data,
    enabled: !!userId,
  });
}

/**
 * Hook para obtener el progreso del usuario con filtros.
 * @param userId El ID del usuario.
 * @param filters Los filtros para la consulta de progreso.
 * @returns Un objeto de React Query con los datos de progreso paginados, estado de carga y error.
 */
export function useUserProgress(userId: string | undefined, filters?: GetUserProgressFilters) {
  return useQuery<PaginatedUserProgressResponse, ApiError>({
    queryKey: ['userProgress', userId, filters],
    queryFn: async () => (await ProgressService.getUserProgress(userId!, filters)).data,
    enabled: !!userId,
  });
}
