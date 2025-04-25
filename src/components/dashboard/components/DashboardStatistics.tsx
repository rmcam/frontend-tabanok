import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileAlt, FaPlusCircle } from "react-icons/fa";
import api from '@/lib/api';

const DashboardStatistics = () => {
  const [statisticsData, setStatisticsData] = useState([
    { id: '1', label: 'Estudiantes', value: 0, icon: FaUsers },
    { id: '2', label: 'Actividades', value: 0, icon: FaPlusCircle },
    { id: '3', label: 'Reportes', value: 0, icon: FaFileAlt },
  ]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const data = await api.get('/dashboard/statistics');
        setStatisticsData(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching dashboard statistics:', error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-3">Estadísticas del Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {statisticsData.map((item) => (
          <div key={item.id} className="p-4 border rounded-md shadow-sm">
            <div className="flex items-center mb-2">
              {item.icon && <item.icon size={20} className="mr-2" />}
              <h3 className="text-xl font-semibold">{item.label}</h3>
            </div>
            <p className="text-gray-700">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardStatistics;
