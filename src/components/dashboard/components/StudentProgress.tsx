import React, { useState, useEffect } from 'react';
import { FaChartLine } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import api from '@/lib/api';
import { useAuth } from "@/auth/hooks/useAuth"; // Importar useAuth para obtener el usuario
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { Link } from 'react-router-dom'; // Import Link for navigation

interface Student {
  id: string; // Asumiendo UUIDs en el backend
  name: string; // Nombre del estudiante
  progress: number; // Progreso en porcentaje
  lessonsCompleted: number;
  totalLessons: number;
  score: number;
  // TODO: Añadir otros campos si la respuesta del backend los incluye (ej. lección actual, puntuación, etc.)
}

const StudentProgress = () => {
  const { user } = useAuth(); // Obtener el usuario actual (profesor)
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // TODO: Verificar si el endpoint /analytics/studentProgress requiere el ID del profesor
      // o si la autenticación JWT ya proporciona el contexto necesario en el backend.
      // Si requiere el ID, la URL sería `/analytics/studentProgress/${user.id}`
      // Si no, sería solo `/analytics/studentProgress`
      // Por ahora, asumimos que la autenticación es suficiente.
      setIsLoading(true);
      try {
        // TODO: Verificar la estructura exacta de la respuesta del endpoint /analytics/studentProgress
        // Se asume que devuelve un array de objetos con la estructura de la interfaz Student.
        const data: Student[] = await api.get('/analytics/studentProgress'); // Usar endpoint del backend
        setStudentData(data); // Asumiendo que la respuesta es un array de Student
        setError(null);
      } catch (error: unknown) {
        console.error('Error al obtener el progreso de los estudiantes:', error);
        setError('Error al obtener el progreso de los estudiantes. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    // Solo cargar datos si el usuario está autenticado (si es necesario para el endpoint)
    if (user) { // Descomentar si el endpoint requiere autenticación
      fetchData();
    } else { // Descomentar si el endpoint requiere autenticación
      setIsLoading(false);
      setError("Usuario no autenticado.");
    }

  }, [user]); // Se añadió 'user' como dependencia para resolver la advertencia de ESLint.

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <FaChartLine size={24} className="mr-2" aria-label="Progreso de Estudiantes" />
        <h2 className="text-xl font-semibold">Progreso de Estudiantes</h2>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertTitle>Error al cargar progreso</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : studentData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FaChartLine size={30} className="mb-3" />
          <p>No hay datos de progreso de estudiantes disponibles.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentData.map((student) => (
            <Card key={student.id} className="w-full">
              <CardHeader>
                <CardTitle>
                  <Link to={`/student/${student.id}`} className="hover:underline">
                    {student.name}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progreso:</span>
                  <span>{student.progress}%</span>
                </div>
                <Progress value={student.progress} />
                {/* TODO: Mostrar otras métricas si están disponibles */}
                {/* <div className="text-sm mt-2">
                  <p>Lecciones completadas: {student.lessonsCompleted} / {student.totalLessons}</p>
                  <p>Puntuación: {student.score}</p>
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
