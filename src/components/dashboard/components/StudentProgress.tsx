import React from 'react';
import { FaChartLine } from "react-icons/fa";

const StudentProgress = () => {
  // Datos de ejemplo para el progreso de los estudiantes
  const studentData = [
    { id: '1', name: 'Estudiante 1', progress: 75 },
    { id: '2', name: 'Estudiante 2', progress: 50 },
    { id: '3', name: 'Estudiante 3', progress: 90 },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <FaChartLine size={24} className="mr-2" />
        <h2 className="text-xl font-semibold">Progreso de Estudiantes</h2>
      </div>
      <ul>
        {studentData.map((student) => (
          <li key={student.id} className="mb-2">
            {student.name}: {student.progress}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentProgress;
