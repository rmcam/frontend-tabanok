// src/types/account/account.d.ts

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
