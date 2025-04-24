import React from 'react';
import { FaChartLine } from "react-icons/fa";

const StudentProgress = () => {
  return (
    <div className="flex items-center">
      <FaChartLine size={24} className="mr-2" />
      <h2>Progreso de Estudiantes</h2>
      {/* Aquí se implementará la lógica para el progreso de estudiantes */}
    </div>
  );
};

export default StudentProgress;
