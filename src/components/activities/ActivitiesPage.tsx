import React, { useEffect, useState } from 'react';
import * as activityService from '@/services/activityService'; // Importar el servicio de actividades
import { Activity } from '@/types/activityTypes'; // Importar el tipo Activity
import Loading from '@/components/common/Loading'; // Importar componente de carga

const ActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activityService.getActivities();
        setActivities(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Error al cargar las actividades.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-red-500 container mx-auto py-8">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Lista de Actividades</h1>
      {activities.length === 0 ? (
        <p>No hay actividades disponibles en este momento.</p>
      ) : (
        <ul>
          {activities.map(activity => (
            <li key={activity.id} className="mb-4 p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{activity.title}</h2>
              <p className="text-gray-700">{activity.description}</p>
              <p className="text-sm text-gray-500">Tipo: {activity.type}</p>
              {/* Aquí podrías agregar un enlace o botón para iniciar la actividad */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivitiesPage;
