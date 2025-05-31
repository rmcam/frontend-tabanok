import React, { memo } from 'react'; // Importar memo
import type { LearningContent, LearningTopicSectionProps } from '@/types/learning'; // Eliminar LearningTopic
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import LearningContentRenderer from './LearningContentRenderer';
import LearningExerciseItem from './LearningExerciseItem';
import { BookOpen, CheckCircle2, Lock } from 'lucide-react'; // Importar Lock

const LearningTopicSection: React.FC<LearningTopicSectionProps> = memo(({ topic, userProgress, isPreviousTopicCompleted }) => { // Usar memo
  // Determinar si el tópico está bloqueado
  const isLocked = topic.isLocked || !isPreviousTopicCompleted;

  // Calcular el progreso del tópico
  const topicProgress = React.useMemo(() => {
    if (!userProgress) {
      return 0;
    }

    let totalItems = 0;
    let completedItems = 0;

    // Contar progreso de contenidos
    topic.contents?.forEach(contentItem => {
      totalItems++;
      if (userProgress.completedContentIds?.includes(String(contentItem.id))) {
        completedItems++;
      }
    });

    // Contar progreso de ejercicios
    topic.exercises?.forEach(exercise => {
      totalItems++;
      if (userProgress.completedExerciseIds?.includes(exercise.id)) {
        completedItems++;
      }
    });

    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [topic.contents, topic.exercises, userProgress]);

  // Determinar si el tópico está completado
  const isTopicCompleted = topicProgress === 100;

  return (
    <Card className={`shadow-lg ${isTopicCompleted ? 'border-green-500' : isLocked ? 'border-gray-400' : 'border-secondary/20'} ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-secondary-foreground flex items-center">
          {isTopicCompleted && <CheckCircle2 className="mr-2 h-6 w-6 text-green-500" />}
          {isLocked && !isTopicCompleted && <Lock className="mr-2 h-6 w-6 text-gray-500" />}
          {topic.title}
        </CardTitle>
        {topic.description && <p className="text-muted-foreground">{topic.description}</p>}
        {/* Barra de progreso del tópico */}
        <div className="mt-2">
          <Progress value={topicProgress} className="h-2 w-full" />
          <div className="text-xs text-primary font-semibold mt-1">
            Progreso del Tópico: {topicProgress}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {topic.contents && topic.contents.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center text-xl font-semibold text-primary mb-4">
              <BookOpen className="mr-2 h-6 w-6" /> Contenido:
            </div>
            {topic.contents.map((contentItem: LearningContent) => (
              <LearningContentRenderer key={contentItem.id} content={contentItem} userProgress={userProgress} isLocked={isLocked || contentItem.isLocked} />
            ))}
          </div>
        )}

        {topic.exercises && topic.exercises.length > 0 && (
          <div className="space-y-4">
             <div className="flex items-center text-xl font-semibold text-primary mb-4">
              <CheckCircle2 className="mr-2 h-6 w-6" /> Ejercicios:
            </div>
            <div className="space-y-2">
              {topic.exercises.map((exercise) => {
                 const isCompleted = userProgress?.completedExerciseIds?.includes(exercise.id) || false;
                 return (
                   <LearningExerciseItem
                     key={exercise.id}
                     exercise={exercise}
                     isCompleted={isCompleted}
                     isLocked={isLocked || exercise.isLocked} // Pasar isLocked al ejercicio
                   />
                 );
              })}
            </div>
          </div>
        )}

        {(!topic.contents || topic.contents.length === 0) && (!topic.exercises || topic.exercises.length === 0) && (
           <p className="text-muted-foreground italic">No hay contenido ni ejercicios disponibles para este tópico.</p>
        )}
      </CardContent>
    </Card>
  );
});

export default LearningTopicSection;
