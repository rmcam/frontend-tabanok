import type { ApiResponse } from '../../types/common/common.d';
import type { Activity, CreateActivityDto, UpdateActivityDto, ActivityQueryParams } from '../../types/activities/activities.d';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de actividades.
 */
export const activitiesService = {
  createActivity: (data: CreateActivityDto) =>
    apiRequest<ApiResponse<Activity>>('POST', '/activities', data),

  getAllActivities: (params?: ActivityQueryParams) =>
    apiRequest<ApiResponse<Activity[]>>('GET', '/activities', params),

  getActivityById: (id: string) =>
    apiRequest<ApiResponse<Activity>>('GET', `/activities/${id}`),

  updateActivity: (id: string, data: UpdateActivityDto) =>
    apiRequest<ApiResponse<Activity>>('PATCH', `/activities/${id}`, data),

  deleteActivity: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/activities/${id}`),

  updateActivityPoints: (id: string, points: number) =>
    apiRequest<ApiResponse<Activity>>('PATCH', `/activities/${id}/points`, { points }),
};
