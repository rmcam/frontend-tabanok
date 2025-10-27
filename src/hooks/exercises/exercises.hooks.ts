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

interface SubmitExerciseContext {
  previousExercise?: Exercise;
  previousUserProgress?: ProgressDto[];
  previousUserStats?: GamificationUserStatsDto;
}

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  const { data: userProfile } = useProfile(); // Asumiendo que useProfile está disponible y devuelve el perfil del usuario

  return useMutation<
    SubmitExerciseResponse,
    ApiError,
    { id: string; submission: SubmitExerciseDto },
    SubmitExerciseContext // Añadir el tipo de contexto aquí
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
    onMutate: async ({ id: exerciseId, submission }) => {
      // Cancelar cualquier refetching pendiente para las queries afectadas
      await queryClient.cancelQueries({ queryKey: ["exercises", exerciseId] });
      await queryClient.cancelQueries({ queryKey: ["user-progress"] });
      await queryClient.cancelQueries({ queryKey: ["user-stats"] });

      // Snapshot del valor anterior
      const previousExercise = queryClient.getQueryData<Exercise>([
        "exercises",
        exerciseId,
      ]);
      const previousUserProgress = queryClient.getQueryData<ProgressDto[]>([
        "user-progress",
      ]);
      const previousUserStats = queryClient.getQueryData<GamificationUserStatsDto>([
        "user-stats",
      ]);

      // Optimistic update para el ejercicio
      if (previousExercise) {
        queryClient.setQueryData<Exercise>(["exercises", exerciseId], {
          ...previousExercise,
          isCompleted: true,
          progress: previousExercise.points, // Asumir puntos completos para la actualización optimista
        });
      }

      // Optimistic update para el progreso del usuario (si es relevante)
      if (previousUserProgress && userProfile?.id) {
        const updatedProgresses = previousUserProgress.map((p) =>
          p.exerciseId === exerciseId
            ? { ...p, isCompleted: true, score: previousExercise?.points || 0 }
            : p
        );
        queryClient.setQueryData<ProgressDto[]>(
          ["user-progress"],
          updatedProgresses
        );
      }

      // Optimistic update para las estadísticas del usuario (puntos)
      if (previousUserStats && previousExercise) {
        queryClient.setQueryData<GamificationUserStatsDto>(
          ["user-stats"],
          (oldStats) => {
            if (!oldStats) return oldStats;
            return {
              ...oldStats,
              points: (oldStats.points || 0) + previousExercise.points,
              totalPoints: (oldStats.totalPoints || 0) + previousExercise.points,
            };
          }
        );
      }

      return { previousExercise, previousUserProgress, previousUserStats };
    },
    onSuccess: (data, variables) => {
      toast.success(
        data.message ||
          (data.isCorrect
            ? "¡Respuesta correcta! Ganaste puntos."
            : "Respuesta incorrecta. Inténtalo de nuevo.")
      );
      // Invalidar queries para refetching de datos reales
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
    onError: (error, variables, context) => {
      console.error(
        "Error al enviar respuesta del ejercicio:",
        error.message,
        error.details
      );
      toast.error("Error al enviar respuesta del ejercicio.");

      // Revertir a los datos anteriores en caso de error
      if (context?.previousExercise) {
        queryClient.setQueryData(
          ["exercises", variables.id],
          context.previousExercise
        );
      }
      if (context?.previousUserProgress) {
        queryClient.setQueryData(["user-progress"], context.previousUserProgress);
      }
      if (context?.previousUserStats) {
        queryClient.setQueryData(["user-stats"], context.previousUserStats);
      }
    },
    onSettled: (data, error, variables) => {
      // Asegurar que las queries se refetcheen después de que la mutación se asiente
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};
