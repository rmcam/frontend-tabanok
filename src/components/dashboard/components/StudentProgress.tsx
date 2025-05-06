import React, { useState, useEffect } from 'react';
import { FaChartLine } from "react-icons/fa";
import { Progress } from "@/components/ui/progress";
import api from '@/lib/api';

interface Student {
  id: string;
  name: string;
  progress: number;
}

const StudentProgress = () => {
  const [studentData, setStudentData] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data: Student[] = await api.get('/students/progress');
        setStudentData(data);
        setError(null);
      } catch (error: unknown) {
        console.error('Error al obtener el progreso de los estudiantes:', error);
        setError('Error al obtener el progreso de los estudiantes. Por favor, inténtelo de nuevo más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
<FaChartLine size={24} className="mr-2" aria-label="Progreso de Estudiantes" />
        <h2 className="text-xl font-semibold">Progreso de Estudiantes</h2>
      </div>
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
      {isLoading && <p>Cargando datos...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default StudentProgress;
