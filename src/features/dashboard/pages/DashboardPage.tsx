import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { BookOpen, Award, BarChart2, Trophy } from 'lucide-react'; // Añadido Trophy para logros

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

import ErrorBoundary from '@/components/common/ErrorBoundary'; // Importar ErrorBoundary

import { useLearningPath } from '@/hooks/learn/useLearningPath';
import { useUserStore } from '@/stores/userStore';
import { useUserBadges } from '@/hooks/badges/badges.hooks';
import { useUserStatistics } from '@/hooks/statistics/statistics.hooks';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useUserStore(); // Obtener el usuario del store
  const userId = user?.id; // Obtener el ID del usuario

  const { isLoading, error, totalModulesCompleted, totalModules, nextModule } = useLearningPath();
  const { data: userBadges, isLoading: isLoadingBadges, error: errorBadges } = useUserBadges(userId || ''); // Obtener insignias
  const { data: userStats, isLoading: isLoadingStats, error: errorStats } = useUserStatistics(userId || ''); // Obtener estadísticas

  const progressPercentage = totalModules > 0 ? (totalModulesCompleted / totalModules) * 100 : 0;

  // Determinar el estado de carga y error general
  const overallIsLoading = isLoading || isLoadingBadges || isLoadingStats;
  const overallError = error || errorBadges || errorStats;

  if (overallIsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando dashboard...")}</p>
      </div>
    );
  }

  if (overallError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar el dashboard")}: {overallError.message}</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-primary">
            {t("Bienvenido a tu Dashboard")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("Aquí tienes un resumen de tu progreso y actividad reciente.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tarjeta de Progreso de Aprendizaje */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-primary flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                {t("Tu Progreso de Aprendizaje")}
              </CardTitle>
              <CardDescription>{t("Un vistazo rápido a tu avance en el camino Kamentsá.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg">
                <p className="font-semibold">{t("Módulos Completados")}:</p>
                <span className="text-primary font-bold">{totalModulesCompleted}</span> / {totalModules}
              </div>
              <Progress value={progressPercentage} className="w-full" />
              {nextModule && (
                <div className="text-lg">
                  <p className="font-semibold">{t("Próximo Módulo")}: <span className="text-primary">{nextModule.name}</span></p>
                </div>
              )}
              {nextModule && (
                <Button asChild className="w-full text-lg py-3 mt-2">
                  <Link to={nextModule.url}>
                    {t("Continuar Aprendiendo")}
                  </Link>
                </Button>
              )}
              {!nextModule && totalModules > 0 && (
                <p className="text-lg text-green-600 font-bold text-center mt-2">{t("¡Felicidades! Has completado todos los módulos.")}</p>
              )}
              {totalModules === 0 && (
                <p className="text-lg text-muted-foreground text-center mt-2">
                  {t("Parece que tu camino de aprendizaje aún no tiene módulos. ¡Empieza a explorar!")}
                </p>
              )}
              <Button asChild variant="outline" className="w-full text-lg py-3 mt-2">
                <Link to="/learn">
                  {t("Ver Camino Completo")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de Logros */}
          <Card className="shadow-lg border-purple-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-purple-500 flex items-center">
                <Award className="h-6 w-6 mr-2" />
                {t("Tus Logros")}
              </CardTitle>
              <CardDescription>{t("Insignias y reconocimientos obtenidos.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userBadges && userBadges.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userBadges.map(badge => (
                    <Badge key={badge.id} variant="secondary" className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      {badge.badgeId} {/* Asumiendo que badgeId es el nombre o se puede mapear a uno */}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("Aún no tienes logros. ¡Completa módulos y unidades para ganar insignias!")}
                </p>
              )}
              <Button asChild variant="outline" className="w-full text-lg py-3 mt-2">
                <Link to="/achievements">
                  {t("Explorar Logros")}
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Tarjeta de Estadísticas */}
          <Card className="shadow-lg border-blue-500/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold text-blue-500 flex items-center">
                <BarChart2 className="h-6 w-6 mr-2" />
                {t("Estadísticas de Aprendizaje")}
              </CardTitle>
              <CardDescription>{t("Tu actividad y rendimiento en el tiempo.")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {userStats ? (
                <div className="space-y-2">
                  <p className="text-lg">
                    <span className="font-semibold">{t("Puntos Totales")}:</span>{' '}
                    <span className="text-blue-600 font-bold">{userStats.totalPoints}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">{t("Lecciones Completadas")}:</span>{' '}
                    <span className="text-blue-600 font-bold">{userStats.lessonsCompleted}</span>
                  </p>
                  <p className="text-lg">
                    <span className="font-semibold">{t("Actividades Completadas")}:</span>{' '}
                    <span className="text-blue-600 font-bold">{userStats.activitiesCompleted}</span>
                  </p>
                  {/* Puedes añadir más estadísticas aquí */}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t("Aquí verás gráficos y datos detallados sobre tu actividad de aprendizaje.")}
                </p>
              )}
              <Button asChild variant="outline" className="w-full text-lg py-3 mt-2">
                <Link to="/statistics">
                  {t("Ver Estadísticas Detalladas")}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardPage;
