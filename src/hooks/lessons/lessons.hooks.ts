import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { lessonsService } from '@/services/lessons/lessons.service';
import { ApiError } from '@/services/_shared';
import type { Lesson, CreateLessonDto, UpdateLessonDto, LessonQueryParams } from '@/types/lessons/lessons.d';
import type { Unity } from '@/types/learning/learning.d';
import type { ApiResponse } from '@/types/common/common.d';

/**
 * Hook para crear una nueva lección.
 */
export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Lesson>, ApiError, CreateLessonDto>({
    mutationFn: (data) => lessonsService.createLesson(data),
    onSuccess: () => {
      toast.success('Lección creada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      console.error('Error al crear lección:', error.message, error.details);
      toast.error('Error al crear lección.');
    },
  });
}

/**
 * Hook para obtener todas las lecciones.
 */
export function useAllLessons(params?: LessonQueryParams) {
  return useQuery<Lesson[], ApiError>({
    queryKey: ['lessons', params],
    queryFn: async () => (await lessonsService.getAllLessons(params)).data,
  });
}

/**
 * Hook para obtener una lección por su ID.
 */
export function useLessonById(lessonId: string) {
  return useQuery<Lesson | null, ApiError>({ // Permitir que Lesson sea null
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const response = await lessonsService.getLessonById(lessonId);
      // La API devuelve directamente el objeto Lesson, no un ApiResponse<Lesson>
      return response; // response ya es Lesson | null
    },
    enabled: !!lessonId,
  });
}

/**
 * Hook para actualizar una lección por su ID.
 */
export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Lesson>, ApiError, { id: string; data: UpdateLessonDto }>({
    mutationFn: ({ id, data }) => lessonsService.updateLesson(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Lección actualizada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      console.error('Error al actualizar lección:', error.message, error.details);
      toast.error('Error al actualizar lección.');
    },
  });
}

/**
 * Hook para eliminar una lección por su ID.
 */
export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: (id) => lessonsService.deleteLesson(id),
    onSuccess: () => {
      toast.success('Lección eliminada exitosamente.');
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      console.error('Error al eliminar lección:', error.message, error.details);
      toast.error('Error al eliminar lección.');
    },
  });
}

/**
 * Hook para alternar el bloqueo de una lección.
 */
export function useToggleLessonLock() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Lesson>, ApiError, string>({
    mutationFn: (id) => lessonsService.toggleLessonLock(id),
    onSuccess: (_, id) => {
      toast.success('Estado de bloqueo de lección actualizado.');
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      console.error('Error al alternar bloqueo de lección:', error.message, error.details);
      toast.error('Error al alternar bloqueo de lección.');
    },
  });
}

/**
 * Hook para actualizar los puntos de una lección.
 */
export function useUpdateLessonPoints() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Lesson>, ApiError, { id: string; points: number }>({
    mutationFn: ({ id, points }) => lessonsService.updateLessonPoints(id, points),
    onSuccess: (_, { id }) => {
      toast.success('Puntos de lección actualizados.');
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
    },
    onError: (error) => {
      console.error('Error al actualizar puntos de lección:', error.message, error.details);
      toast.error('Error al actualizar puntos de lección.');
    },
  });
}

/**
 * Hook para marcar una lección como completada.
 */
export function useCompleteLesson() {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Lesson>, ApiError, string>({
    mutationFn: (id) => lessonsService.markLessonAsCompleted(id),
    onSuccess: (_, id) => {
      toast.success('Lección marcada como completada.');
      queryClient.invalidateQueries({ queryKey: ['lesson', id] });
      queryClient.invalidateQueries({ queryKey: ['lessons'] });
      queryClient.invalidateQueries({ queryKey: ['progress'] }); // Invalidar progreso del usuario
    },
    onError: (error) => {
      console.error('Error al marcar lección como completada:', error.message, error.details);
      toast.error('Error al marcar lección como completada.');
    },
  });
}

/**
 * Hook para obtener la lección diaria de un usuario.
 */
export function useDailyLesson(userId: string) {
  return useQuery<Lesson, ApiError>({
    queryKey: ['dailyLesson', userId],
    queryFn: async () => (await lessonsService.getDailyLesson(userId)).data,
    enabled: !!userId,
  });
}

/**
 * Hook para obtener todas las unidades con sus lecciones anidadas.
 */
export function useAllUnitsWithLessons(params?: LessonQueryParams) {
  return useQuery<Unity[], ApiError>({
    queryKey: ['allUnitsWithLessons', params],
    queryFn: async () => (await lessonsService.getAllUnitsWithLessons(params)).data,
  });
}
