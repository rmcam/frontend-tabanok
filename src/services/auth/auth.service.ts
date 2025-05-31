import type {
  ApiResponse,
  ApiError as IApiError,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfile,
  PasswordChangeRequest,
  PasswordResetRequest,
  ResetPasswordRequest,
  TokenRefreshResponse,
} from '../../types/api';

import { apiRequest, ApiError, handleApiResponse, API_URL } from '../_shared';

// Funciones específicas para los endpoints de autenticación
export const authService = {
  login: (credentials: LoginRequest) => {
    // Asumiendo que el backend espera 'identifier' en lugar de 'email'
    const { identifier, password } = credentials;
    const backendPayload = { identifier, password };
    return apiRequest<ApiResponse<LoginResponse>>('POST', '/auth/signin', backendPayload);
  },

  register: (userData: RegisterRequest) =>
    apiRequest<ApiResponse<LoginResponse>>('POST', '/auth/signup', userData),

  getProfile: () =>
    apiRequest<UserProfile>('GET', '/auth/profile'),

  updateProfile: (profileData: Partial<UserProfile>) =>
    apiRequest<UserProfile>('PUT', '/auth/profile', profileData),

  changePassword: (passwordData: PasswordChangeRequest) =>
    apiRequest<void>('POST', '/auth/password/change', passwordData),

  requestPasswordReset: (data: PasswordResetRequest) =>
    apiRequest<void>('POST', '/auth/password/reset/request', data),

  resetPassword: (data: ResetPasswordRequest) =>
    apiRequest<void>('POST', '/auth/reset-password', data),

  refreshToken: () =>
    apiRequest<TokenRefreshResponse>('POST', '/auth/refresh'),

  verifySession: () =>
    apiRequest<UserProfile>('GET', '/auth/verify-session'),

  logout: async () => {
    await apiRequest<void>('POST', '/auth/signout');
  },
};
