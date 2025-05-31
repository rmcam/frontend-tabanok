import type {
  ApiResponse,
  Reward,
  CreateRewardDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de recompensas.
 */
export const rewardsService = {
  createReward: (rewardData: CreateRewardDto) =>
    apiRequest<ApiResponse<Reward>>('POST', '/rewards', rewardData),
  getAvailableRewards: () =>
    apiRequest<ApiResponse<Reward[]>>('GET', '/rewards'),
  awardRewardToUser: (rewardId: string, userId: string) =>
    apiRequest<ApiResponse<void>>('POST', `/rewards/${rewardId}/award/${userId}`),
  getUserRewards: (userId: string) =>
    apiRequest<ApiResponse<Reward[]>>('GET', `/rewards/user/${userId}`),
  consumeReward: (userId: string, rewardId: string) =>
    apiRequest<ApiResponse<void>>('PUT', `/rewards/user/${userId}/reward/${rewardId}/consume`),
  checkRewardStatus: (userId: string, rewardId: string) =>
    apiRequest<ApiResponse<any>>('GET', `/rewards/user/${userId}/reward/${rewardId}/status`), // Ajustar tipo de respuesta
};
