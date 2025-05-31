import type {
  ApiResponse,
  Account,
  CreateAccountDto,
  UpdateAccountDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de cuentas.
 */
export const accountsService = {
  createAccount: (accountData: CreateAccountDto) =>
    apiRequest<ApiResponse<Account>>('POST', '/accounts', accountData),
  getAllAccounts: () =>
    apiRequest<ApiResponse<Account[]>>('GET', '/accounts'),
  getAccountById: (id: string) =>
    apiRequest<ApiResponse<Account>>('GET', `/accounts/${id}`),
  updateAccount: (id: string, accountData: UpdateAccountDto) =>
    apiRequest<ApiResponse<Account>>('PATCH', `/accounts/${id}`, accountData),
  deleteAccount: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/accounts/${id}`),
  updateAccountSettings: (id: string, settings: Record<string, any>) =>
    apiRequest<ApiResponse<Account>>('PATCH', `/accounts/${id}/settings`, settings),
  updateAccountPreferences: (id: string, preferences: Record<string, any>) =>
    apiRequest<ApiResponse<Account>>('PATCH', `/accounts/${id}/preferences`, preferences),
  updateAccountStreak: (id: string, streak: number) =>
    apiRequest<ApiResponse<Account>>('PATCH', `/accounts/${id}/streak`, { streak }),
};
