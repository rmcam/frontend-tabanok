// src/types/auth/auth.d.ts

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
  preferences?: {
    // Preferencias del usuario (opcional)
    notifications: boolean;
    language: string;
    theme: string;
  };
  role?: UserRole; // Rol del usuario (opcional)
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

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
  MENTOR = "mentor",
  TEACHER = "teacher",
  STUDENT = "student", // Añadido para compatibilidad con RegisterForm
}
