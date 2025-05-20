import { GamificationSummary } from '../types/gamificationTypes'; // Importar tipo GamificationSummary con ruta relativa

const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

// Función para obtener un resumen de datos de gamificación para el usuario autenticado
export const getGamificationSummary = async (): Promise<GamificationSummary> => {
  try {
    const response = await fetch(`${API_URL}/gamification/summary`, { // Asumiendo endpoint GET /gamification/summary
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al obtener el resumen de gamificación. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al obtener el resumen de gamificación';
      throw new Error(errorMessage);
    }

    const summary: GamificationSummary = await response.json();
    return summary;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener el resumen de gamificación';
    console.error('Error fetching gamification summary:', error);
    throw new Error(errorMessage);
  }
};

// Definir interfaz para una entrada del Leaderboard (asumiendo estructura básica)
export interface LeaderboardEntry { // Exportar la interfaz
  userId: string;
  username: string; // O nombre completo del usuario
  totalPoints: number;
  level: number;
  // Agrega otras propiedades relevantes para el leaderboard (ej. posición, racha)
}

// Función para obtener los datos del leaderboard
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${API_URL}/gamification/leaderboard`, { // Asumiendo endpoint GET /gamification/leaderboard
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al obtener los datos del leaderboard. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al obtener los datos del leaderboard';
      throw new Error(errorMessage);
    }

    const leaderboardData: LeaderboardEntry[] = await response.json();
    return leaderboardData;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener los datos del leaderboard';
    console.error('Error fetching leaderboard:', error);
    throw new Error(errorMessage);
  }
};

// Definir interfaz para un Logro (asumiendo estructura básica)
export interface Achievement { // Exportar la interfaz
  id: string;
  name: string;
  description: string;
  unlocked: boolean; // Indica si el usuario autenticado ha desbloqueado este logro
  // Agrega otras propiedades relevantes para un logro (ej. icono, criterios)
}

// Función para obtener la lista de logros del usuario autenticado
export const getAchievements = async (): Promise<Achievement[]> => {
  try {
    const response = await fetch(`${API_URL}/cultural-achievements`, { // Endpoint GET /cultural-achievements de Swagger
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación si es necesario
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al obtener la lista de logros. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al obtener la lista de logros';
      throw new Error(errorMessage);
    }

    const achievementsData: Achievement[] = await response.json();
    return achievementsData;

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al obtener la lista de logros';
    console.error('Error fetching achievements:', error);
    throw new Error(errorMessage);
  }
};


// Puedes agregar más funciones relacionadas con gamificación aquí (ej. getUserMissions)
