import React, { useState, useEffect } from 'react';
import api from '@/lib/api';

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
        const data: Activity[] = await api.get('/activities/latest');
        setActivities(data);
      } catch (err: unknown) {
        setError(
          "Error de red o del servidor al obtener las últimas actividades: " +
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
        <div>Cargando actividades...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : activities.length === 0 ? (
        <p>No hay actividades disponibles.</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li key={activity.id}>
              {activity.studentName} - {activity.activityName} - {activity.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LatestActivities;
