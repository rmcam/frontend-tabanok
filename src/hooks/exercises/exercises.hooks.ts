import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { exercisesService } from "@/services/exercises/exercises.service";
import ProgressService from "@/services/progress/progress.service";
import { ApiError } from "@/services/_shared";
import { useProfile } from "../auth/auth.hooks";
import type { ApiResponse } from "@/types/common/common.d";
import type { GamificationUserStatsDto } from "@/types/gamification/gamification.d";
import type {
  Exercise,
  ExerciseQueryParams,
  PaginatedExercisesResponse,
} from "@/types/exercises/exercises.d";
import type {
  CreateExerciseDto,
  UpdateExerciseDto,
} from "@/types/learning/learning.d"; // Importar desde learning.d
import type {
  SubmitExerciseDto,
  SubmitExerciseResponse,
  SubmitExerciseRequestBody,
} from "@/types/progress/progress.d";
import type { ExerciseUserProgress } from "@/types/progress/progress.d"; // Importar ExerciseUserProgress

/**
 * Hooks para los endpoints de ejercicios.
 */
export const useAllExercises = (params?: ExerciseQueryParams) => {
  return useQuery<PaginatedExercisesResponse, ApiError>({
    queryKey: ["exercises", params],
    queryFn: async () => {
      if (params?.withProgress) {
        return (await exercisesService.getExercisesWithProgress(params)).data;
      }
      return (await exercisesService.getAllExercises(params)).data;
    },
  });
};

export const useExerciseById = (id: string) => {
  return useQuery<Exercise, ApiError>({
    queryKey: ["exercises", id],
    queryFn: async () => {
      const response = await exercisesService.getExerciseById(id);
      if (!response) {
        throw new Error("No se encontraron datos para el ejercicio.");
      }
      return response;
    },
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

export const useExercisesByTopicId = (
  topicId: string,
  params?: ExerciseQueryParams
) => {
  return useQuery<Exercise[], ApiError>({
    queryKey: ["exercises", { topicId }, params],
    queryFn: async () =>
      (await exercisesService.getExercisesByTopicId(topicId, params)),
    enabled: !!topicId,
  });
};

export const useExercisesByLessonId = (
  lessonId: string,
  params?: ExerciseQueryParams
) => {
  return useQuery<Exercise[], ApiError>({ // Cambiado a Exercise[]
    queryKey: ["exercises", { lessonId }, params],
    queryFn: async () => {
      if (params?.withProgress) {
        return await exercisesService.getExercisesByLessonIdWithProgress(lessonId, params); // Eliminado .data
      }
      return await exercisesService.getExercisesByLessonId(lessonId, params); // Eliminado .data
    },
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
  previousAllExercisesWithProgress?: PaginatedExercisesResponse;
  previousLessonExercisesWithProgress?: Exercise[]; // Cambiado a Exercise[]
  previousUserStats?: GamificationUserStatsDto;
}

export const useSubmitExercise = () => {
  const queryClient = useQueryClient();
  const { data: userProfile } = useProfile();

  return useMutation<
    SubmitExerciseResponse, // El tipo de retorno ahora es directamente SubmitExerciseResponse
    ApiError,
    { id: string; submission: SubmitExerciseDto },
    SubmitExerciseContext
  >({
    mutationFn: async ({ id: exerciseId, submission }) => {
      if (!userProfile?.id) {
        throw new Error("User not authenticated.");
      }

      const fullSubmission: SubmitExerciseRequestBody = {
        userId: userProfile.id,
        exerciseId: exerciseId,
        answers: typeof submission.userAnswer === "string" ? { userAnswer: submission.userAnswer } : submission.userAnswer,
      };

      // Usar el nuevo endpoint consolidado
      const response = await ProgressService.submitExerciseProgress(fullSubmission);

      return response; // La respuesta ya cumple con SubmitExerciseResponse
    },
    onMutate: async ({ id: exerciseId, submission: _submission }) => {
      const previousExercise = queryClient.getQueryData<Exercise>([
        "exercises",
        exerciseId,
      ]);
      const previousAllExercisesWithProgress = queryClient.getQueryData<PaginatedExercisesResponse>([
        "exercises", { withProgress: true }
      ]);
      const previousLessonExercisesWithProgress = queryClient.getQueryData<Exercise[]>([
        "exercises", { lessonId: previousExercise?.lessonId, withProgress: true }
      ]);
      const previousUserStats =
        queryClient.getQueryData<GamificationUserStatsDto>(["user-stats"]);

      await queryClient.cancelQueries({ queryKey: ["exercises", exerciseId] });
      await queryClient.cancelQueries({ queryKey: ["exercises", { withProgress: true }] });
      await queryClient.cancelQueries({ queryKey: ["exercises", { lessonId: previousExercise?.lessonId, withProgress: true }] });
      await queryClient.cancelQueries({ queryKey: ["user-stats"] });

      if (previousExercise) {
        queryClient.setQueryData<Exercise>(["exercises", exerciseId], {
          ...previousExercise,
          userProgress: {
            id: "temp-id", // ID temporal, se actualizará con la respuesta real
            score: 0, // Score temporal
            isCompleted: true,
            isActive: true, // Asumimos que el progreso está activo si existe
          },
        });
      }

      if (previousAllExercisesWithProgress) {
        queryClient.setQueryData<PaginatedExercisesResponse>(
          ["exercises", { withProgress: true }],
          {
            ...previousAllExercisesWithProgress,
            data: previousAllExercisesWithProgress.data.map((ex) =>
              ex.id === exerciseId
                ? {
                    ...ex,
                    userProgress: {
                      id: "temp-id",
                      score: 0,
                      isCompleted: true,
                      isActive: true, // Asumimos que el progreso está activo si existe
                    },
                  }
                : ex
            ),
          }
        );
      }

      if (previousLessonExercisesWithProgress) {
        queryClient.setQueryData<Exercise[]>(
          ["exercises", { lessonId: previousExercise?.lessonId, withProgress: true }],
          previousLessonExercisesWithProgress.map((ex) =>
            ex.id === exerciseId
              ? {
                  ...ex,
                  userProgress: {
                    id: "temp-id",
                    score: 0,
                    isCompleted: true,
                    isActive: true, // Asumimos que el progreso está activo si existe
                  },
                }
              : ex
          )
        );
      }

      if (previousUserStats && previousExercise) {
        // La actualización de puntos se realizará en onSuccess, donde 'data' (la respuesta del submit) está disponible.
        // Aquí solo preparamos el contexto.
      }

      return { previousExercise, previousAllExercisesWithProgress, previousLessonExercisesWithProgress, previousUserStats };
    },
    onSuccess: (data, variables, context) => {
      toast.success(
        data.message ||
          (data.isCorrect
            ? "¡Respuesta correcta! Ganaste puntos."
            : "Respuesta incorrecta. Inténtalo de nuevo.")
      );

      // Actualizar los puntos del usuario en la caché
      if (context?.previousUserStats) {
        queryClient.setQueryData<GamificationUserStatsDto>(
          ["user-stats"],
          (oldStats) => {
            if (!oldStats) return oldStats;
            return {
              ...oldStats,
              points: (oldStats.points || 0) + data.score,
              totalPoints: (oldStats.totalPoints || 0) + data.score,
            };
          }
        );
      }

      // Actualizar el ejercicio individual en caché
      queryClient.setQueryData<Exercise>(["exercises", variables.id], (old) => {
        if (!old) return old;
        return {
          ...old,
          userProgress: {
            id: data.id,
            score: data.score,
            isCompleted: data.isCompleted,
            isActive: true, // Asumimos que el progreso está activo si existe
          },
        };
      });

      // Actualizar la lista de ejercicios de la lección en caché
      if (context?.previousLessonExercisesWithProgress && context.previousExercise?.lessonId) {
        queryClient.setQueryData<Exercise[]>(
          ["exercises", { lessonId: context.previousExercise.lessonId, withProgress: true }],
          (old) => {
            if (!old) return old;
            return old.map((ex) =>
              ex.id === variables.id
                ? {
                    ...ex,
                    userProgress: {
                      id: data.id,
                      score: data.score,
                      isCompleted: data.isCompleted,
                      isActive: true, // Asumimos que el progreso está activo si existe
                    },
                  }
                : ex
            );
          }
        );
      }

      // Invalidar otras queries que podrían necesitar una refetch
      queryClient.invalidateQueries({ queryKey: ["lesson", context.previousExercise?.lessonId] });
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
      if (context?.previousAllExercisesWithProgress) {
        queryClient.setQueryData(
          ["exercises", { withProgress: true }],
          context.previousAllExercisesWithProgress
        );
      }
      if (context?.previousLessonExercisesWithProgress) {
        queryClient.setQueryData<Exercise[]>(
          ["exercises", { lessonId: context.previousExercise?.lessonId, withProgress: true }],
          context.previousLessonExercisesWithProgress
        );
      }
      if (context?.previousUserStats) {
        queryClient.setQueryData(["user-stats"], context.previousUserStats);
      }
    },
    onSettled: (data, error, variables, context) => {
      // Invalidar queries para asegurar consistencia si la actualización optimista falló o si hay otros cambios
      queryClient.invalidateQueries({ queryKey: ["exercises", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["exercises", { withProgress: true }] });
      queryClient.invalidateQueries({ queryKey: ["exercises", { lessonId: context?.previousExercise?.lessonId, withProgress: true }] });
      queryClient.invalidateQueries({ queryKey: ["lesson", context?.previousExercise?.lessonId] });
      queryClient.invalidateQueries({ queryKey: ["user-stats"] });
    },
  });
};
