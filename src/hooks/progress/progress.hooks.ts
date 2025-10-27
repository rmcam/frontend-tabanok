import { useQuery } from '@tanstack/react-query';
import ProgressService from '../../services/progress/progress.service';
import type { UserLessonProgress, UserUnityProgress } from '../../types/api';
import { useUserStore } from '@/stores/userStore';

/**
 * Hook para obtener el progreso de todas las lecciones de un usuario.
 * @returns Un objeto de React Query con los datos de progreso de lecciones, estado de carga y error.
 */
export function useAllUserLessonProgress() {
  const { user } = useUserStore();
  const userId = user?.id;

  return useQuery<UserLessonProgress[], Error>({
    queryKey: ['allUserLessonProgress', userId],
    queryFn: () => ProgressService.getAllUserLessonProgress(userId!),
    enabled: !!userId,
  });
}

/**
 * Hook para obtener el progreso de todas las unidades de un usuario.
 * @returns Un objeto de React Query con los datos de progreso de unidades, estado de carga y error.
 */
export function useAllUserUnityProgress() {
  const { user } = useUserStore();
  const userId = user?.id;

  return useQuery<UserUnityProgress[], Error>({
    queryKey: ['allUserUnityProgress', userId],
    queryFn: () => ProgressService.getAllUserUnityProgress(userId!),
    enabled: !!userId,
  });
}
