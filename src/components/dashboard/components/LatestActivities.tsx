import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component
import { formatDistanceToNow } from 'date-fns'; // Import date-fns function
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table components
import { Alert, AlertDescription } from "@/components/ui/alert"; // Import Alert components
import { FaInfoCircle } from "react-icons/fa"; // Import an icon for empty state

interface Activity {
  id: string;
  studentName: string;
  activityName: string;
  date: string;
}

const LatestActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Llamar al endpoint correcto para las actividades
        const activitiesData = await api.get('/activities');
        console.log('Datos de actividades recibidos:', activitiesData); // Log para inspeccionar la respuesta
        // Mapear la respuesta a la estructura de la interfaz Activity
        const activities: Activity[] = activitiesData.map((activity: {
          id: string;
          title: string;
          createdAt: string;
          user: { firstName: string; lastName: string } | null;
        }) => ({
          id: activity.id,
          studentName: activity.user?.firstName + ' ' + activity.user?.lastName || 'Unknown', // Assuming user info is nested
          activityName: activity.title,
          date: activity.createdAt,
        }));
        // Ordenar las actividades por fecha y obtener las últimas 5
        const latestActivities = activities
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
        setActivities(latestActivities);
      } catch (err: unknown) {
        setError(
          "Error al cargar las últimas actividades: " +
            (err instanceof Error ? err.message : String(err))
        );
        console.error('Detalle del error:', err); // Log para inspeccionar el error completo
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="latest-activities">
      <h3>Últimas Actividades</h3>
      {loading ? (
        <Skeleton className="h-[150px] w-full" /> // Use Skeleton for loading
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <FaInfoCircle size={30} className="mb-3" />
          <p>No hay actividades disponibles en este momento.</p>
        </div>
      ) : (
        <Table className="min-w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Estudiante</TableHead>
              <TableHead>Actividad</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>{activity.studentName}</TableCell>
                <TableCell>{activity.activityName}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(activity.date), { addSuffix: true })}</TableCell> {/* Format date */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default LatestActivities;
