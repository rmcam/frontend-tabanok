import { useQuery } from '@tanstack/react-query';
import { mentorsService } from '../../services/mentors/mentors.service';
import { ApiError } from '../../services/_shared';
import type {
  Mentor,
} from '../../types/api';

/**
 * Hooks para los endpoints de mentores.
 */
export const useAllMentors = () => {
  return useQuery<Mentor[], ApiError>({
    queryKey: ['mentors'],
    queryFn: async () => (await mentorsService.getAllMentors()).data,
  });
};

export const useMentorById = (mentorId: string) => {
  return useQuery<Mentor, ApiError>({
    queryKey: ['mentors', mentorId],
    queryFn: async () => (await mentorsService.getMentorById(mentorId)).data,
    enabled: !!mentorId,
  });
};
