import type {
  ApiResponse,
  MissionTemplate,
  CreateMissionTemplateDto,
  UpdateMissionTemplateDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de plantillas de misión.
 */
export const missionTemplatesService = {
  getAllMissionTemplates: () =>
    apiRequest<ApiResponse<MissionTemplate[]>>('GET', '/api/v1/mission-templates'),
  createMissionTemplate: (templateData: CreateMissionTemplateDto) =>
    apiRequest<ApiResponse<MissionTemplate>>('POST', '/api/v1/mission-templates', templateData),
  getMissionTemplateById: (id: string) =>
    apiRequest<ApiResponse<MissionTemplate>>('GET', `/api/v1/mission-templates/${id}`),
  updateMissionTemplate: (id: string, templateData: UpdateMissionTemplateDto) =>
    apiRequest<ApiResponse<MissionTemplate>>('PUT', `/api/v1/mission-templates/${id}`, templateData),
  deleteMissionTemplate: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/api/v1/mission-templates/${id}`),
};
