import type {
  ApiResponse,
  Mentor,
  CreateMentorDto,
  UpdateAvailabilityDto,
  MentorshipSession,
  RecordSessionDto,
  UpdateMentorshipStatusDto,
  AssignStudentDto,
  User,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de mentores.
 */
export const mentorsService = {
  createMentor: (mentorData: CreateMentorDto) =>
    apiRequest<ApiResponse<Mentor>>('POST', '/api/v1/mentors', mentorData),
  getAllMentors: () =>
    apiRequest<ApiResponse<Mentor[]>>('GET', '/api/v1/mentors'),
  assignStudentToMentor: (mentorId: string, studentId: string) =>
    apiRequest<ApiResponse<void>>('POST', `/api/v1/mentors/${mentorId}/students`, { studentId }),
  getMentorStudents: (mentorId: string) =>
    apiRequest<ApiResponse<User[]>>('GET', `/api/v1/mentors/${mentorId}/students`),
  updateMentorshipStatus: (mentorshipId: string, statusData: UpdateMentorshipStatusDto) =>
    apiRequest<ApiResponse<void>>('PUT', `/api/v1/mentors/mentorships/${mentorshipId}/status`, statusData),
  recordSession: (mentorshipId: string, sessionData: RecordSessionDto) =>
    apiRequest<ApiResponse<MentorshipSession>>('POST', `/api/v1/mentors/mentorships/${mentorshipId}/sessions`, sessionData),
  getMentorById: (mentorId: string) =>
    apiRequest<ApiResponse<Mentor>>('GET', `/api/v1/mentors/${mentorId}`),
  updateMentorAvailability: (mentorId: string, availabilityData: UpdateAvailabilityDto) =>
    apiRequest<ApiResponse<Mentor>>('PUT', `/api/v1/mentors/${mentorId}/availability`, availabilityData),
};
