import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ChevronDown, PlayCircle, FileText, HelpCircle, Volume2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAllUnitsWithLessons } from '@/hooks/lessons/lessons.hooks';
import { useAllUserLessonProgress, useAllUserUnityProgress } from '@/hooks/progress/progress.hooks';
import type { Lesson, Unity } from '@/types/api';

const LessonsPage: React.FC = () => {
  const [openUnits, setOpenUnits] = useState<string[]>([]);
  const { data: units, isLoading: isLoadingUnits, error: unitsError } = useAllUnitsWithLessons();
  const { data: lessonProgresses, isLoading: isLoadingLessonProgress, error: lessonProgressError } = useAllUserLessonProgress();
  const { data: unityProgresses, isLoading: isLoadingUnityProgress, error: unityProgressError } = useAllUserUnityProgress();

  const toggleUnit = (unitId: string) => {
    setOpenUnits(prev =>
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.multimedia && lesson.multimedia.length > 0) {
      const video = lesson.multimedia.find(m => m.fileType.startsWith('video'));
      const audio = lesson.multimedia.find(m => m.fileType.startsWith('audio'));
      if (video) return <PlayCircle className="h-4 w-4" />;
      if (audio) return <Volume2 className="h-4 w-4" />;
    }
    if (lesson.topics && lesson.topics.length > 0) {
      return <FileText className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  if (isLoadingUnits || isLoadingLessonProgress || isLoadingUnityProgress) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center">Cargando lecciones y progreso...</div>;
  }

  if (unitsError) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">Error al cargar las unidades: {unitsError.message}</div>;
  }

  if (lessonProgressError) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">Error al cargar el progreso de lecciones: {lessonProgressError.message}</div>;
  }

  if (unityProgressError) {
    return <div className="p-4 sm:p-6 lg:p-8 text-center text-red-500">Error al cargar el progreso de unidades: {unityProgressError.message}</div>;
  }

  const lessonProgressMap = new Map(lessonProgresses?.map(p => [p.lessonId, p]));
  const unityProgressMap = new Map(unityProgresses?.map(p => [p.unityId, p]));

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Lecciones del Curso</h1>

      <div className="space-y-4">
        {units?.map((unit) => {
          const currentUnityProgress = unityProgressMap.get(unit.id);
          const unityProgressValue = currentUnityProgress?.progress || 0;
          const isUnityCompleted = currentUnityProgress?.isCompleted || false;

          return (
            <Card key={unit.id} className="overflow-hidden">
              <Collapsible
                open={openUnits.includes(unit.id)}
                onOpenChange={() => toggleUnit(unit.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer py-4 px-6 bg-muted/30 hover:bg-muted/50 transition-colors">
                    <CardTitle className="text-xl font-semibold">
                      {unit.title}
                      <span className="ml-2 text-sm text-muted-foreground">({unityProgressValue}%)</span>
                      {isUnityCompleted && <Badge variant="secondary" className="ml-2">Completada</Badge>}
                    </CardTitle>
                    <ChevronDown className={cn("h-5 w-5 transition-transform", openUnits.includes(unit.id) && "rotate-180")} />
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-6 pb-4">
                  <div className="space-y-3 mt-4">
                    {unit.lessons?.map((lesson) => {
                      const currentLessonProgress = lessonProgressMap.get(lesson.id);
                      const lessonProgressValue = currentLessonProgress?.progress || 0;
                      const isLessonCompleted = currentLessonProgress?.isCompleted || false;

                      return (
                        <Card key={lesson.id} className={cn(
                          "flex items-center p-4 border",
                          lesson.isLocked ? "bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : "hover:bg-accent/50 transition-colors"
                        )}>
                          <div className="flex items-center gap-3 flex-grow">
                            {lesson.isLocked ? <Lock className="h-5 w-5 text-gray-400" /> : getLessonIcon(lesson)}
                            <div className="flex-grow">
                              <h3 className="font-medium text-base">{lesson.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mt-1">
                                <Progress value={lessonProgressValue} className="h-1.5 w-24 mr-2" />
                                <span>{lessonProgressValue}%</span>
                                {isLessonCompleted && (
                                  <Badge variant="secondary" className="ml-2">Completada</Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button asChild disabled={lesson.isLocked} variant="outline">
                            <Link to={`/learn/lesson/${lesson.id}`}>
                              {lesson.isLocked ? "Bloqueada" : (isLessonCompleted ? "Completada" : (lessonProgressValue > 0 ? "Continuar" : "Iniciar"))}
                            </Link>
                          </Button>
                        </Card>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LessonsPage;
