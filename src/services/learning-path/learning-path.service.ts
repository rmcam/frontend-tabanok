import type { LearningPathDto, ApiResponse } from '../../types/api';
import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints del camino de aprendizaje.
 */
export const learningPathService = {
  /**
   * Obtiene el camino de aprendizaje completo del usuario, incluyendo módulos, unidades, lecciones y progreso.
   * @returns Una promesa que resuelve con el objeto LearningPathDto.
   */
  getLearningPath: () =>
    apiRequest<ApiResponse<LearningPathDto>>('GET', '/learning-path'),
};
