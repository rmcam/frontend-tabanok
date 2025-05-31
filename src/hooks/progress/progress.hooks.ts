import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProgressService from '../../services/progress/progress.service';
import { ApiError } from '../../services/_shared';
import type { ProgressDto, CreateProgressDto, UpdateProgressCompletedDto, UpdateProgressScoreDto } from '../../types/api';
import type { UserProgress } from '../../types/learning'; // Importar el tipo UserProgress

const PROGRESS_QUERY_KEY = 'progress';

export const useGetProgressByUser = (userId: string | undefined) => {
  return useQuery<UserProgress, ApiError>({ // Cambiar el tipo de retorno a UserProgress
    queryKey: [PROGRESS_QUERY_KEY, userId],
    queryFn: async () => {
      if (!userId) {
        // Devolver un objeto UserProgress vacío si no hay userId
        return { completedExerciseIds: [], completedContentIds: [] };
      }
      const progressList = await ProgressService.getProgressByUser(userId);
      // Transformar ProgressDto[] a UserProgress
      const completedExerciseIds = progressList
        .filter(p => p.isCompleted)
        .map(p => p.exerciseId);

      // Asumiendo que ProgressDto solo cubre ejercicios.
      // Si el progreso del contenido se maneja de forma diferente, se necesitaría otra lógica aquí.
      const completedContentIds: string[] = []; // Dejar vacío por ahora

      return { completedExerciseIds, completedContentIds };
    },
    enabled: !!userId, // Solo ejecutar si userId existe
  });
};

export const useCreateProgress = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, ApiError, CreateProgressDto>({
    mutationFn: (progressData: CreateProgressDto) => ProgressService.createProgress(progressData),
    onSuccess: (newProgress) => {
      // Opcional: Actualizar la caché para incluir el nuevo progreso
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, newProgress.userId] });
      toast.success('Progreso registrado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al registrar progreso:', error.message, error.details);
    },
  });
};

export const useMarkProgressAsCompleted = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, ApiError, { progressId: string, data: UpdateProgressCompletedDto }>({
    mutationFn: ({ progressId, data }) => ProgressService.markProgressAsCompleted(progressId, data),
    onSuccess: (updatedProgress) => {
      // Opcional: Actualizar la caché para reflejar el progreso completado
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, updatedProgress.userId] });
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, updatedProgress.userId, updatedProgress.exerciseId] }); // Invalidar por ejercicio específico si es necesario
      toast.success('Ejercicio marcado como completado.');
    },
    onError: (error) => {
      console.error('Error al marcar progreso como completado:', error.message, error.details);
    },
  });
};

export const useUpdateProgressScore = () => {
  const queryClient = useQueryClient();
  return useMutation<ProgressDto, ApiError, { progressId: string, data: UpdateProgressScoreDto }>({
    mutationFn: ({ progressId, data }) => ProgressService.updateProgressScore(progressId, data),
    onSuccess: (updatedProgress) => {
      // Opcional: Actualizar la caché para reflejar el nuevo puntaje
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, updatedProgress.userId] });
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, updatedProgress.userId, updatedProgress.exerciseId] }); // Invalidar por ejercicio específico si es necesario
      toast.success('Puntaje de progreso actualizado.');
    },
    onError: (error) => {
      console.error('Error al actualizar puntaje de progreso:', error.message, error.details);
    },
  });
};
