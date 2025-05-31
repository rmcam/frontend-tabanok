import type {
  ApiResponse,
  UserBadge,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de insignias.
 */
export const badgesService = {
  getBadgesByUserId: (userId: string) =>
    apiRequest<ApiResponse<UserBadge[]>>('GET', `/badges/users/${userId}`),
};
