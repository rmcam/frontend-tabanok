import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loading from '@/components/common/Loading';
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb"
import * as unitService from '@/services/unitService';
import * as recommendationService from '@/services/recommendationService';
import { Unit } from '@/types/unitTypes';
import { Activity } from '@/types/activityTypes';
import { Recommendation } from '@/types/recommendationTypes';
import Section from '@/components/common/Section';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Lesson {
  id: string;
  title: string;
  activities: Activity[];
}

export interface UnitDetailData extends Unit {
  lessons: Lesson[];
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
        const unitDetails: UnitDetailData = await unitService.getUnitById(unitId as string);
        setUnitData(unitDetails);

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
        return '#';
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
    <Section className="unit-detail" title={unitData.title}>
      <Breadcrumb>
        <BreadcrumbItem>
          <Link to="/">Inicio</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/units">Unidades</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          {unitData.title}
        </BreadcrumbItem>
      </Breadcrumb>
      <Link to="/units">
        <Button>Regresar a la lista de unidades</Button>
      </Link>
      {unitData.description && <CardDescription>{unitData.description}</CardDescription>}

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
                      <Button asChild>
                        <Link to={getActivityRoute(activity)}>
                          {activity.title} ({activity.type})
                        </Link>
                      </Button>
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

      {recommendations.length > 0 && (
        <div className="mt-8">
          <h3>Recomendaciones</h3>
          <ul>
            {recommendations.map(rec => (
              <li key={rec.id}>
                <h4>{rec.title}</h4>
                {rec.description && <p>{rec.description}</p>}
                {rec.link && <Button asChild><a href={rec.link} target="_blank" rel="noopener noreferrer">{rec.link}</a></Button>}
                {rec.relatedActivityId && (
                  <Button asChild>
                    <Link to={getActivityRoute({ id: rec.relatedActivityId, type: rec.relatedActivityType || 'unknown', title: 'Actividad Recomendada', description: 'Actividad recomendada relacionada con esta unidad.' } as Activity)}>
                      Ver Actividad Relacionada
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Section>
  );
};

export default UnitDetail;
