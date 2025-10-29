// src/types/mentorship/mentorship.d.ts

/**
 * @interface Mentor
 * @description Interfaz para el modelo de mentor.
 */
export interface Mentor {
  id: string;
  userId: string;
  specializations: string[];
  availability: Record<string, any>; // Ajustar según la estructura real de disponibilidad
  // Añadir otros campos relevantes
}

/**
 * @interface CreateMentorDto
 * @description DTO para crear un nuevo mentor.
 */
export interface CreateMentorDto {
  userId: string;
  specializations: string[];
  availability?: Record<string, any>;
}

/**
 * @interface UpdateAvailabilityDto
 * @description DTO para actualizar la disponibilidad de un mentor.
 */
export interface UpdateAvailabilityDto {
  availability: Record<string, any>;
}

/**
 * @interface MentorshipSession
 * @description Interfaz para una sesión de mentoría.
 */
export interface MentorshipSession {
  id: string;
  mentorshipId: string;
  date: string;
  durationMinutes: number;
  notes?: string;
  // Añadir otros campos relevantes
}

/**
 * @interface RecordSessionDto
 * @description DTO para registrar una sesión de mentoría.
 */
export interface RecordSessionDto {
  date: string;
  durationMinutes: number;
  notes?: string;
}

/**
 * @interface UpdateMentorshipStatusDto
 * @description DTO para actualizar el estado de una mentoría.
 */
export interface UpdateMentorshipStatusDto {
  status: "pending" | "active" | "completed" | "cancelled";
}

/**
 * @interface AssignStudentDto
 * @description DTO para asignar un estudiante a un mentor.
 */
export interface AssignStudentDto {
  studentId: string;
}
