import { apiRequest } from '../_shared';
import type { ProgressDto, CreateProgressDto, UpdateLearningProgressDto } from '../../types/api'; // Asegúrate de que estos tipos existan

const ProgressService = {
  getProgressByUser: (userId: string) => {
    return apiRequest<ProgressDto[]>('GET', `/progress/user/${userId}`);
  },
  createProgress: (progressData: CreateProgressDto) => {
    return apiRequest<ProgressDto>('POST', '/progress', progressData);
  },
  markProgressAsCompleted: (progressId: string, data: { answers: Record<string, any> }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/complete`, data);
  },
  updateProgressScore: (progressId: string, data: { score: number }) => {
    return apiRequest<ProgressDto>('PATCH', `/progress/${progressId}/score`, data);
  },
};

export default ProgressService;
