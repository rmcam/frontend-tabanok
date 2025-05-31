import { useQuery } from '@tanstack/react-query';
import { missionTemplatesService } from '../../services/mission-templates/mission-templates.service';
import { ApiError } from '../../services/_shared';
import type {
  MissionTemplate,
} from '../../types/api';

/**
 * Hooks para los endpoints de plantillas de misión.
 */
export const useAllMissionTemplates = () => {
  return useQuery<MissionTemplate[], ApiError>({
    queryKey: ['missionTemplates'],
    queryFn: async () => (await missionTemplatesService.getAllMissionTemplates()).data,
  });
};
