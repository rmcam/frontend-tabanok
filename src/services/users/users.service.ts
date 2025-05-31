  import type {
    ApiResponse,
    User,
    UserProfile, // Importar UserProfile
    CreateUserDto,
    UpdateUserDto,
  } from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de usuarios.
 */
export const usersService = {
  createUser: (userData: CreateUserDto) =>
    apiRequest<ApiResponse<User>>('POST', '/users', userData),
  getAllUsers: () =>
    apiRequest<ApiResponse<User[]>>('GET', '/users'),
  getUserById: (id: string) =>
    apiRequest<UserProfile>('GET', `/users/${id}`), // Cambiar a UserProfile
  updateUser: (id: string, userData: UpdateUserDto) =>
    apiRequest<ApiResponse<User>>('PATCH', `/users/${id}`, userData),
  deleteUser: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/users/${id}`),
  getUserByEmail: (email: string) =>
    apiRequest<ApiResponse<User>>('GET', `/users/email/${email}`),
  updateUserRoles: (id: string, roles: string[]) =>
    apiRequest<ApiResponse<User>>('PATCH', `/users/${id}/roles`, { roles }),
  updateUserPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<User>>('PATCH', `/users/${id}/points`, { points }),
  updateUserLevel: (id: string, level: number) =>
    apiRequest<ApiResponse<User>>('PATCH', `/users/${id}/level`, { level }),
};
