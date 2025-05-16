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
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const unitDetails: UnitDetailData = await unitService.getUnitById(unitId as string);
        setUnitData(unitDetails);

        setRecommendationsLoading(true);
        setRecommendationsError(null);
        try {
          const unitRecommendations = await recommendationService.getRecommendationsByUnitId(unitId as string);
          setRecommendations(unitRecommendations);
        } catch (err: unknown) {
          setRecommendationsError(
            "Error al obtener las recomendaciones: " +
              (err instanceof Error ? err.message : String(err))
          );
        } finally {
          setRecommendationsLoading(false);
        }

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
    <Section className="unit-detail py-6" title={unitData.title}>
      <Breadcrumb className="mb-4">
        <BreadcrumbItem>
          <Link to="/" className="text-blue-500 hover:text-blue-700">Inicio</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <Link to="/units" className="text-blue-500 hover:text-blue-700">Unidades</Link>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <span className="font-medium">{unitData.title}</span>
        </BreadcrumbItem>
      </Breadcrumb>
      <div className="mb-4">
        <Link to="/units">
          <Button variant="outline">Regresar a la lista de unidades</Button>
        </Link>
      </div>
      {unitData.description && <CardDescription className="text-gray-600">{unitData.description}</CardDescription>}

      <h3 className="text-xl font-semibold mt-6 mb-2">Lecciones</h3>
      {unitData.lessons.length === 0 ? (
        <p className="text-gray-500">No hay lecciones disponibles en esta unidad.</p>
      ) : (
        <ul className="list-disc list-inside">
          {unitData.lessons.map(lesson => (
            <li key={lesson.id} className="mb-4">
              <h4 className="text-lg font-medium">{lesson.title}</h4>
              {lesson.activities && lesson.activities.length > 0 ? (
                <ul className="list-decimal list-inside">
                  {lesson.activities.map(activity => (
                    <li key={activity.id} className="mb-2">
                      <Button asChild variant="link">
                        <Link to={getActivityRoute(activity)} className="text-blue-500 hover:text-blue-700">
                          {activity.title} ({activity.type})
                        </Link>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No hay actividades disponibles para esta lección.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {recommendationsLoading && <Loading />}
      {recommendationsError && <div className="text-red-500 mt-4">Error: {recommendationsError}</div>}

      {!recommendationsLoading && recommendations.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Recomendaciones</h3>
          <ul className="list-disc list-inside">
            {recommendations.map(rec => (
              <li key={rec.id} className="mb-4">
                <h4 className="text-lg font-medium">{rec.title}</h4>
                {rec.description && <p className="text-gray-600">{rec.description}</p>}
                {rec.link && <Button asChild variant="link"><a href={rec.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">{rec.link}</a></Button>}
                {rec.relatedActivityId && (
                  <Button asChild variant="link">
                    <Link to={getActivityRoute({ id: rec.relatedActivityId, type: rec.relatedActivityType || 'unknown', title: 'Actividad Recomendada', description: 'Actividad recomendada relacionada con esta unidad.' } as Activity)} className="text-blue-500 hover:text-blue-700">
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
