import { activitiesService } from '../../services/activities/activities.service';
import { ApiError } from '../../services/_shared';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; // Añadir useMutation, useQueryClient
import { toast } from 'sonner'; // Añadir toast

import type {
  Exercise,
  CreateExerciseDto, // Añadir CreateExerciseDto
  UpdateExerciseDto, // Añadir UpdateExerciseDto
} from '../../types/api';

export const useActivityById = (id: string) => {
  return useQuery<Exercise, ApiError>({
    queryKey: ['activities', id],
    queryFn: async () => activitiesService.getActivityById(id),
    enabled: !!id,
  });
};

export const useCreateActivity = () => { // Nuevo hook de mutación
  const queryClient = useQueryClient();
  return useMutation<Exercise, ApiError, CreateExerciseDto>({
    mutationFn: activitiesService.createActivity,
    onSuccess: (data) => { // Añadir 'data' como parámetro para usarlo si es necesario
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      queryClient.invalidateQueries({ queryKey: ['activities', data.id] }); // Invalidar también por ID si la actividad tiene uno
      toast.success('Actividad creada exitosamente.');
    },
    onError: (error: ApiError) => {
      console.error('Error al crear actividad:', error.message, error.details);
    },
  });
};

/**
 * Hook para enviar las respuestas de un ejercicio.
 */
export const useSubmitExerciseAnswers = () => {
  const queryClient = useQueryClient();
  return useMutation<any, ApiError, { id: string, answers: any }>({ // Ajustar tipos si se define una respuesta específica
    mutationFn: ({ id, answers }) => activitiesService.submitExerciseAnswers(id, answers),
    onSuccess: (data: any) => { // Ajustar tipo si se define una respuesta específica
      console.log('Respuestas de ejercicio enviadas con éxito:', data);
      // Invalidar queries relevantes si la sumisión afecta el estado de la actividad o el progreso del usuario
      queryClient.invalidateQueries({ queryKey: ['activities', data.id] }); // Si la respuesta incluye el ID de la actividad
      queryClient.invalidateQueries({ queryKey: ['userProgress'] }); // Si la sumisión afecta el progreso del usuario
      toast.success('Respuestas enviadas.'); // Mensaje de éxito
    },
    onError: (error: ApiError) => {
      console.error('Error al enviar respuestas de ejercicio:', error.message, error.details);
      toast.error(`Error al enviar respuestas: ${error.message}`); // Mensaje de error
    },
  });
};

export const useUpdateActivity = () => { // Nuevo hook de mutación
  const queryClient = useQueryClient();
  return useMutation<Exercise, ApiError, { id: string, activityData: UpdateExerciseDto }>({
    mutationFn: ({ id, activityData }) => activitiesService.updateActivity(id, activityData),
    onSuccess: (_: Exercise, variables: { id: string, activityData: UpdateExerciseDto }) => { // Explicitly type data and variables
      queryClient.invalidateQueries({ queryKey: ['activities', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Actividad actualizada exitosamente.');
    },
    onError: (error: ApiError) => { // Explicitly type error
      console.error('Error al actualizar actividad:', error.message, error.details);
    },
  });
};

export const useDeleteActivity = () => { // Nuevo hook de mutación
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: activitiesService.deleteActivity,
    onSuccess: (_: void, id: string) => { // Explicitly type _ and id
      queryClient.invalidateQueries({ queryKey: ['activities', id] });
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Actividad eliminada exitosamente.');
    },
    onError: (error: ApiError) => { // Explicitly type error
      console.error('Error al eliminar actividad:', error.message, error.details);
    },
  });
};
