import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exercisesService } from "@/services/exercises/exercises.service";
import ProgressService from "@/services/progress/progress.service";
import { ApiError } from "@/services/_shared";
import { useProfile } from "../auth/auth.hooks";
import type { ApiResponse } from "@/types/common/common.d";
import type { GamificationUserStatsDto } from "@/types/gamification/gamification.d";
import type { Exercise, CreateExerciseDto, UpdateExerciseDto } from "@/types/learning/learning.d";
import type { ProgressDto, SubmitExerciseDto, SubmitExerciseResponse } from "@/types/progress/progress.d";
import type { ExerciseQueryParams } from "@/types/exercises/exercises.d";

/**
 * Hooks para los endpoints de ejercicios.
 */
export const useAllExercises = (params?: ExerciseQueryParams) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", params],
    queryFn: async () => (await exercisesService.getAllExercises(params)).data,
  });
};

export const useExerciseById = (id: string) => {
  return useQuery<Exercise, ApiError>({
    queryKey: ["exercises", id],
    queryFn: async () => (await exercisesService.getExerciseById(id)).data,
    enabled: !!id,
  });
};

export const useCreateExercise = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Exercise>, ApiError, CreateExerciseDto>({
    mutationFn: exercisesService.createExercise,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["exercises", data.data.id] });
      toast.success("Ejercicio creado exitosamente.");
    },
    onError: (error) => {
      console.error("Error al crear ejercicio:", error.message, error.details);
      toast.error("Error al crear ejercicio.");
    },
  });
};

export const useExercisesByTopicId = (topicId: string, params?: ExerciseQueryParams) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", { topicId }, params],
    queryFn: async () => (await exercisesService.getExercisesByTopicId(topicId, params)).data,
    enabled: !!topicId,
  });
};

export const useExercisesByLessonId = (lessonId: string, params?: ExerciseQueryParams) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", { lessonId }, params],
    queryFn: async () => (await exercisesService.getExercisesByLessonId(lessonId, params)).data,
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
      toast.error("Error al actualizar ejercicio.");
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
      toast.error("Error al eliminar ejercicio.");
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
  const { data: userProfile } = useProfile();

  return useMutation<
    SubmitExerciseResponse,
    ApiError,
    { id: string; submission: SubmitExerciseDto },
    SubmitExerciseContext
  >({
    mutationFn: async ({ id: exerciseId, submission }) => {
      if (!userProfile?.id) {
        throw new Error("User not authenticated.");
      }

      const progressResponse = await ProgressService.getOrCreateProgress(
        userProfile.id,
        exerciseId
      );
      const progress: ProgressDto = progressResponse.data;

      const response = await ProgressService.markProgressAsCompleted(
        progress.id,
        { answers: submission }
      );

      return {
        isCorrect: response.data.isCompleted,
        score: response.data.score || 0,
        awardedPoints: response.data.score || 0,
        message: response.data.isCompleted
          ? "Ejercicio completado."
          : "Progreso actualizado.",
        details: submission, // Usar la submission original para los detalles
        userAnswer: JSON.stringify(submission),
        userId: userProfile.id, // Usar el ID del perfil de usuario
        exerciseId: exerciseId, // Usar el exerciseId de la mutación
      };
    },
    onMutate: async ({ id: exerciseId, submission: _submission }) => {
      await queryClient.cancelQueries({ queryKey: ["exercises", exerciseId] });
      await queryClient.cancelQueries({ queryKey: ["user-progress"] });
      await queryClient.cancelQueries({ queryKey: ["user-stats"] });

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

      if (previousExercise) {
        queryClient.setQueryData<Exercise>(["exercises", exerciseId], {
          ...previousExercise,
          isCompleted: true,
          progress: previousExercise.points,
        });
      }

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
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["lesson"] });
      queryClient.invalidateQueries({ queryKey: ["user-progress"] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};
