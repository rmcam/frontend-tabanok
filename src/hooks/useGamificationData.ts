import useFetchData from './useFetchData'; // Importación por defecto
import { GamificationSummary, Achievement, LeaderboardEntry } from '../types/gamificationTypes';

export const useGamificationData = () => {
  // Usar useFetchData para cada endpoint
  const { data: summary, loading: loadingSummary, error: errorSummary } = useFetchData<GamificationSummary>('/gamification/summary');
  const { data: achievements, loading: loadingAchievements, error: errorAchievements } = useFetchData<Achievement[]>('/gamification/achievements');
  const { data: leaderboard, loading: loadingLeaderboard, error: errorLeaderboard } = useFetchData<LeaderboardEntry[]>('/gamification/leaderboard');

  // Determinar el estado de carga general y error
  const loading = loadingSummary || loadingAchievements || loadingLeaderboard;
  const error = errorSummary || errorAchievements || errorLeaderboard;

  return {
    summary,
    achievements,
    leaderboard,
    loading,
    error, // También es útil retornar el error
  };
};