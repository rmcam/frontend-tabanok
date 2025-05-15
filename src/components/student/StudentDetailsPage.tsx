import React from 'react';
import { useParams } from 'react-router-dom';

const StudentDetailsPage: React.FC = () => {
  const { studentId } = useParams();

  return (
    <div>
      <h1>Detalles del Estudiante</h1>
      <p>ID del estudiante: {studentId}</p>
      {/* Aquí se mostrará información detallada sobre el estudiante */}
    </div>
  );
};

export default StudentDetailsPage;