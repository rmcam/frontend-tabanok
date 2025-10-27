import { apiRequest } from '../_shared';
import type { ProgressDto, CreateProgressDto, ApiResponse } from '../../types/api'; // Asegúrate de que estos tipos existan
import type { Exercise } from '../../types/api'; // Importar Exercise para el tipo de retorno de getOrCreateProgress

const ProgressService = {
  getProgressByUser: (userId: string) => {
    return apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
  },
  createProgress: (progressData: CreateProgressDto) => {
    return apiRequest<ProgressDto>('POST', '/progress', progressData);
  },
  getOrCreateProgress: async (userId: string, exerciseId: string): Promise<ProgressDto> => {
    // Primero, intentar obtener el progreso existente para este usuario y ejercicio
    const userProgresses = await apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
    let progress = userProgresses.find(p => p.exerciseId === exerciseId);

    if (!progress) {
      // Si no existe, crear un nuevo progreso
      const newProgressData: CreateProgressDto = {
        userId,
        exerciseId,
        isCompleted: false,
        score: 0,
        answers: {},
      };
      progress = await apiRequest<ProgressDto>('POST', '/progress', newProgressData);
    }
    return progress;
  },
  markProgressAsCompleted: (progressId: string, data: { answers: Record<string, any> }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/complete`, data);
  },
  updateProgressScore: (progressId: string, data: { score: number }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/score`, data);
  },
};

export default ProgressService;
