import { useQuery } from '@tanstack/react-query';
import { lessonsService } from '@/services/lessons/lessons.service';
import type { LearningLesson } from '@/types/learning';

/**
 * Hook para obtener una lección por su ID.
 * @param lessonId El ID de la lección a obtener.
 * @returns Un objeto de React Query con los datos de la lección, estado de carga y error.
 */
export function useLessonById(lessonId: string) {
  return useQuery<LearningLesson, Error>({
    queryKey: ['lesson', lessonId],
    queryFn: () => lessonsService.getLessonById(lessonId),
    enabled: !!lessonId, // Solo ejecutar la query si lessonId existe
  });
}
