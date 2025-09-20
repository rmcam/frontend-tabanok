import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import BreadcrumbNav from '@/components/common/BreadcrumbNav';
import { BookOpen, Lightbulb, ArrowLeft, ArrowRight } from 'lucide-react';
import LearningContentRenderer from '@/features/learn/components/LearningContentRenderer';
import LearningExerciseItem from '@/features/learn/components/LearningExerciseItem';
import { useProfile } from '@/hooks/auth/auth.hooks';
import { useGetProgressByUser, useCreateProgress } from '@/hooks/progress/progress.hooks';
import { useDailyLesson } from '@/hooks/lessons/lessons.hooks'; // Hook para la lección diaria
import type { LearningContent, LearningTextContent, LearningLesson } from '@/types/learning';
import { calculateLessonProgress } from '@/lib/learning.utils';

const DailyLessonPage: React.FC = () => {
  const { t } = useTranslation();

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: userProgress, isLoading: isLoadingProgress } = useGetProgressByUser(userId);
  const { data: dailyLessonData, isLoading: isLoadingDailyLesson, error: dailyLessonError } = useDailyLesson(userId || '');
  const createProgressMutation = useCreateProgress();

  const lesson: LearningLesson | undefined = dailyLessonData && userProgress
    ? calculateLessonProgress(dailyLessonData, userProgress)
    : undefined;

  const isLoading = isLoadingDailyLesson || isLoadingProgress;

  if (isLoading) {
    return (
      <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg text-muted-foreground">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="w-full h-3" />
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> {t("Contenido de la Lección Diaria")}
          </h2>
          <Skeleton className="h-48 w-full" />
        </div>

        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" /> {t("Ejercicios de la Lección Diaria")}
          </h2>
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
    );
  }

  if (dailyLessonError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">{t("Error al cargar la lección diaria")}: {dailyLessonError.message}</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("No hay lección diaria disponible en este momento.")}</p>
      </div>
    );
  }

  const isLessonCompleted = lesson.isCompleted;

  const handleCompleteLesson = () => {
    if (!userId || !lesson?.id) return;

    createProgressMutation.mutate({
      userId,
      contentId: lesson.id,
      isCompleted: true,
    });
  };

  const lessonContent: LearningTextContent | null = lesson.content ? {
    id: lesson.id,
    title: lesson.title,
    description: lesson.description,
    type: 'html',
    content: lesson.content,
    multimedia: lesson.multimedia || [],
    isCompleted: lesson.isCompleted,
    isLocked: lesson.isLocked,
    progress: lesson.progress,
    unityId: lesson.unityId,
  } : null;

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <BreadcrumbNav
          items={[
            { label: t("Camino de Aprendizaje"), path: "/learn" },
            { label: t("Lección Diaria"), path: "/learn/daily-lesson" },
          ]}
          className="mb-4"
        />
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-primary">{t("Lección Diaria")}: {lesson.title}</CardTitle>
            <CardDescription>{lesson.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-lg text-muted-foreground">
              <span>{t("Puntos Requeridos")}: <span className="font-semibold text-primary">{lesson.requiredPoints}</span></span>
              <span>{t("Progreso de la Lección")}: <span className="font-semibold text-primary">{lesson.progress}%</span></span>
            </div>
            <Progress value={lesson.progress} className="w-full h-3" />
          </CardContent>
        </Card>
      </div>

      {lessonContent && (
        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" /> {t("Contenido de la Lección")}
          </h2>
          <LearningContentRenderer content={lessonContent} userProgress={userProgress} isLocked={lesson.isLocked} />
        </div>
      )}

      {(lesson.exercises && lesson.exercises.length > 0) && (
        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" /> {t("Ejercicios de la Lección")}
          </h2>
          <div className="grid gap-4">
            {lesson.exercises.map(exercise => {
              return (
                <LearningExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  isCompleted={exercise.isCompleted}
                  isLocked={exercise.isLocked}
                />
              );
            })}
          </div>
        </div>
      )}

      {(!lessonContent && (!lesson.exercises || lesson.exercises.length === 0)) && (
        <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
          <p className="text-xl font-semibold mb-2">{t("¡Aún no hay contenido ni ejercicios en esta lección diaria!")}</p>
          <p>{t("Parece que esta lección diaria está vacía. Por favor, contacta al administrador para que añada contenido.")}</p>
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleCompleteLesson}
          disabled={isLessonCompleted || createProgressMutation.isPending}
        >
          {createProgressMutation.isPending ? t("Guardando...") : isLessonCompleted ? t("Lección Diaria Completada") : t("Completar Lección Diaria")}
        </Button>
      </div>
    </div>
  );
};

export default DailyLessonPage;
