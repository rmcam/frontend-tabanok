import React, { useState, useEffect } from 'react';
import { FaChartLine } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import api from '@/lib/api';
import { useAuth } from "@/auth/hooks/useAuth"; // Importar useAuth para obtener el usuario

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
        <p>Cargando datos...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : studentData.length === 0 ? (
        <p>No hay datos de progreso de estudiantes disponibles.</p>
      ) : (
        <ul>
          {studentData.map((student) => (
            <li key={student.id} className="mb-4">
              <div className="flex justify-between">
                <span>{student.name}</span>
                <span>{student.progress}%</span>
              </div>
              <Progress value={student.progress} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentProgress;
