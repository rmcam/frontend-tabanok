import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import BreadcrumbNav from "@/components/common/BreadcrumbNav";
import { ArrowLeft, ArrowRight, BookOpen, Lightbulb } from "lucide-react";
import { useLessonById } from "@/hooks/lessons/lessons.hooks";
import { useUnityById } from "@/hooks/unities/unities.hooks";
import { useModuleById } from "@/hooks/modules/modules.hooks";
import LearningContentRenderer from "@/features/learn/components/LearningContentRenderer";
import LessonHeroSection from "@/features/learn/components/LessonHeroSection";
import InteractiveExerciseItem from "@/features/learn/components/InteractiveExerciseItem";
import LessonCompletionDialog from "@/features/learn/components/LessonCompletionDialog";
import ExerciseModal from "@/features/learn/components/ExerciseModal";
import { useProfile } from "@/hooks/auth/auth.hooks";
import {
  useGetProgressByUser,
  useCreateProgress,
} from "@/hooks/progress/progress.hooks";
import type { LearningTextContent, LearningLesson } from "@/types/learning";
import { calculateLessonProgress } from "@/lib/learning.utils";
import { toast } from "sonner";

const LessonDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id: lessonId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(
    null
  );

  const { data: userProfile } = useProfile();
  const userId = userProfile?.id;

  const { data: userProgress, isLoading: isLoadingProgress } =
    useGetProgressByUser(userId);

  const {
    data: lessonData,
    isLoading: isLoadingLesson,
    error: lessonError,
  } = useLessonById(lessonId || "");
  const createProgressMutation = useCreateProgress();

  // Procesar la lecciรณn de la API a un tipo de aprendizaje enriquecido
  const lesson: LearningLesson | undefined =
    lessonData && userProgress
      ? calculateLessonProgress(lessonData, userProgress)
      : undefined;

  // Obtener la unidad y el mรณdulo padre para los breadcrumbs
  const { data: unit, isLoading: isLoadingUnit } = useUnityById(
    lesson?.unityId || ""
  );
  const { data: module, isLoading: isLoadingModule } = useModuleById(
    unit?.moduleId || ""
  );

  if (
    isLoadingLesson ||
    isLoadingProgress ||
    isLoadingUnit ||
    isLoadingModule
  ) {
    return (
      <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-4" />{" "}
          {/* Skeleton para Breadcrumbs */}
          <Card className="shadow-lg border-primary/20">
            <CardHeader>
              <Skeleton className="h-8 w-3/4 mb-2" />{" "}
              {/* Skeleton para CardTitle */}
              <Skeleton className="h-4 w-full" />{" "}
              {/* Skeleton para CardDescription */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-lg text-muted-foreground">
                <Skeleton className="h-4 w-1/4" />{" "}
                {/* Skeleton para Puntos Requeridos */}
                <Skeleton className="h-4 w-1/4" />{" "}
                {/* Skeleton para Progreso de la Lecciรณn */}
              </div>
              <Skeleton className="w-full h-3" />{" "}
              {/* Skeleton para Barra de progreso */}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-32" />{" "}
          {/* Skeleton para botรณn Lecciรณn Anterior */}
          <Skeleton className="h-10 w-32" />{" "}
          {/* Skeleton para botรณn Siguiente Lecciรณn */}
        </div>

        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" />{" "}
            {t("Contenido de la Lecciรณn")}
          </h2>
          <Skeleton className="h-48 w-full" />{" "}
          {/* Skeleton para LearningContentRenderer */}
        </div>

        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" />{" "}
            {t("Ejercicios de la Lecciรณn")}
          </h2>
          <div className="grid gap-4">
            <Skeleton className="h-24 w-full" />{" "}
            {/* Skeleton para LearningExerciseItem */}
            <Skeleton className="h-24 w-full" />{" "}
            {/* Skeleton para LearningExerciseItem */}
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <Skeleton className="h-10 w-40" />{" "}
          {/* Skeleton para botรณn Volver a la Unidad */}
        </div>
      </div>
    );
  }

  if (lessonError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-red-500">
        <p className="text-lg">
          {t("Error al cargar la lecciรณn")}: {lessonError.message}
        </p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        <p className="text-lg">{t("Lecciรณn no encontrada.")}</p>
      </div>
    );
  }

  const isLessonCompleted = lesson.isCompleted;

  const handleCompleteLesson = () => {
    if (!userId || !lessonId) return;

    createProgressMutation.mutate(
      {
        userId,
        contentId: lessonId,
        isCompleted: true,
      },
      {
        onSuccess: () => {
          setIsCompletionDialogOpen(true);
        },
      }
    );
  };

  const handleCloseCompletionDialog = () => {
    setIsCompletionDialogOpen(false);
  };

  const handleContinueLearning = () => {
    setIsCompletionDialogOpen(false);
    // Navigate to the next lesson or unit overview
    if (unit && unit.lessons && lesson) {
      const lessons = unit.lessons!; // Non-null assertion for TypeScript
      const currentLessonIndex = lessons.findIndex((l) => l.id === lesson.id);
      const nextLesson =
        currentLessonIndex < lessons.length - 1
          ? lessons[currentLessonIndex + 1]
          : null;
      if (nextLesson) {
        navigate(`/learn/lesson/${nextLesson.id}`);
      } else if (unit) {
        navigate(`/learn/unit/${unit.id}`); // Go back to unit if no next lesson
      } else {
        navigate("/learn"); // Go to learning path if no unit
      }
    } else {
      navigate("/learn");
    }
  };

  const handleOpenExerciseModal = (exerciseId: string) => {
    setSelectedExerciseId(exerciseId);
    setIsExerciseModalOpen(true);
  };

  const handleCloseExerciseModal = () => {
    setIsExerciseModalOpen(false);
    setSelectedExerciseId(null);
    // Optionally refetch user progress or lesson data after an exercise is completed
    // queryClient.invalidateQueries(['userProgress', userId]);
    // queryClient.invalidateQueries(['lessonById', lessonId]);
  };

  const handleExerciseCompleteInModal = (
    isCorrect: boolean,
    points: number
  ) => {
    if (isCorrect) {
      toast.success(t("¡Ejercicio Completado Correctamente!"), {
        description: t(`Has ganado ${points} puntos.`),
      });
      // Optionally refetch user progress or lesson data after an exercise is completed
      // queryClient.invalidateQueries(['userProgress', userId]);
      // queryClient.invalidateQueries(['lessonById', lessonId]);
    } else {
      // This branch should ideally not be reached if modal doesn't close on incorrect.
      // But as a fallback, if it were to close, we could show an error toast.
      toast.error(t("Ejercicio Completado Incorrectamente."), {
        description: t("Por favor, inténtalo de nuevo."),
      });
    }
    handleCloseExerciseModal(); // Close modal after handling completion
  };

  // Procesar el contenido principal de la lecciรณn como un LearningTextContent de tipo 'html'
  const lessonContent: LearningTextContent | null = lesson.content
    ? {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        type: "html",
        content: lesson.content,
        multimedia: lesson.multimedia || [],
        isCompleted: lesson.isCompleted,
        isLocked: lesson.isLocked,
        progress: lesson.progress,
        unityId: lesson.unityId,
      }
    : null;

  return (
    <div className="flex flex-col flex-grow p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        {/* Breadcrumbs */}
        <BreadcrumbNav
          items={[
            { label: t("Camino de Aprendizaje"), path: "/learn" },
            ...(module
              ? [{ label: module.name, path: `/learn/module/${module.id}` }]
              : []),
            ...(unit
              ? [{ label: unit.title, path: `/learn/unit/${unit.id}` }]
              : []),
            { label: lesson.title, path: `/learn/lesson/${lesson.id}` },
          ]}
          className="mb-4"
        />
        <LessonHeroSection lesson={lesson} />
      </div>

      {/* Lรณgica para navegaciรณn entre lecciones */}
      {unit && unit.lessons && (
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {(() => {
            // Ensure unit.lessons is not undefined here for TypeScript
            const lessons = unit.lessons!;
            const currentLessonIndex = lessons.findIndex(
              (l) => l.id === lesson.id
            );
            const previousLesson =
              currentLessonIndex > 0 ? lessons[currentLessonIndex - 1] : null;
            const nextLesson =
              currentLessonIndex < lessons.length - 1
                ? lessons[currentLessonIndex + 1]
                : null;

            return (
              <>
                <Button
                  asChild
                  variant="outline"
                  disabled={!previousLesson}
                  className="w-full md:w-auto"
                >
                  <Link
                    to={
                      previousLesson
                        ? `/learn/lesson/${previousLesson.id}`
                        : "#"
                    }
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />{" "}
                    {t("Lección Anterior")}
                  </Link>
                </Button>

                <div className="text-lg font-semibold text-muted-foreground">
                  {t("Lección")} {currentLessonIndex + 1} {t("de")}{" "}
                  {lessons.length}
                </div>

                <Button
                  asChild
                  disabled={!nextLesson}
                  className="w-full md:w-auto"
                >
                  <Link
                    to={nextLesson ? `/learn/lesson/${nextLesson.id}` : "#"}
                  >
                    {t("Siguiente Lección")}{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </>
            );
          })()}
        </div>
      )}

      {/* Contenido principal de la lecciรณn */}
      {lessonContent && (
        <div className="mb-8 p-6 bg-card rounded-lg shadow-md border border-border">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <BookOpen className="mr-3 h-8 w-8 text-primary" />{" "}
            {t("Contenido de la Lección")}
          </h2>
          <LearningContentRenderer
            content={lessonContent}
            userProgress={userProgress}
            isLocked={lesson.isLocked}
          />
        </div>
      )}

      {/* Ejercicios de la lecciรณn */}
      {lesson.exercises && lesson.exercises.length > 0 && (
        <div className="mb-8">
          <h2 className="flex items-center text-3xl font-bold tracking-tight mb-8 text-secondary-foreground">
            <Lightbulb className="mr-3 h-8 w-8 text-primary" />{" "}
            {t("Ejercicios de la Lecciรณn")}
          </h2>
          <div className="grid gap-4">
            {lesson.exercises.map((exercise) => (
              <InteractiveExerciseItem
                key={exercise.id}
                exercise={exercise}
                isCompleted={exercise.isCompleted}
                isLocked={exercise.isLocked}
                onOpenExercise={handleOpenExerciseModal}
              />
            ))}
          </div>
        </div>
      )}

      {!lessonContent &&
        (!lesson.exercises || lesson.exercises.length === 0) && (
          <div className="col-span-full text-center text-muted-foreground mt-8 p-4 border rounded-lg bg-card shadow-lg">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
            <p className="text-xl font-semibold mb-2">
              {t("ยกAรบn no hay contenido ni ejercicios en esta lecciรณn!")}
            </p>
            <p>
              {t(
                "Parece que esta lecciรณn estรก vacรญa. Por favor, contacta al administrador para que aรฑada contenido."
              )}
            </p>
          </div>
        )}

      <div className="mt-8 flex justify-between">
        <Button
          asChild
          variant="outline"
        >
          <Link to={unit ? `/learn/unit/${unit.id}` : "/learn"}>
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("Volver a la Unidad")}
          </Link>
        </Button>
        {/* Botรณn para completar la lecciรณn */}
        <Button
          onClick={handleCompleteLesson}
          disabled={isLessonCompleted || createProgressMutation.isPending}
        >
          {createProgressMutation.isPending
            ? t("Guardando...")
            : isLessonCompleted
            ? t("Lecciรณn Completada")
            : t("Completar Lecciรณn")}
        </Button>
      </div>

      {lesson && (
        <LessonCompletionDialog
          isOpen={isCompletionDialogOpen}
          onClose={handleCloseCompletionDialog}
          onContinue={handleContinueLearning}
          lessonTitle={lesson.title}
        />
      )}

      <ExerciseModal
        isOpen={isExerciseModalOpen}
        onClose={handleCloseExerciseModal}
        exerciseId={selectedExerciseId}
        onExerciseComplete={handleExerciseCompleteInModal}
      />
    </div>
  );
};

export default LessonDetailPage;
