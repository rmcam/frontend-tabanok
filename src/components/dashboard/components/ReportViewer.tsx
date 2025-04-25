import React from 'react';
import { FaFileAlt } from "react-icons/fa";

const ReportViewer = () => {
  // Datos de ejemplo para los reportes
  const reportData = [
    { id: '1', name: 'Reporte 1', url: '#' },
    { id: '2', name: 'Reporte 2', url: '#' },
    { id: '3', name: 'Reporte 3', url: '#' },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-4">
        <FaFileAlt size={24} className="mr-2" />
        <h2 className="text-xl font-semibold">Acceso a Reportes</h2>
      </div>
      <ul>
        {reportData.map((report) => (
          <li key={report.id} className="mb-2">
            <a href={report.url} className="text-blue-500 hover:underline">{report.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportViewer;
