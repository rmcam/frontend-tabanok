import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProgressService from '../../services/progress/progress.service';
import { ApiError } from '../../services/_shared';
import type { ProgressDto, CreateProgressDto, UpdateProgressCompletedDto, UpdateProgressScoreDto, SubmitExerciseDto, SubmitExerciseResponse, ApiResponse } from '../../types/api';
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

      // Mapear tanto ejercicios como contenido completado
      const completedContentIds = progressList
        .filter(p => p.isCompleted && p.contentId)
        .map(p => p.contentId as string);

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

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<SubmitExerciseResponse>, ApiError, { id: string; submission: SubmitExerciseDto }>({
    mutationFn: ({ id, submission }) => ProgressService.submitExercise(id, submission),
    onSuccess: (response) => {
      // Invalidar las queries de progreso para que la UI se actualice
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, response.data.userId] });
      queryClient.invalidateQueries({ queryKey: [PROGRESS_QUERY_KEY, response.data.userId, response.data.exerciseId] });
      // No mostrar toast aquí, el componente que usa el hook lo manejará
    },
    onError: (error) => {
      console.error('Error al enviar ejercicio:', error.message, error.details);
      // No mostrar toast aquí, el componente que usa el hook lo manejará
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
