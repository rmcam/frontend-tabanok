import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { exercisesService } from '../../services/exercises/exercises.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de ejercicios.
 */
export const useAllExercises = () => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ['exercises'],
    queryFn: async () => (await exercisesService.getAllExercises()).data,
  });
};

export const useExerciseById = (id: string) => {
  return useQuery<Exercise, ApiError>({
    queryKey: ['exercises', id],
    queryFn: async () => (await exercisesService.getExerciseById(id)).data,
    enabled: !!id,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Exercise>, ApiError, CreateExerciseDto>({
    mutationFn: exercisesService.createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Ejercicio creado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al crear ejercicio:', error.message, error.details);
    },
  });
};

export const useExercisesByTopicId = (topicId: string) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ['exercises', { topicId }],
    queryFn: async () => exercisesService.getExercisesByTopicId(topicId),
    enabled: !!topicId,
  });
};

export const useExercisesByLessonId = (lessonId: string) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ['exercises', { lessonId }],
    queryFn: async () => exercisesService.getExercisesByLessonId(lessonId),
    enabled: !!lessonId,
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Exercise>, ApiError, { id: string, exerciseData: UpdateExerciseDto }>({
    mutationFn: ({ id, exerciseData }) => exercisesService.updateExercise(id, exerciseData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['exercises', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success(data.message || 'Ejercicio actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar ejercicio:', error.message, error.details);
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: exercisesService.deleteExercise,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['exercises', id] });
      queryClient.invalidateQueries({ queryKey: ['exercises'] });
      toast.success('Ejercicio eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar ejercicio:', error.message, error.details);
    },
  });
};
