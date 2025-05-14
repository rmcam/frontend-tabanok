import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileAlt, FaPlusCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import api from '@/lib/api';

const DashboardStatistics = () => {
  const [statisticsData, setStatisticsData] = useState([
    { id: '1', label: 'Estudiantes', value: 0, icon: FaUsers },
    { id: '2', label: 'Actividades', value: 0, icon: FaPlusCircle },
    { id: '3', label: 'Reportes', value: 0, icon: FaFileAlt },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Llamar al endpoint correcto para las estadísticas del dashboard
        const data = await api.get('/statistics');
        //const users = await api.get('/users');
        //const activities = await api.get('/activities');
        console.log('Datos de estadísticas recibidos:', data); // Log para inspeccionar la respuesta
        // Mapeo basado en la estructura real de la respuesta del backend
        setStatisticsData([
          { id: '1', label: 'Estudiantes', value: data.students || 0, icon: FaUsers },
          { id: '2', label: 'Actividades', value: data.activities || 0, icon: FaPlusCircle },
          { id: '3', label: 'Reportes', value: data.reports || 0, icon: FaFileAlt },
        ]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error fetching dashboard statistics:', error.message);
        } else {
          console.error('An unexpected error occurred:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-3">Estadísticas del Dashboard</h2>
      {statisticsData.some(item => item.value === 0) && (
        <div className="text-yellow-600 mb-4">
          Nota: Las estadísticas pueden no estar completas debido a errores en el backend.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </>
        ) : (
          statisticsData.map((item) => (
            <Card key={item.id} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.label}
                </CardTitle>
                {item.icon && <item.icon size={20} className="text-muted-foreground" aria-hidden="true" />}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardStatistics;
