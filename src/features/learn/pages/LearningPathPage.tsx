import React from 'react';
import { useLearningPath } from '@/hooks/learning-path/learning-path.hooks';
import LearningPathNode from '@/features/learn/components/LearningPathNode'; // Importar el nuevo componente
import type { Module, Unity, Lesson } from '@/types/api'; // Importar los tipos necesarios
import BookOpenIcon from '@/components/common/BookOpenIcon';
import BookTextIcon from '@/components/common/BookTextIcon';
import LightbulbIcon from '@/components/common/LightbulbIcon';

const LearningPathPage: React.FC = () => {
  const { data: learningPath, isLoading, isError } = useLearningPath();

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-xl">Cargando camino de aprendizaje...</div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-xl text-red-500">Error al cargar el camino de aprendizaje.</div>;
  }

  if (!learningPath || learningPath.modules.length === 0) {
    return <div className="flex justify-center items-center h-screen text-xl">No hay módulos de aprendizaje disponibles.</div>;
  }

  return (
    <div className="container mx-auto p-4 relative">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-900 dark:text-white">Tu Camino de Aprendizaje</h1>
      <div className="flex flex-col items-center space-y-12">
        {learningPath.modules.map((module: Module, moduleIndex: number) => (
          <React.Fragment key={module.id}>
            <div className="w-full text-center mb-6">
              <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">{module.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
            </div>
            <div className="flex flex-col items-center space-y-8">
              {module.unities.map((unity: Unity, unityIndex: number) => (
                <React.Fragment key={unity.id}>
                  <LearningPathNode
                    id={unity.id}
                    title={unity.title}
                    description={`Puntos: ${unity.requiredPoints}`}
                    isCompleted={unity.isCompleted || (unity.progress === 100)}
                    isLocked={unity.isLocked}
                    progress={unity.progress}
                    type="unity"
                    to={`/learn/unit/${unity.id}`}
                    icon={<BookOpenIcon className="w-8 h-8" />}
                  />
                  {unity.lessons && unity.lessons.length > 0 && (
                    <div className="flex flex-col items-center space-y-6 mt-4">
                      {unity.lessons.map((lesson: Lesson, lessonIndex: number) => (
                        <React.Fragment key={lesson.id}>
                          <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-600"></div> {/* Conector */}
                          <LearningPathNode
                            id={lesson.id}
                            title={lesson.title}
                            description={`Puntos: ${lesson.requiredPoints}`}
                            isCompleted={lesson.isCompleted}
                            isLocked={lesson.isLocked}
                            type="lesson"
                            to={`/learn/lesson/${lesson.id}`}
                            icon={<BookTextIcon className="w-6 h-6" />}
                          />
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                  {unityIndex < module.unities.length - 1 && (
                    <div className="w-1 h-16 bg-gray-400 dark:bg-gray-500 rounded-full"></div> // Conector entre unidades
                  )}
                </React.Fragment>
              ))}
            </div>
            {moduleIndex < learningPath.modules.length - 1 && (
              <div className="w-2 h-24 bg-blue-600 dark:bg-blue-400 rounded-full my-8"></div> // Conector entre módulos
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default LearningPathPage;
