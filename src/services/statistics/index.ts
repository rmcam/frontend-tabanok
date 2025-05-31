import { apiRequest } from '../_shared';
import type { Statistics, CreateStatisticsDto, UpdateLearningProgressDto, LearningPathDto } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Estadísticas.
 */
export const statisticsService = {
  /**
   * Obtiene la ruta de aprendizaje del usuario, incluyendo módulos, unidades y lecciones.
   * @param userId El ID del usuario.
   * @returns Una promesa que resuelve con la ruta de aprendizaje del usuario.
   */
  getUserLearningPath: async (userId: string): Promise<LearningPathDto> => {
    return apiRequest<LearningPathDto>('GET', `/statistics/${userId}/learning-path`);
  },

  /**
   * Obtiene las estadísticas de un usuario.
   * @param userId El ID del usuario.
   * @returns Una promesa que resuelve con las estadísticas del usuario.
   */
  getUserStatistics: async (userId: string): Promise<Statistics> => {
    return apiRequest<Statistics>('GET', `/statistics/${userId}`);
  },

  /**
   * Crea un nuevo registro de estadísticas para un usuario.
   * @param data Los datos para crear las estadísticas.
   * @returns Una promesa que resuelve con las estadísticas creadas.
   */
  createStatistics: async (data: CreateStatisticsDto): Promise<Statistics> => {
    return apiRequest<Statistics>('POST', '/statistics', data);
  },

  /**
   * Actualiza el progreso de aprendizaje de un usuario.
   * @param userId El ID del usuario.
   * @param data Los datos para actualizar el progreso de aprendizaje.
   * @returns Una promesa que resuelve con las estadísticas actualizadas.
   */
  updateLearningProgress: async (userId: string, data: UpdateLearningProgressDto): Promise<Statistics> => {
    return apiRequest<Statistics>('PATCH', `/statistics/${userId}/learning-progress`, data);
  },

  // Aunque el prompt no especifica endpoints para eliminar estadísticas,
  // es común tenerlos. Si se necesitan, se añadirían aquí.
  /*
  deleteStatistics: async (userId: string): Promise<void> => {
    return apiRequest<void>('DELETE', `/statistics/${userId}`);
  },
  */
};
