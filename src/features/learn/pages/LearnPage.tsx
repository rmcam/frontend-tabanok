import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { BookOpen, Lightbulb, GraduationCap, Award } from "lucide-react"; // Importar Award para gamificación
import { useLearningPath } from '@/hooks/learn/useLearningPath';
import ModuleCard from '../components/ModuleCard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'; // Importar componentes de Chart
import { Pie, PieChart } from 'recharts'; // Importar PieChart y Pie de recharts
import { useProfile } from '@/hooks/auth/auth.hooks'; // Importar useProfile para estadísticas del usuario

const LearnPage: React.FC = () => {
  const { t } = useTranslation();
  
  const { learningPath, isLoading, error, totalModulesCompleted, totalModules, nextModule } = useLearningPath();
  const { data: userProfile } = useProfile(); // Obtener el perfil del usuario

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">{t("Cargando camino de aprendizaje...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar camino de aprendizaje")}: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      {/* Sección Central Scrolleable - Camino de Aprendizaje */}
      <div className="flex-1 lg:pr-0 mb-8 lg:mb-0 lg:w-3/4">
        <div className="text-center lg:text-left mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-3 text-primary">
            {t("Tu Camino de Aprendizaje Kamentsá")}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            {t("Embárcate en una aventura inmersiva para dominar el idioma y la rica cultura Kamentsá. Cada paso te acerca a la fluidez y la comprensión.")}
          </p>
        </div>
        
        <div className="relative py-8">
          {/* Línea del camino mejorada */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-primary to-purple-500 rounded-full z-0"></div>
          
          {learningPath.length === 0 && (
            <div className="text-center text-muted-foreground mt-16 p-4 border rounded-lg bg-card shadow-lg">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-xl font-semibold mb-2">{t("¡Aún no hay módulos de aprendizaje!")}</p>
              <p>{t("Parece que tu camino está vacío. Por favor, contacta al administrador para que añada contenido.")}</p>
            </div>
          )}

          {learningPath.map((module, i) => (
            <React.Fragment key={module.id}>
              <ModuleCard module={module} index={i} />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Sección Derecha de Invitación/Resumen */}
      <div className="w-full lg:w-1/4 xl:w-1/5 flex-shrink-0">
        <Card className="sticky top-8 p-4 shadow-lg border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-primary">{t("Tu Progreso Actual")}</CardTitle>
            <CardDescription>{t("Un resumen de tu avance en el camino de aprendizaje.")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Gráfico de Progreso Circular */}
            {totalModules > 0 && (
              <div className="flex flex-col items-center">
                <ChartContainer
                  config={{
                    progress: {
                      label: 'Progreso',
                      color: 'hsl(var(--primary))',
                    },
                    remaining: {
                      label: 'Restante',
                      color: 'hsl(var(--muted))',
                    },
                  }}
                  className="h-32 w-32"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={[
                        { name: 'progress', value: totalModulesCompleted, fill: 'var(--color-progress)' },
                        { name: 'remaining', value: totalModules - totalModulesCompleted, fill: 'var(--color-remaining)' },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={40}
                      outerRadius={50}
                      strokeWidth={2}
                      cornerRadius={5}
                    />
                  </PieChart>
                </ChartContainer>
                <p className="text-xl font-bold text-primary mt-2">
                  {Math.round((totalModulesCompleted / totalModules) * 100)}% {t("Completado")}
                </p>
              </div>
            )}

            <div className="flex items-center space-x-3 text-lg">
              <BookOpen className="h-6 w-6 text-muted-foreground" />
              <p className="font-semibold">{t("Módulos Completados")}: <span className="text-primary">{totalModulesCompleted}</span> / {totalModules}</p>
            </div>

            {/* Estadísticas de Puntos y Racha */}
            {userProfile && (
              <>
                <div className="flex items-center space-x-3 text-lg">
                  <Award className="h-6 w-6 text-muted-foreground" />
                  <p className="font-semibold">{t("Puntos Totales")}: <span className="text-primary">{userProfile.points || 0}</span></p>
                </div>
                <div className="flex items-center space-x-3 text-lg">
                  <Lightbulb className="h-6 w-6 text-muted-foreground" />
                  <p className="font-semibold">{t("Racha de Aprendizaje")}: <span className="text-primary">{userProfile.gameStats?.streak || 0} {t("días")}</span></p>
                </div>
              </>
            )}

            {/* Sección de Próximo Módulo Destacado */}
            {nextModule ? (
              <Card className="mt-6 p-4 border-primary/30 bg-primary/5 shadow-md">
                <CardTitle className="text-xl font-bold text-primary mb-2">{t("¡Continúa tu Aventura!")}</CardTitle>
                <CardDescription className="mb-3">{t("Tu próximo desafío te espera:")}</CardDescription>
                <div className="flex items-center space-x-3 mb-4">
                  <Lightbulb className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-semibold text-lg text-primary">{nextModule.name}</p>
                    <p className="text-sm text-muted-foreground">{nextModule.description}</p>
                  </div>
                </div>
                <Button asChild className="w-full text-lg py-3">
                  <Link to={nextModule.url}>
                    {t("Ir al Módulo")}
                  </Link>
                </Button>
              </Card>
            ) : totalModules > 0 ? (
              <p className="text-lg text-green-600 font-bold text-center mt-4">{t("¡Felicidades! Has completado todos los módulos.")}</p>
            ) : (
              <p className="text-lg text-muted-foreground text-center mt-4">{t("No hay módulos de aprendizaje disponibles.")}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LearnPage;
