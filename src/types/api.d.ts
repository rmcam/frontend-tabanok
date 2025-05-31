// src/types/api.d.ts

/**
 * @interface HealthResponse
 * @description Interfaz para la respuesta del endpoint /healthz.
 */
export interface HealthResponse {
  status: string;
  message: string;
}

/**
 * @interface WelcomeResponse
 * @description Interfaz para la respuesta del endpoint /.
 */
export type WelcomeResponse = string;

/**
 * @interface ApiResponse
 * @description Interfaz genérica para las respuestas de la API.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * @interface ApiError
 * @description Interfaz para la estructura de errores de la API.
 */
export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

/**
 * @interface LoginRequest
 * @description Interfaz para la solicitud de inicio de sesión.
 */
export interface LoginRequest {
  identifier: string; // Usuario o correo institucional
  password: string; // Contraseña del usuario
}

/**
 * @interface LoginResponse
 * @description Interfaz para la respuesta de inicio de sesión.
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserProfile;
}

/**
 * @interface RegisterRequest
 * @description Interfaz para la solicitud de registro.
 */
export interface RegisterRequest {
  username: string; // Nombre de usuario institucional
  firstName: string; // Primer Nombre del usuario
  secondName?: string; // Segundo Nombre del usuario (opcional)
  firstLastName: string; // Primer Apellido del usuario
  secondLastName?: string; // Segundo Apellido del usuario (opcional)
  email: string; // Correo electrónico del usuario
  password: string; // Contraseña del usuario
  languages?: string[]; // Idiomas que habla el usuario (opcional)
  preferences?: { // Preferencias del usuario (opcional)
    notifications: boolean;
    language: string;
    theme: string;
  };
  role?: UserRole; // Rol del usuario (opcional)
}

/**
 * @interface UserProfile
 * @description Interfaz para el perfil del usuario.
 */
export interface UserProfile extends User {
  avatarUrl?: string; // URL del avatar (opcional)
  avatarId?: string; // ID del archivo multimedia del avatar (opcional)
  profile?: {
    bio: string;
    location: string;
    interests: string[];
    community?: string;
  };
}

/**
 * @interface PasswordChangeRequest
 * @description Interfaz para la solicitud de cambio de contraseña.
 */
export interface PasswordChangeRequest {
  currentPassword: string; // Contraseña actual
  newPassword: string; // Nueva contraseña
}

/**
 * @interface PasswordResetRequest
 * @description Interfaz para la solicitud de restablecimiento de contraseña (envío de email).
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * @interface ResetPasswordRequest
 * @description Interfaz para la solicitud de restablecimiento de contraseña (con token).
 */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

/**
 * @interface TokenRefreshResponse
 * @description Interfaz para la respuesta de refresco de token.
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * @interface User
 * @description Interfaz para el modelo de usuario.
 */
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: string;
  languages: string[];
  preferences: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  culturalPoints: number;
  level: number;
  points: number;
  gameStats: {
    totalPoints: number;
    level: number;
    streak: number;
    lastActivity: string;
  };
  resetPasswordToken?: string | null;
  resetPasswordExpires?: string | null;
  lastLoginAt?: string | null;
  isEmailVerified: boolean;
  dateOfBirth?: string | null;
  country?: string | null;
  city?: string | null;
  accounts?: any; // Considerar un tipo más específico si se conoce
  userRewards?: any; // Considerar un tipo más específico si se conoce
  userAchievements?: any; // Considerar un tipo más específico si se conoce
  progress?: any; // Considerar un tipo más específico si se conoce
  leaderboards?: any; // Considerar un tipo más específico si se conoce
  statistics?: any; // Considerar un tipo más específico si se conoce
  unities?: any; // Considerar un tipo más específico si se conoce
  createdAt: string;
  activities?: any; // Considerar un tipo más específico si se conoce
  updatedAt: string;
}

/**
 * @interface CreateUserDto
 * @description DTO para crear un nuevo usuario.
 */
export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  roles?: string[];
}

/**
 * @interface UpdateUserDto
 * @description DTO para actualizar un usuario existente.
 */
export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  roles?: string[];
  points?: number;
  level?: number;
}

/**
 * @interface Account
 * @description Interfaz para el modelo de cuenta de usuario.
 */
export interface Account {
  id: string;
  userId: string;
  settings: Record<string, any>; // Ajustar según la estructura real de settings
  preferences: Record<string, any>; // Ajustar según la estructura real de preferences
  streak: number;
  // Añadir otros campos relevantes del modelo Account
}

/**
 * @interface CreateAccountDto
 * @description DTO para crear una nueva cuenta.
 */
export interface CreateAccountDto {
  userId: string;
  settings?: Record<string, any>;
  preferences?: Record<string, any>;
}

/**
 * @interface UpdateAccountDto
 * @description DTO para actualizar una cuenta existente.
 */
export interface UpdateAccountDto {
  settings?: Record<string, any>;
  preferences?: Record<string, any>;
  streak?: number;
}

/**
 * @interface Module
 * @description Interfaz para el modelo de módulo de aprendizaje.
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  order: number;
  isLocked: boolean;
  points: number;
  progress?: number; // Progreso del módulo (0-100)
  // Añadir otros campos relevantes del modelo Module
}

/**
 * @interface ModuleWithUnities
 * @description Interfaz para el modelo de módulo de aprendizaje con unidades anidadas.
 */
export interface ModuleWithUnities extends Module {
  unities: Unity[];
}

/**
 * @interface CreateModuleDto
 * @description DTO para crear un nuevo módulo.
 */
export interface CreateModuleDto {
  name: string;
  description: string;
  order: number;
  points: number;
}

/**
 * @interface UpdateModuleDto
 * @description DTO para actualizar un módulo existente.
 */
export interface UpdateModuleDto {
  name?: string;
  description?: string;
  order?: number;
  isLocked?: boolean;
  points?: number;
}

/**
 * @interface Unity
 * @description Interfaz para el modelo de unidad de aprendizaje.
 */
export interface Unity {
  id: string;
  moduleId: string;
  title: string; // Cambiado de 'name' a 'title'
  description: string;
  order: number;
  isLocked: boolean;
  requiredPoints: number; // Cambiado de 'points' a 'requiredPoints'
  progress?: number; // Progreso de la unidad (0-100)
  isCompleted?: boolean; // Si la unidad está completada
  lessons?: Lesson[]; // Lecciones dentro de esta unidad
  icon?: string; // Icono para la unidad (ej. emoji o URL)
  topics?: Topic[]; // Añadido para incluir tópicos anidados
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Unity
}

/**
 * @interface DetailedUnity
 * @description Interfaz para el modelo de unidad de aprendizaje con tópicos y lecciones anidados, incluyendo ejercicios.
 */
export interface DetailedUnity extends Unity {
  topics: Topic[];
  lessons: Lesson[];
}

/**
 * @interface CreateUnityDto
 * @description DTO para crear una nueva unidad.
 */
export interface CreateUnityDto {
  moduleId: string;
  name: string;
  description: string;
  order: number;
  points: number;
}

/**
 * @interface UpdateUnityDto
 * @description DTO para actualizar una unidad existente.
 */
export interface UpdateUnityDto {
  name?: string;
  description?: string;
  order?: number;
  isLocked?: boolean;
  points?: number;
}

/**
 * @interface Lesson
 * @description Interfaz para el modelo de lección.
 */
export interface Lesson {
  id: string;
  unityId: string;
  title: string; // Cambiado de 'name' a 'title'
  description: string;
  order: number;
  isLocked: boolean;
  requiredPoints: number; // Cambiado de 'points' a 'requiredPoints'
  isCompleted: boolean;
  content: string; // Añadido para el contenido de la lección
  exercises?: Exercise[]; // Cambiado de 'activities' a 'exercises'
  multimedia?: Multimedia[]; // Añadido para incluir multimedia asociada
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Lesson
}

/**
 * @interface CreateLessonDto
 * @description DTO para crear una nueva lección.
 */
export interface CreateLessonDto {
  unityId: string;
  name: string;
  description: string;
  content: string;
  order: number;
  points: number;
}

/**
 * @interface UpdateLessonDto
 * @description DTO para actualizar una lección existente.
 */
export interface UpdateLessonDto {
  name?: string;
  description?: string;
  content?: string;
  order?: number;
  isLocked?: boolean;
  points?: number;
  isCompleted?: boolean;
}

/**
 * @interface Topic
 * @description Interfaz para el modelo de tema.
 */
export interface Topic {
  id: string;
  unityId: string; // Añadido para relacionar con la unidad
  title: string; // Cambiado de 'name' a 'title' según la descripción de la tarea
  description?: string; // Hecho opcional según la descripción de la tarea
  order: number; // Añadido según la descripción de la tarea
  isLocked: boolean; // Añadido según la descripción de la tarea
  requiredPoints: number; // Añadido según la descripción de la tarea
  isActive: boolean; // Añadido según la descripción de la tarea
  contents?: Content[]; // Añadido para incluir contenido anidado (plural)
  exercises?: Exercise[]; // Añadido para incluir ejercicios anidados
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Topic
}

/**
 * @interface CreateTopicDto
 * @description DTO para crear un nuevo tema.
 */
export interface CreateTopicDto {
  name: string;
  description: string;
}

/**
 * @interface UpdateTopicDto
 * @description DTO para actualizar un tema existente.
 */
export interface UpdateTopicDto {
  name?: string;
  description?: string;
}

/**
 * @interface Activity
 * @description Interfaz para el modelo de actividad.
 */
export interface Activity {
  id: string;
  name: string;
  description: string;
  type: string; // Ej. 'quiz', 'lesson', 'exercise'
  points: number;
  isCompleted: boolean;
  // Añadir otros campos relevantes del modelo Activity
}

/**
 * @interface CreateActivityDto
 * @description DTO para crear una nueva actividad.
 */
export interface CreateActivityDto {
  name: string;
  description: string;
  type: string;
  points: number;
}

/**
 * @interface UpdateActivityDto
 * @description DTO para actualizar una actividad existente.
 */
export interface UpdateActivityDto {
  name?: string;
  description?: string;
  type?: string;
  points?: number;
  isCompleted?: boolean;
}

/**
 * @interface Exercise
 * @description Interfaz para el modelo de ejercicio.
 */
export interface Exercise {
  id: string;
  title: string; // Añadido 'title'
  description: string; // Añadido 'description'
  type: string; // Ej. 'quiz', 'mission' (según el feedback)
  content: any; // Tipo flexible para el contenido del ejercicio
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  timeLimit?: number; // Añadido según el feedback
  isActive: boolean;
  topicId?: string; // Añadido según el feedback
  topic?: Topic; // Añadido según el feedback
  tags?: string[]; // Añadido según el feedback
  timesCompleted?: number; // Añadido según el feedback
  averageScore?: number; // Añadido según el feedback
  createdAt: string;
  updatedAt: string;
  lesson?: string; // Añadido según el feedback
  progress?: number; // Cambiado a number para consistencia con LearningExercise
  isCompleted?: boolean;
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Exercise
}

/**
 * @interface CreateExerciseDto
 * @description DTO para crear un nuevo ejercicio.
 */
export interface CreateExerciseDto {
  lessonId?: string; // Cambiado de activityId a lessonId, y hecho opcional
  title: string;
  description: string;
  type: string;
  content: any;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  timeLimit?: number;
  isActive?: boolean;
  topicId?: string;
  tags?: string[];
}

/**
 * @interface UpdateExerciseDto
 * @description DTO para actualizar un ejercicio existente.
 */
export interface UpdateExerciseDto {
  title?: string;
  description?: string;
  type?: string;
  content?: any;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
  topicId?: string;
  tags?: string[];
  isCompleted?: boolean;
  isLocked?: boolean;
}

/**
 * @interface Multimedia
 * @description Interfaz para el modelo de archivo multimedia.
 */
export interface Multimedia {
  id: string; // Cambiado a string para consistencia con otros IDs (UUIDs)
  fileName: string;
  filePath: string;
  fileType: string;
  mimeType: string;
  size: number;
  userId?: string;
  uploadDate?: string;
  lesson?: string;
  // Añadir otros campos relevantes del modelo Multimedia
}


/**
 * @interface Vocabulary
 * @description Interfaz para el modelo de vocabulario.
 */
export interface Vocabulary {
  id: string;
  topicId: string;
  wordKamentsa: string;
  wordSpanish: string;
  audioUrl?: string;
  imageUrl?: string;
  // Añadir otros campos relevantes del modelo Vocabulary
}

/**
 * @interface CreateVocabularyDto
 * @description DTO para crear un nuevo vocabulario.
 */
export interface CreateVocabularyDto {
  topicId: string;
  wordKamentsa: string;
  wordSpanish: string;
  audioUrl?: string;
  imageUrl?: string;
}

/**
 * @interface UpdateVocabularyDto
 * @description DTO para actualizar un vocabulario existente.
 */
export interface UpdateVocabularyDto {
  wordKamentsa?: string;
  wordSpanish?: string;
  audioUrl?: string;
  imageUrl?: string;
}

/**
 * @interface CulturalContent
 * @description Interfaz para el modelo de contenido cultural.
 */
export interface CulturalContent {
  id: string;
  category: string;
  title: string;
  description: string;
  contentUrl: string; // URL al contenido (video, artículo, etc.)
  // Añadir otros campos relevantes del modelo CulturalContent
}

/**
 * @interface CreateCulturalContentDto
 * @description DTO para crear nuevo contenido cultural.
 */
export interface CreateCulturalContentDto {
  category: string;
  title: string;
  description: string;
  contentUrl: string;
}

/**
 * @interface UpdateCulturalContentDto
 * @description DTO para actualizar contenido cultural existente.
 */
export interface UpdateCulturalContentDto {
  category?: string;
  title?: string;
  description?: string;
  contentUrl?: string;
}

/**
 * @interface ProgressDto
 * @description DTO para el progreso de un ejercicio por usuario.
 */
export interface ProgressDto {
  id: string;
  userId: string;
  exerciseId: string;
  score: number | null;
  answers: Record<string, any> | null;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  // Añadir otros campos relevantes del modelo Progress
}

/**
 * @interface CreateProgressDto
 * @description DTO para crear un nuevo progreso de ejercicio.
 */
export interface CreateProgressDto {
  userId: string;
  exerciseId: string;
  score?: number;
  answers?: Record<string, any>;
  isCompleted?: boolean;
}

/**
 * @interface UpdateProgressCompletedDto
 * @description DTO para actualizar el progreso de un ejercicio como completado.
 */
export interface UpdateProgressCompletedDto {
  answers: Record<string, any>;
}

/**
 * @interface UpdateProgressScoreDto
 * @description DTO para actualizar el puntaje de un progreso de ejercicio.
 */
export interface UpdateProgressScoreDto {
  score: number;
}

/**
 * @interface Statistics
 * @description Interfaz para el modelo de estadísticas de usuario.
 */
export interface Statistics {
  id: string;
  userId: string;
  totalPoints: number;
  lessonsCompleted: number;
  activitiesCompleted: number;
  // Añadir otros campos relevantes del modelo Statistics
}

/**
 * @interface CreateStatisticsDto
 * @description DTO para crear estadísticas de usuario.
 */
export interface CreateStatisticsDto {
  userId: string;
  totalPoints?: number;
  lessonsCompleted?: number;
  activitiesCompleted?: number;
}

/**
 * @interface UpdateLearningProgressDto
 * @description DTO para actualizar el progreso de aprendizaje.
 */
export interface UpdateLearningProgressDto {
  lessonsCompleted?: number;
  activitiesCompleted?: number;
  // Otros campos de progreso
}

/**
 * @interface Reward
 * @description Interfaz para el modelo de recompensa.
 */
export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
  // Añadir otros campos relevantes del modelo Reward
}

/**
 * @interface CreateRewardDto
 * @description DTO para crear una nueva recompensa.
 */
export interface CreateRewardDto {
  name: string;
  description: string;
  pointsCost: number;
  imageUrl?: string;
}

/**
 * @interface Achievement
 * @description Interfaz para el modelo de logro cultural.
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  criteria: string; // Criterios para obtener el logro
  imageUrl?: string;
  // Añadir otros campos relevantes del modelo Achievement
}

/**
 * @interface CreateAchievementDto
 * @description DTO para crear un nuevo logro cultural.
 */
export interface CreateAchievementDto {
  name: string;
  description: string;
  criteria: string;
  imageUrl?: string;
}

/**
 * @interface MissionTemplate
 * @description Interfaz para el modelo de plantilla de misión.
 */
export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  objectives: string[]; // O un tipo más específico para objetivos
  rewardPoints: number;
  // Añadir otros campos relevantes del modelo MissionTemplate
}

/**
 * @interface UserAchievementDto
 * @description DTO para un logro obtenido por un usuario.
 */
export interface UserAchievementDto {
  id: string;
  userId: string;
  achievementId: string;
  achievement: Achievement; // Información del logro
  earnedAt: string; // Fecha en que se obtuvo el logro
  // Añadir otros campos relevantes
}

/**
 * @interface UserMissionDto
 * @description DTO para una misión asignada a un usuario.
 */
export interface UserMissionDto {
  id: string;
  userId: string;
  missionTemplateId: string;
  missionTemplate: MissionTemplate; // Información de la plantilla de misión
  status: 'active' | 'completed' | 'failed'; // Estado de la misión para el usuario
  progress?: number; // Progreso de la misión (si aplica)
  assignedAt: string; // Fecha en que se asignó la misión
  completedAt?: string; // Fecha en que se completó la misión (si aplica)
  // Añadir otros campos relevantes
}

/**
 * @interface CreateMissionTemplateDto
 * @description DTO para crear una nueva plantilla de misión.
 */
export interface CreateMissionTemplateDto {
  name: string;
  description: string;
  objectives: string[];
  rewardPoints: number;
}

/**
 * @interface UpdateMissionTemplateDto
 * @description DTO para actualizar una plantilla de misión existente.
 */
export interface UpdateMissionTemplateDto {
  name?: string;
  description?: string;
  objectives?: string[];
  rewardPoints?: number;
}

/**
 * @interface NotificationResponseDto
 * @description DTO para la respuesta de notificación.
 */
export interface NotificationResponseDto {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  // Añadir otros campos relevantes
}

/**
 * @interface LeaderboardEntryDto
 * @description DTO para una entrada en la tabla de clasificación.
 */
export interface LeaderboardEntryDto {
  userId: string;
  username: string;
  totalPoints: number;
  rank: number;
  // Añadir otros campos relevantes
}

/**
 * @interface CategoryMetricsResponseDto
 * @description DTO para las métricas de una categoría específica.
 */
export interface CategoryMetricsResponseDto {
  category: string;
  progress: number; // Porcentaje de progreso
  completedItems: number;
  totalItems: number;
  // Añadir otros campos relevantes
}

/**
 * @interface AvailableCategoryDto
 * @description DTO para una categoría disponible para el usuario.
 */
export interface AvailableCategoryDto {
  id: string;
  name: string;
  description: string;
  // Añadir otros campos relevantes
}

/**
 * @interface NextMilestoneDto
 * @description DTO para el próximo hito del usuario.
 */
export interface NextMilestoneDto {
  name: string;
  description: string;
  pointsRequired: number;
  currentPoints: number;
  // Añadir otros campos relevantes
}

/**
 * @interface LearningPathDto
 * @description DTO para la ruta de aprendizaje del usuario.
 */
export interface LearningPathDto {
  modules: Module[];
  // Añadir otros campos relevantes
}

/**
 * @interface ValidateTextDto
 * @description DTO para validar texto en Kamëntsá.
 */
export interface ValidateTextDto {
  text: string;
}

/**
 * @interface ValidationResultDto
 * @description DTO para el resultado de la validación de texto.
 */
export interface ValidationResultDto {
  isValid: boolean;
  errors?: string[];
  suggestions?: string[];
}

/**
 * @interface DictionaryEntryDto
 * @description DTO para una entrada del diccionario Kamëntsá.
 */
export interface DictionaryEntryDto {
  id: string;
  wordKamentsa: string;
  wordSpanish: string;
  pronunciation?: string;
  examples?: string[];
  // Añadir otros campos relevantes
}

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
  status: 'pending' | 'active' | 'completed' | 'cancelled';
}

/**
 * @interface AssignStudentDto
 * @description DTO para asignar un estudiante a un mentor.
 */
export interface AssignStudentDto {
  studentId: string;
}

/**
 * @interface UserBadge
 * @description Interfaz para una insignia de usuario.
 */
export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  awardedAt: string;
  // Añadir otros campos relevantes
}

/**
 * @interface UpdatePointsDto
 * @description DTO para actualizar puntos.
 */
export interface UpdatePointsDto {
  points: number;
}

/**
 * @interface UpdateLevelDto
 * @description DTO para actualizar el nivel.
 */
export interface UpdateLevelDto {
  level: number;
}

/**
 * @interface UpdateStreakDto
 * @description DTO para actualizar la racha.
 */
export interface UpdateStreakDto {
  streak: number;
}

/**
 * @interface UpdateProfileDto
 * @description DTO para actualizar el perfil de usuario.
 */
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string; // URL del avatar (opcional, si el backend lo usa)
  avatarId?: string; // ID del archivo multimedia del avatar (opcional, según la nueva especificación)
  languages?: string[];
  preferences?: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  profile?: {
    bio: string;
    location: string;
    interests: string[];
    community?: string;
  };
  country?: string;
  city?: string;
}

/**
 * @interface UpdateAchievementStatsDto
 * @description DTO para actualizar estadísticas de logros.
 */
export interface UpdateAchievementStatsDto {
  achievementsCompleted?: number;
  // Otros campos de estadísticas de logros
}

/**
 * @interface UpdateBadgeStatsDto
 * @description DTO para actualizar estadísticas de insignias.
 */
export interface UpdateBadgeStatsDto {
  badgesEarned?: number;
  // Otros campos de estadísticas de insignias
}

/**
 * @interface GenerateReportDto
 * @description DTO para generar un reporte de estadísticas.
 */
export interface GenerateReportDto {
  startDate: string;
  endDate: string;
  // Otros parámetros para el reporte
}

/**
 * @interface UpdateCategoryProgressDto
 * @description DTO para actualizar el progreso de una categoría.
 */
export interface UpdateCategoryProgressDto {
  progress: number;
  completedItems?: number;
}

/**
 * @interface Content
 * @description Interfaz para el modelo de contenido de aprendizaje.
 */
export interface Content {
  id: string | number; // string o number según la descripción de la tarea
  title: string;
  description?: string; // Hecho opcional según la descripción de la tarea
  type: string; // Ej: 'text', 'video', 'quiz', etc.
  content?: any; // El contenido real (JSONB). Estructura varía según 'type'.
  unityId: string; // Añadido según la descripción de la tarea
  topicId?: string; // Hecho opcional para permitir contenido no directamente asociado a un tópico
  order?: number; // Hecho opcional según la descripción de la tarea
  categories?: string[]; // Hecho opcional según la descripción de la tarea
  tags?: string[]; // Hecho opcional según la descripción de la tarea
  multimedia: Multimedia[]; // Añadido según la descripción de la tarea
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Content
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MENTOR = 'mentor',
  TEACHER = 'teacher',
  STUDENT = 'student', // Añadido para compatibilidad con RegisterForm
}

/**
 * @interface CreateContentDto
 * @description DTO para crear un nuevo contenido de aprendizaje.
 */
export interface CreateContentDto {
  title: string;
  description?: string;
  type: string;
  content?: any;
  unityId: string;
  topicId?: string;
  order?: number;
  categories?: string[];
  tags?: string[];
  multimedia?: Multimedia[]; // Opcional al crear, ya que se podría añadir después
}

/**
 * @interface UpdateContentDto
 * @description DTO para actualizar un contenido de aprendizaje existente.
 */
export interface UpdateContentDto {
  title?: string;
  description?: string;
  type?: string;
  content?: any;
  unityId?: string;
  topicId?: string;
  order?: number;
  categories?: string[];
  tags?: string[];
  multimedia?: Multimedia[];
  isLocked?: boolean;
}

// Added a comment to try and force a type refresh
