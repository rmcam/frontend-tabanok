// src/types/badges/badges.d.ts

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
 * @interface UpdateBadgeStatsDto
 * @description DTO para actualizar estadísticas de insignias.
 */
export interface UpdateBadgeStatsDto {
  badgesEarned?: number;
  // Otros campos de estadísticas de insignias
}
