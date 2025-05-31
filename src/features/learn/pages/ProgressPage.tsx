import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, BookOpen, Clock, Star, GraduationCap } from "lucide-react"; // Iconos para métricas y logros

// Definir tipos para las métricas
interface Metric {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

// Definir tipo para el progreso del curso
interface CourseProgress {
  id: string;
  title: string;
  progress: number; // 0-100
}

// Definir tipo para los logros
interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  icon: React.ElementType;
}

// Datos simulados para demostración
const mockMetrics: Metric[] = [
  { title: "Cursos Completados", value: 3, icon: BookOpen },
  { title: "Puntos Totales", value: 1250, icon: Star },
  { title: "Tiempo de Estudio (horas)", value: 45, icon: Clock },
];

const mockCourseProgress: CourseProgress[] = [
  { id: "c1", title: "Introducción al Kamentsa", progress: 75 },
  { id: "c2", title: "Gramática Avanzada", progress: 30 },
  { id: "c3", title: "Cultura y Tradiciones", progress: 90 },
  { id: "c4", title: "Fonética y Pronunciación", progress: 50 },
];

const mockAchievements: Achievement[] = [
  { id: "a1", name: "Primer Paso", description: "Completa tu primera lección.", unlocked: true, icon: Trophy },
  { id: "a2", name: "Explorador Novato", description: "Completa 3 cursos básicos.", unlocked: true, icon: BookOpen },
  { id: "a3", name: "Maestro de la Gramática", description: "Completa el curso de Gramática Avanzada.", unlocked: false, icon: GraduationCap }, // Asumiendo GraduationCap de lucide-react
  { id: "a4", name: "Comunicador Fluido", description: "Participa en 5 clases en vivo.", unlocked: false, icon: Clock },
];

const ProgressPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Mi Progreso</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Métricas Clave</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Progreso por Curso</h2>
        <div className="space-y-4">
          {mockCourseProgress.map((course) => (
            <Card key={course.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex-grow">
                  <h3 className="font-medium">{course.title}</h3>
                  <Progress value={course.progress} className="h-2 mt-2" />
                </div>
                <span className="ml-4 text-sm font-semibold">{course.progress}%</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Mis Logros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {mockAchievements.map((achievement) => (
            <Card key={achievement.id} className={achievement.unlocked ? "" : "opacity-50 grayscale"}>
              <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                {achievement.icon && <achievement.icon className="h-8 w-8 mb-2 text-primary" />}
                <h3 className="font-semibold text-base">{achievement.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge variant="secondary" className="mt-2">Desbloqueado</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Aquí se podría añadir un gráfico de progreso si se decide */}
    </div>
  );
};

export default ProgressPage;
