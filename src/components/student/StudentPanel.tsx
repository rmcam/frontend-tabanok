import React, { useEffect, useState } from 'react';
import { useAuth } from '@/auth/hooks/useAuth'; // Assuming useAuth is in this path
import api from '@/lib/api';
import MultimediaPlayer from "../common/MultimediaPlayer"; // Import MultimediaPlayer
import { Link } from 'react-router-dom'; // Import Link
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import Card components
import { Badge } from "@/components/ui/badge"; // Import Badge component

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

interface RecommendedActivity {
  id: string;
  title: string;
  // Add other relevant recommendation fields (e.g., type, link)
}

interface CulturalNarrative {
  id: string;
  title: string;
  description: string;
  multimediaUrl?: string; // Assuming a URL for associated multimedia
  multimediaType?: "video" | "audio" | "image"; // Assuming type for associated multimedia
  // Add other relevant fields for narratives
}

const StudentPanel: React.FC = () => {
  const { user } = useAuth(); // Get authenticated user
  const [progressData, setProgressData] = useState<StudentProgressData | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [recommendedActivities, setRecommendedActivities] = useState<RecommendedActivity[]>([]);
  const [culturalNarratives, setCulturalNarratives] = useState<CulturalNarrative[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        setError("Usuario no autenticado.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        // Assuming backend endpoints for student data
        const [progress, achievementsData, recommendationsData, narrativesData] = await Promise.all([
          api.get(`/students/${user.id}/progress`),
          api.get(`/students/${user.id}/achievements`), // Assuming endpoint for achievements
          api.get(`/recommendations/for-student/${user.id}`), // Assuming endpoint for recommendations
          api.get(`/cultural-narratives`), // Assuming endpoint for cultural narratives
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
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]); // Refetch when user changes

  const refreshStudentData = async () => {
    if (!user) {
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
        "Error al refrescar los datos del estudiante: " +
          (err instanceof Error ? err.message : String(err))
      );
      console.error("Error refreshing student data:", err);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <div>Cargando datos del estudiante...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Panel del Estudiante</h2>

      {progressData && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Progreso General</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Lecciones completadas: {progressData.completedLessons} / {progressData.totalLessons}</p>
            <p>Puntuación general: {progressData.overallScore}</p>
            {/* Render other progress data */}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Logros</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <p>No hay logros disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <Card key={achievement.id}>
                  <CardHeader>
                    <CardTitle>{achievement.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{achievement.description}</p>
                    {/* Render other achievement details */}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Actividades Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedActivities.length === 0 ? (
            <p>No hay actividades recomendadas en este momento.</p>
          ) : (
            <ul className="space-y-2">
              {recommendedActivities.map(activity => (
                <li key={activity.id} className="border p-3 rounded-md flex justify-between items-center">
                  <h4>{activity.title}</h4>
                  <div>
                    {/* Render other recommendation details */}
                    {/* Example link to a quiz activity */}
                    <Link to={`/activities/quiz/${activity.id}`} className="mr-2">
                      <Badge>Iniciar Quiz</Badge>
                    </Link>
                    {/* Example link to a matching activity */}
                    <Link to={`/activities/matching/${activity.id}`}>
                       <Badge>Iniciar Emparejamiento</Badge>
                    </Link>
                    {/* Example link to a fill-in-the-blanks activity */}
                    <Link to={`/activities/fill-in-the-blanks/${activity.id}`}>
                       <Badge>Iniciar Completar Espacios</Badge>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Narrativas Culturales</CardTitle>
        </CardHeader>
        <CardContent>
          {culturalNarratives.length === 0 ? (
            <p>No hay narrativas culturales disponibles en este momento.</p>
          ) : (
            <ul className="space-y-4">
              {culturalNarratives.map(narrative => (
                <li key={narrative.id} className="border p-4 rounded-md">
                  <h4>{narrative.title}</h4>
                  <p>{narrative.description}</p>
                  {/* Render associated multimedia if available */}
                  {narrative.multimediaUrl && narrative.multimediaType && (
                    <div className="mt-4">
                      <MultimediaPlayer type={narrative.multimediaType} url={narrative.multimediaUrl} title={narrative.title} width={300} /> {/* Added width prop */}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPanel;
