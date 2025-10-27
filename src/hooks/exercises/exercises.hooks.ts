import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exercisesService } from "../../services/exercises/exercises.service";
import ProgressService from "../../services/progress/progress.service"; // Importar ProgressService
import { ApiError } from "../../services/_shared";
import { useProfile } from "../auth/auth.hooks"; // Importar useProfile
import type {
  ApiResponse,
  Exercise,
  CreateExerciseDto,
  UpdateExerciseDto,
  SubmitExerciseDto,
  SubmitExerciseResponse,
  GamificationUserStatsDto, // Para invalidar o actualizar las estadísticas del usuario
  ProgressDto, // Importar ProgressDto
} from "../../types/api";

/**
 * Hooks para los endpoints de ejercicios.
 */
export const useAllExercises = () => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises"],
    queryFn: async () => (await exercisesService.getAllExercises()).data,
  });
};

export const useExerciseById = (id: string) => {
  return useQuery<Exercise, ApiError>({
    queryKey: ["exercises", id],
    queryFn: async () => {
      const response = await exercisesService.getExerciseById(id);
      // Asumimos que el backend devuelve directamente el Exercise, no envuelto en ApiResponse.data
      return response as Exercise;
    },
    enabled: !!id,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Exercise>, ApiError, CreateExerciseDto>({
    mutationFn: exercisesService.createExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Ejercicio creado exitosamente.");
    },
    onError: (error) => {
      console.error("Error al crear ejercicio:", error.message, error.details);
    },
  });
};

export const useExercisesByTopicId = (topicId: string) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", { topicId }],
    queryFn: async () => exercisesService.getExercisesByTopicId(topicId),
    enabled: !!topicId,
  });
};

export const useExercisesByLessonId = (lessonId: string) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", { lessonId }],
    queryFn: async () => exercisesService.getExercisesByLessonId(lessonId),
    enabled: !!lessonId,
  });
};

export const useUpdateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<Exercise>,
    ApiError,
    { id: string; exerciseData: UpdateExerciseDto }
  >({
    mutationFn: ({ id, exerciseData }) =>
      exercisesService.updateExercise(id, exerciseData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success(data.message || "Ejercicio actualizado exitosamente.");
    },
    onError: (error) => {
      console.error(
        "Error al actualizar ejercicio:",
        error.message,
        error.details
      );
    },
  });
};

export const useDeleteExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: exercisesService.deleteExercise,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["exercises", id] });
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      toast.success("Ejercicio eliminado exitosamente.");
    },
    onError: (error) => {
      console.error(
        "Error al eliminar ejercicio:",
        error.message,
        error.details
      );
    },
  });
};

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  const { data: userProfile } = useProfile(); // Asumiendo que useProfile está disponible y devuelve el perfil del usuario

  return useMutation<
    SubmitExerciseResponse,
    ApiError,
    { id: string; submission: SubmitExerciseDto }
  >({
    mutationFn: async ({ id: exerciseId, submission }) => {
      if (!userProfile?.id) {
        throw new Error("User not authenticated.");
      }

      // 1. Obtener o crear el progreso para el usuario y el ejercicio
      const progress: ProgressDto = await ProgressService.getOrCreateProgress(
        userProfile.id,
        exerciseId
      );

      // 2. Enviar las respuestas al endpoint de completar progreso
      const response = await ProgressService.markProgressAsCompleted(
        progress.id,
        { answers: submission }
      );

      // El backend ahora devuelve el score y si es correcto, así que mapeamos la respuesta
      return {
        isCorrect: response.score && response.score > 0 ? true : false, // Asumimos que un score > 0 significa correcto
        score: response.score || 0,
        awardedPoints: response.score || 0, // O ajustar según la lógica de puntos del backend
        message: response.isCompleted
          ? "Ejercicio completado."
          : "Progreso actualizado.",
        details: response.answers,
        userAnswer: JSON.stringify(submission),
      };
    },
    onSuccess: (data, variables) => {
      toast.success(
        data.message ||
          (data.isCorrect
            ? "¡Respuesta correcta! Ganaste puntos."
            : "Respuesta incorrecta. Inténtalo de nuevo.")
      );
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["lesson"] }); // Invalidar lecciones para actualizar el progreso
      queryClient.invalidateQueries({ queryKey: ["user-progress"] }); // Invalidar el progreso del usuario
      queryClient.invalidateQueries({ queryKey: ["user-stats"] }); // Invalidar las estadísticas del usuario para gamificación

      // La lógica de actualización de estadísticas de gamificación (newLevel, totalPoints)
      // debe manejarse en el backend o en un hook de gamificación separado
      // si la respuesta de `markProgressAsCompleted` no incluye estos campos.
      // Por ahora, se elimina la lógica que espera estos campos directamente de SubmitExerciseResponse.
      queryClient.invalidateQueries({ queryKey: ["user-stats"] }); // Asegurar que las estadísticas se refetchean
    },
    onError: (error) => {
      console.error(
        "Error al enviar respuesta del ejercicio:",
        error.message,
        error.details
      );
      toast.error("Error al enviar respuesta del ejercicio.");
    },
  });
};
