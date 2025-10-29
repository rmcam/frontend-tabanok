// src/types/milestones/milestones.d.ts

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
