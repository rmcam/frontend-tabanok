import React from 'react';
import { useAuth } from '@/auth/hooks/useAuth'; // Assuming useAuth is in this path
import MultimediaPlayer from "../common/MultimediaPlayer"; // Import MultimediaPlayer
import { Link } from 'react-router-dom'; // Import Link
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Import Card components
import { Badge } from "@/components/ui/badge"; // Import Badge component
import useFetchStudentData from '@/hooks/useFetchStudentData'; // Import the new hook
import { Activity, Award, ListTodo, BookOpen } from 'lucide-react'; // Importar iconos
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Progress } from "@/components/ui/progress"; // Import Progress component

const StudentPanel: React.FC = () => {
  const { user } = useAuth(); // Get authenticated user
  const {
    progressData,
    achievements,
    recommendedActivities,
    culturalNarratives,
    loading,
    error,
  } = useFetchStudentData(user); // Use the new hook

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Panel del Estudiante</h2>
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Panel del Estudiante</h2>
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Panel del Estudiante</h2>

      {progressData && (
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center space-x-2"> {/* Usar flex para alinear icono y título */}
            <Activity className="size-6" /> {/* Icono para Progreso General */}
            <CardTitle>Progreso General</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Lecciones completadas: {progressData.completedLessons} / {progressData.totalLessons}</p>
            <p>Puntuación general: {progressData.overallScore}</p>
            <Progress value={progressData.overallScore} aria-label="Progreso general del estudiante" />
            {/* Render other progress data */}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-2"> {/* Usar flex para alinear icono y título */}
          <Award className="size-6" /> {/* Icono para Logros */}
          <CardTitle>Logros</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements.length === 0 ? (
            <p>No hay logros disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <Card key={achievement.id} className="shadow-sm" aria-label={`Logro: ${achievement.name}`}>
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
        <CardHeader className="flex flex-row items-center space-x-2"> {/* Usar flex para alinear icono y título */}
          <ListTodo className="size-6" /> {/* Icono para Actividades Recomendadas */}
          <CardTitle>Actividades Recomendadas</CardTitle>
        </CardHeader>
        <CardContent>
          {recommendedActivities.length === 0 ? (
            <p>No hay actividades recomendadas en este momento.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedActivities.map(activity => (
                <Card key={activity.id} className="shadow-sm" aria-label={`Actividad recomendada: ${activity.title}`}>
                  <CardHeader>
                    <CardTitle>{activity.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* TODO: Verificar la interfaz RecommendedActivity y la respuesta del backend para mostrar la descripción */}
                    {/* <p>{activity.description}</p> */}
                    <div className="flex justify-around">
                      {/* Example link to a quiz activity */}
                      <Link to={`/activities/quiz/${activity.id}`} className="mr-2" aria-label={`Iniciar Quiz: ${activity.title}`}>
                        <Badge>Quiz</Badge>
                      </Link>
                      {/* Example link to a matching activity */}
                      <Link to={`/activities/matching/${activity.id}`} aria-label={`Iniciar Emparejamiento: ${activity.title}`}>
                        <Badge>Emparejamiento</Badge>
                      </Link>
                      {/* Example link to a fill-in-the-blanks activity */}
                      <Link to={`/activities/fill-in-the-blanks/${activity.id}`} aria-label={`Iniciar Completar Espacios: ${activity.title}`}>
                        <Badge>Completar Espacios</Badge>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-2"> {/* Usar flex para alinear icono y título */}
          <BookOpen className="size-6" /> {/* Icono para Narrativas Culturales */}
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
