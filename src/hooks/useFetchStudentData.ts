import { useEffect, useState, useCallback } from 'react';
import api from '@/lib/api';
import { User } from '@/auth/types/authTypes'; // Assuming User type is here

interface StudentProgressData {
  completedLessons: number;
  totalLessons: number;
  overallScore: number;
  // Add other relevant progress fields
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  // Add other relevant achievement fields (e.g., icon, criteria)
}

interface RecommendedActivity {
  id: string;
  title: string;
  // Add other relevant recommendation fields (e.g., type, link)
}

interface CulturalNarrative {
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

const useFetchStudentData = (user: User | null): UseFetchStudentDataResult => {
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
      const [progress, achievementsData, recommendationsData, narrativesData] = await Promise.all([
        api.get(`/students/${user.id}/progress`),
        api.get(`/students/${user.id}/achievements`),
        api.get(`/recommendations/for-student/${user.id}`),
        api.get(`/cultural-narratives`),
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
  }, [user]); // Refetch when user changes

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
