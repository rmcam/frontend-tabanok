import React from 'react';
import { FaPlusCircle } from "react-icons/fa";

const ActivityCreator = () => {
  return (
    <div className="flex items-center">
      <FaPlusCircle size={24} className="mr-2" />
      <h2>Creación de Actividades</h2>
      {/* Aquí se implementará la lógica para la creación de actividades */}
    </div>
  );
};

export default ActivityCreator;
