import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/auth/types/authTypes'; // Assuming User type is here

interface StudentProgressData {
  completedLessons: number;
  totalLessons: number;
  overallScore: number;
  name: string; // Add student name
  // Add other relevant progress fields
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  // Add other relevant achievement fields (e.g., icon, criteria)
}

export interface RecommendedActivity {
  id: string;
  title: string;
  // Add other relevant recommendation fields (e.g., type, link)
}

export interface CulturalNarrative {
  id: string;
  title: string;
  description: string;
  multimediaUrl?: string;
  multimediaType?: "video" | "audio" | "image";
  // Add other relevant fields for narratives
}

interface UseFetchStudentDataResult {
  progressData: StudentProgressData | null;
  achievements: Achievement[];
  recommendedActivities: RecommendedActivity[];
  culturalNarratives: CulturalNarrative[];
  loading: boolean;
  error: string | null;
  refreshStudentData: () => Promise<void>;
}

const useFetchStudentData = (user: User | null, studentId?: string): UseFetchStudentDataResult => {
  const [progressData, setProgressData] = useState<StudentProgressData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<RecommendedActivity[]>([]);
  const [culturalNarratives, setCulturalNarratives] = useState<CulturalNarrative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setError("Usuario no autenticado.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // TODO: Verificar la estructura exacta de la respuesta de /content, /topics y /tags
      const [progress, achievementsData, recommendationsData, narrativesData] = await Promise.all([
        api.get(`/statistics/user/${studentId || user.id}`), // Corregido según Swagger
        api.get(`/cultural-achievements`), // Corregido según Swagger
        api.get(`/recommendations/users/${studentId || user.id}`), // Corregido según Swagger
        api.get(`/cultural-content`), // Corregido según Swagger
      ]);
      setProgressData(progress);
      setAchievements(achievementsData);
      setRecommendedActivities(recommendationsData);
      setCulturalNarratives(narrativesData);
    } catch (err: unknown) {
      setError(
        "Error al obtener los datos del estudiante: " +
          (err instanceof Error ? err.message : String(err))
      );
      console.error("Error fetching student data:", err);
    } finally {
      setLoading(false);
    }
  }, [user, studentId]); // Refetch when user or studentId changes

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Fetch data when the fetchData function changes (due to user dependency)

  const refreshStudentData = useCallback(async () => {
    await fetchData(); // Simply call fetchData to refresh
  }, [fetchData]);

  return {
    progressData,
    achievements,
    recommendedActivities,
    culturalNarratives,
    loading,
    error,
    refreshStudentData,
  };
};

export default useFetchStudentData;
