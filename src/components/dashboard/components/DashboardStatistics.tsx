import React, { useState, useEffect } from 'react';
import { FaUsers, FaFileAlt, FaPlusCircle } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import api from '@/lib/api';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
//import { Link } from 'react-router-dom'; // Import Link - REMOVED UNUSED IMPORT

interface Statistics {
  students: number;
  teachers: number;
  units: number;
  activities: number;
  reports: number;
}

const DashboardStatistics = () => {
  const [statisticsData, setStatisticsData] = useState([
    { id: '1', label: 'Estudiantes', value: 0, icon: FaUsers },
    { id: '2', label: 'Profesores', value: 0, icon: FaUsers },
    { id: '3', label: 'Unidades', value: 0, icon: FaFileAlt },
    { id: '4', label: 'Actividades', value: 0, icon: FaPlusCircle },
    { id: '5', label: 'Reportes', value: 0, icon: FaFileAlt },
  ]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setApiError(null);
      try {
        // Llamar al endpoint correcto para las estadísticas del dashboard
        const data = await api.get('/dashboard/statistics');
        console.log('Datos de estadísticas recibidos:', data); // Log para inspeccionar la respuesta
        // Mapeo basado en la estructura real de la respuesta del backend
        if (typeof data === 'object' && data !== null) {
          const statistics = data as Statistics;
          setStatisticsData([
            { id: '1', label: 'Estudiantes', value: statistics.students || 0, icon: FaUsers },
            { id: '2', label: 'Profesores', value: statistics.teachers || 0, icon: FaUsers },
            { id: '3', label: 'Unidades', value: statistics.units || 0, icon: FaFileAlt },
            { id: '4', label: 'Actividades', value: statistics.activities || 0, icon: FaPlusCircle },
            { id: '5', label: 'Reportes', value: statistics.reports || 0, icon: FaFileAlt },
          ]);
        } else {
          console.error('Error: Invalid data format from the backend');
          setApiError('Error: Invalid data format from the backend');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido al cargar estadísticas.";
        console.error('Error fetching dashboard statistics:', error);
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-semibold mb-3">Estadísticas del Dashboard</h2>
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{apiError}</AlertDescription>
        </Alert>
      )}
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
          statisticsData.map((item) => {
            let iconColor = "text-tabanok-lavanda";
            if (item.label === "Estudiantes") {
              iconColor = "text-kamentsa-verde-oscuro";
            } else if (item.label === "Profesores") {
              iconColor = "text-kamentsa-amarillo-calido";
            } else if (item.label === "Unidades") {
              iconColor = "text-kamentsa-azul-celeste";
            } else if (item.label === "Actividades") {
              iconColor = "text-kamentsa-rojo-intenso";
            } else if (item.label === "Reportes") {
              iconColor = "text-kamentsa-tierra";
            }
            return (
              <Card key={item.id} className="w-full bg-tabanok-violeta-claro hover:shadow-md transition-shadow duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-morado-oscuro">
                    {item.label}
                  </CardTitle>
                  {item.icon && <item.icon size={20} className={iconColor} aria-hidden="true" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  );
};

export default DashboardStatistics;
