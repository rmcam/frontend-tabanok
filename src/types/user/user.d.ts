// src/types/user/user.d.ts

import { GamificationUserStatsDto } from "../gamification/gamification.d";
import { UserRole } from "../auth/auth.d";

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
  gameStats: GamificationUserStatsDto;
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
