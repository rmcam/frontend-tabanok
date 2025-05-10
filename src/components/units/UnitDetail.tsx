import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import * as unitService from '@/services/unitService'; // Importar el servicio de unidades
import * as recommendationService from '@/services/recommendationService'; // Importar el servicio de recomendaciones
import { Unit } from '@/types/unitTypes'; // Importar el tipo Unit
import { Activity } from '@/types/activityTypes'; // Importar el tipo Activity
import { Recommendation } from '@/types/recommendationTypes'; // Importar el tipo Recommendation

// Mantener interfaces existentes si son más detalladas que el tipo Unit básico
interface Lesson {
  id: string;
  title: string;
  activities: Activity[]; // Assuming activities are included in lesson data
  // Add other lesson properties as needed
}

// Ajustar UnitDetailData para que coincida con el tipo Unit o fusionar si es necesario
// Por ahora, asumiremos que el servicio devuelve algo compatible con UnitDetailData
export interface UnitDetailData extends Unit { // Extender de Unit si Unit es un subconjunto
  lessons: Lesson[]; // Asumiendo lessons son parte del detalle de la unidad
  // Asegurarse de que las propiedades de Unit (id, title, description) también estén aquí
}


const UnitDetail: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [unitData, setUnitData] = useState<UnitDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usar el nuevo servicio unitService para obtener los detalles de la unidad
        const unitDetails: UnitDetailData = await unitService.getUnitById(unitId as string); // Cast unitId to string
        setUnitData(unitDetails);

        // Obtener recomendaciones para la unidad
        const unitRecommendations = await recommendationService.getRecommendationsByUnitId(unitId as string);
        setRecommendations(unitRecommendations);

      } catch (err: unknown) {
        setError(
          "Error al obtener los datos de la unidad o recomendaciones: " +
            (err instanceof Error ? err.message : String(err))
        );
      } finally {
        setLoading(false);
      }
    };

    if (unitId) {
      fetchData();
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
      <h2>{unitData.title}</h2> {/* Usar unitData.title en lugar de unitData.name */}
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

      {/* Display recommendations */}
      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3>Recomendaciones</h3>
          <ul>
            {recommendations.map(rec => (
              <li key={rec.id}>
                <h4>{rec.title}</h4>
                {rec.description && <p>{rec.description}</p>}
                {rec.link && <a href={rec.link} target="_blank" rel="noopener noreferrer">{rec.link}</a>}
                {rec.relatedActivityId && (
                  <Link to={getActivityRoute({ id: rec.relatedActivityId, type: rec.relatedActivityType || 'unknown', title: 'Actividad Recomendada', description: 'Actividad recomendada relacionada con esta unidad.' } as Activity)}> {/* Assuming a basic Activity structure for routing */}
                    Ver Actividad Relacionada
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UnitDetail;
