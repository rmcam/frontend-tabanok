import { useQuery } from '@tanstack/react-query';
import { learningPathService } from '@/services/learning-path/learning-path.service';
import type { LearningPathDto } from '@/types/api';

/**
 * Hook para obtener el camino de aprendizaje completo del usuario.
 */
export const useLearningPath = () => {
  return useQuery<LearningPathDto, Error>({
    queryKey: ['learningPath'],
    queryFn: async () => {
      const response = await learningPathService.getLearningPath();
      return response.data; // Asumiendo que la respuesta de la API tiene un campo 'data'
    },
  });
};
