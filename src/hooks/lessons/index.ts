import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonsService } from '../../services/lessons';
import type { Lesson, CreateLessonDto, UpdateLessonDto } from '../../types/api';

/**
 * Claves de consulta para TanStack Query.
 */
export const lessonQueryKeys = {
  all: ['lessons'] as const,
  lists: (page?: number, limit?: number) => [...lessonQueryKeys.all, 'list', page, limit] as const,
  byUnity: (unityId: string) => [...lessonQueryKeys.all, 'byUnity', unityId] as const,
  details: () => [...lessonQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...lessonQueryKeys.details(), id] as const,
};

/**
 * Hook para obtener una lista paginada de todas las lecciones.
 * @param page El número de página (opcional).
 * @param limit El límite de elementos por página (opcional).
 * @returns Un objeto con los datos de las lecciones, estado de carga y error.
 */
export const useAllLessons = (page?: number, limit?: number) => {
  return useQuery<Lesson[], Error>({
    queryKey: lessonQueryKeys.lists(page, limit),
    queryFn: () => lessonsService.getAllLessons(page, limit),
  });
};

/**
 * Hook para obtener lecciones por una unidad específica.
 * @param unityId El ID de la unidad.
 * @returns Un objeto con los datos de las lecciones, estado de carga y error.
 */
export const useLessonsByUnityId = (unityId: string) => {
  return useQuery<Lesson[], Error>({
    queryKey: lessonQueryKeys.byUnity(unityId),
    queryFn: () => lessonsService.getLessonsByUnityId(unityId),
    enabled: !!unityId,
  });
};

/**
 * Hook para obtener los detalles de una lección específica por su ID.
 * @param lessonId El ID de la lección.
 * @returns Un objeto con los datos de la lección, estado de carga y error.
 */
export const useLessonById = (lessonId: string) => {
  return useQuery<Lesson, Error>({
    queryKey: lessonQueryKeys.detail(lessonId),
    queryFn: () => lessonsService.getLessonById(lessonId),
    enabled: !!lessonId,
  });
};

/**
 * Hook para crear una nueva lección.
 * Invalida las consultas de lecciones después de una creación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useCreateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<Lesson, Error, CreateLessonDto>({
    mutationFn: lessonsService.createLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
    },
  });
};

/**
 * Hook para actualizar una lección existente.
 * Invalida las consultas de lecciones y el detalle de la lección después de una actualización exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useUpdateLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<Lesson, Error, { id: string; data: UpdateLessonDto }>({
    mutationFn: ({ id, data }) => lessonsService.updateLesson(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
    },
  });
};

/**
 * Hook para eliminar una lección.
 * Invalida las consultas de lecciones después de una eliminación exitosa.
 * @returns Un objeto con la función de mutación, estado de carga y error.
 */
export const useDeleteLesson = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: lessonsService.deleteLesson,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: lessonQueryKeys.all });
    },
  });
};
