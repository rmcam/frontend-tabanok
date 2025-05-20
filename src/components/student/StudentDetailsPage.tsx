import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '@/auth/hooks/useAuth';
import useFetchStudentData from '@/hooks/useFetchStudentData';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Activity, Award } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

/*interface Student {
  name: string;
  completedLessons: number;
  overallScore: number;
  totalLessons: number;
}*/

const StudentDetailsPage: React.FC = () => {
  const { studentId } = useParams<{ studentId: string }>(); // Get studentId and tell TS it will be a string - NOT USED
  const { user } = useAuth();
  const {
    progressData,
    achievements,
    loading,
    error,
  } = useFetchStudentData(user, studentId);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Detalles del Estudiante</h1>
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
        <Skeleton className="h-[120px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Detalles del Estudiante</h1>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Find the student data based on studentId
  //const student = progressData; // Assuming progressData contains the student details

  if (!progressData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Detalles del Estudiante</h1>
        <Alert variant="destructive">
          <AlertDescription>No se encontraron detalles para este estudiante.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Detalles del Estudiante</h1>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Activity className="size-6" />
          <CardTitle>Información del Estudiante</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nombre: {progressData?.name}</p>
          <p>Lecciones completadas: {progressData.completedLessons} / {progressData.totalLessons}</p>
          <p>Puntuación general: {progressData.overallScore}</p>
          <Progress value={progressData.overallScore} />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Award className="size-6" />
          <CardTitle>Logros</CardTitle>
        </CardHeader>
        <CardContent>
          {achievements && achievements.length === 0 ? (
            <p>No hay logros disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map(achievement => (
                <Card key={achievement.id} className="shadow-sm">
                  <CardHeader>
                    <CardTitle>{achievement.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{achievement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailsPage;