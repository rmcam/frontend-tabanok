// src/types/gamification/gamification.d.ts

/**
 * @interface GamificationUserStatsDto
 * @description DTO para las estadísticas de gamificación de un usuario.
 */
export interface GamificationUserStatsDto {
  userId?: string; // Opcional, ya que puede venir del perfil del usuario
  username?: string; // Opcional
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
  lastActivity: string;
  hearts: number; // Añadido para la lógica de vidas
  league: string; // Añadido para la lógica de ligas
  achievements: UserAchievementDto[]; // Usar el tipo correcto
  missions: UserMissionDto[]; // Usar el tipo correcto
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
  avatarUrl?: string; // Opcional, para mostrar en el leaderboard
}

export interface LeaderboardRanking {
  userId: string;
  username: string;
  avatarUrl?: string;
  totalPoints: number;
}

export interface Leaderboard {
  id: string;
  week: number;
  year: number;
  rankings: LeaderboardRanking[];
  createdAt: Date;
  updatedAt: Date;
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
  status: "active" | "completed" | "failed"; // Estado de la misión para el usuario
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
 * @interface UpdateAchievementStatsDto
 * @description DTO para actualizar estadísticas de logros.
 */
export interface UpdateAchievementStatsDto {
  achievementsCompleted?: number;
  // Otros campos de estadísticas de logros
}

/**
 * @interface UpdateProgressDto
 * @description DTO para actualizar el progreso de un logro cultural.
 */
export interface UpdateProgressDto {
  progress: number; // Porcentaje de progreso o estado específico
  isCompleted?: boolean;
}

/**
 * @interface GrantPointsDto
 * @description DTO para otorgar puntos a un usuario.
 */
export interface GrantPointsDto {
  points: number;
}

/**
 * @interface AssignMissionDto
 * @description DTO para asignar una misión a un usuario.
 */
export interface AssignMissionDto {
  missionId: string;
}

/**
 * @interface AwardRewardDto
 * @description DTO para otorgar una recompensa a un usuario.
 */
export interface AwardRewardDto {
  userId: string;
}

/**
 * @interface ConsumeRewardDto
 * @description DTO para consumir una recompensa de un usuario.
 */
export interface ConsumeRewardDto {
  userId: string;
  rewardId: string;
}

/**
 * @interface RewardStatusDto
 * @description DTO para el estado de una recompensa de un usuario.
 */
export interface RewardStatusDto {
  status: 'awarded' | 'consumed' | 'pending';
  awardedAt: string;
  consumedAt?: string;
}
