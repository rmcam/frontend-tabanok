import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '@/lib/api';
import Loading from '@/components/common/Loading';

interface Activity {
  id: string;
  type: 'quiz' | 'matching' | 'fill-in-the-blanks'; // Specify possible activity types
  title: string;
  // Add other activity properties as needed
}

interface Lesson {
  id: string;
  title: string;
  activities: Activity[]; // Assuming activities are included in lesson data
  // Add other lesson properties as needed
}

interface UnitDetailData {
  id: string;
  name: string;
  description?: string;
  lessons: Lesson[]; // Assuming lessons are included in unit detail
  // Add other unit properties as needed
}

const UnitDetail: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [unitData, setUnitData] = useState<UnitDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnitDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // Assuming backend endpoint for unit detail is /units/:id
        const data: UnitDetailData = await api.get(`/units/${unitId}`);
        setUnitData(data);
      } catch (err: unknown) {
        setError(
          "Error al obtener los datos de la unidad: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchUnitDetail();
    }
  }, [unitId]);

  const getActivityRoute = (activity: Activity) => {
    switch (activity.type) {
      case 'quiz':
        return `/activities/quiz/${activity.id}`;
      case 'matching':
        return `/activities/matching/${activity.id}`;
      case 'fill-in-the-blanks':
        return `/activities/fill-in-the-blanks/${activity.id}`;
      default:
        return '#'; // Fallback for unknown activity types
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!unitData) {
    return <div>No se encontraron datos para esta unidad.</div>;
  }

  return (
    <div>
      <h2>{unitData.name}</h2>
      {unitData.description && <p>{unitData.description}</p>}

      <h3>Lecciones</h3>
      {unitData.lessons.length === 0 ? (
        <p>No hay lecciones disponibles en esta unidad.</p>
      ) : (
        <ul>
          {unitData.lessons.map(lesson => (
            <li key={lesson.id}>
              <h4>{lesson.title}</h4>
              {lesson.activities && lesson.activities.length > 0 ? (
                <ul>
                  {lesson.activities.map(activity => (
                    <li key={activity.id}>
                      <Link to={getActivityRoute(activity)}>
                        {activity.title} ({activity.type})
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay actividades disponibles para esta lección.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* TODO: Display recommendations */}
    </div>
  );
};

export default UnitDetail;
