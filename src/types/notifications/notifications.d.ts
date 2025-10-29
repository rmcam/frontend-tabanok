// src/types/notifications/notifications.d.ts

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
