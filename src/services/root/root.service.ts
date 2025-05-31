import type {
  ApiResponse,
  HealthResponse,
  WelcomeResponse,
} from '../../types/api';

import { apiRequest } from '../_shared';

// Funciones específicas para los endpoints generales
export const rootService = {
  getHealth: () =>
    apiRequest<ApiResponse<HealthResponse>>('GET', '/healthz'),

  getWelcomeMessage: () =>
    apiRequest<WelcomeResponse>('GET', '/'),
};
