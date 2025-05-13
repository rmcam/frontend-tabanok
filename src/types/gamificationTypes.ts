// src/types/gamificationTypes.ts

export interface GamificationSummary {
  totalPoints: number;
  level: number;
  streak: number;
  achievementsUnlocked: number;
  missionsCompleted: number;
  // Agrega otras propiedades relevantes para un resumen de gamificación
}

export interface Achievement {
  id: number | string; // Ajusta el tipo según la API
  name: string;
  description: string;
  unlocked: boolean;
  // Agrega otras propiedades si es necesario
}

export interface LeaderboardEntry {
  userId: number | string; // Ajusta el tipo según la API
  username: string;
  totalPoints: number;
  level: number;
  // Agrega otras propiedades si es necesario
}

// Puedes agregar otros tipos relacionados con gamificación aquí (ej. Mission)
