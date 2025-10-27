import { useQuery } from '@tanstack/react-query';
import { lessonsService } from '@/services/lessons/lessons.service';
import type { Lesson, Unity } from '@/types/api'; // Importar Lesson y Unity de api.d.ts

/**
 * Hook para obtener una lección por su ID.
 * @param lessonId El ID de la lección a obtener.
 * @returns Un objeto de React Query con los datos de la lección, estado de carga y error.
 */
export function useLessonById(lessonId: string) {
  return useQuery<Lesson, Error>({ // Cambiado a Lesson
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonsService.getLessonById(lessonId),
    enabled: !!lessonId, // Solo ejecutar la query si lessonId existe
  });
}

/**
 * Hook para obtener la lección diaria de un usuario.
 * @param userId El ID del usuario.
 * @returns Un objeto de React Query con los datos de la lección diaria, estado de carga y error.
 */
export function useDailyLesson(userId: string) {
  return useQuery<Lesson, Error>({
    queryKey: ['dailyLesson', userId],
    queryFn: () => lessonsService.getDailyLesson(userId),
    enabled: !!userId, // Solo ejecutar la query si userId existe
  });
}

/**
 * Hook para obtener todas las unidades con sus lecciones anidadas.
 * @returns Un objeto de React Query con los datos de las unidades, estado de carga y error.
 */
export function useAllUnitsWithLessons() {
  return useQuery<Unity[], Error>({
    queryKey: ['allUnitsWithLessons'],
    queryFn: () => lessonsService.getAllUnitsWithLessons(),
  });
}
