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
        // Llamar al endpoint correcto para las últimas actividades
        const data: Activity[] = await api.get('/activities/latest');
        // TODO: Ajustar setActivities(data) según la estructura real de la respuesta del backend /activities/latest
        console.log('Datos de actividades recientes recibidos:', data); // Log para inspeccionar la respuesta
        setActivities(data); // Asumiendo que la respuesta es un array de Activity
      } catch (err: unknown) {
        setError(
          "Error al cargar las últimas actividades: " +
            (err instanceof Error ? err.message : String(err))
        );
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
        <Table>
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
