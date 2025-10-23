import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { useSoundEffect } from '@/hooks/gamification/useSoundEffect'; // Importar el hook de sonido

interface LearningPathNodeProps {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress?: number; // 0-100
  type: 'lesson' | 'unity';
  to: string; // Ruta a la que navegar
  icon?: React.ReactNode; // Icono para el nodo
}

const LearningPathNode: React.FC<LearningPathNodeProps> = ({
  id,
  title,
  description,
  isCompleted,
  isLocked,
  progress = 0,
  type,
  to,
  icon,
}) => {
  const playSound = useSoundEffect();
  const prevIsLockedRef = useRef(isLocked);
  const prevIsCompletedRef = useRef(isCompleted);

  useEffect(() => {
    // Reproducir sonido de desbloqueo si el nodo pasa de bloqueado a desbloqueado
    if (prevIsLockedRef.current && !isLocked) {
      playSound('unlock');
    }
    // Reproducir sonido de completado si el nodo pasa de no completado a completado
    if (!prevIsCompletedRef.current && isCompleted) {
      playSound('correct'); // O un sonido específico para completado
    }

    prevIsLockedRef.current = isLocked;
    prevIsCompletedRef.current = isCompleted;
  }, [isLocked, isCompleted, playSound]);

  const nodeClasses = `
    relative flex flex-col items-center justify-center
    w-24 h-24 rounded-full shadow-lg
    transition-all duration-300 ease-in-out
    ${isLocked
      ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
      : isCompleted
        ? 'bg-green-500 dark:bg-green-700 hover:scale-105 animate-pulse-once' // Animación de pulso al completar
        : 'bg-blue-500 dark:bg-blue-700 hover:scale-105'
    }
    ${!isLocked && !prevIsLockedRef.current && 'animate-fade-in-up'} // Animación de aparición al desbloquear
  `;

  const content = (
    <>
      {icon && <div className="text-3xl mb-1 text-white">{icon}</div>}
      <span className="text-white text-center font-semibold text-sm">{title}</span>
      {type === 'unity' && progress > 0 && (
        <div className="absolute bottom-0 w-full">
          <Progress value={progress} className="h-1 rounded-b-full" />
        </div>
      )}
    </>
  );

  return (
    <div className="relative flex flex-col items-center">
      {isLocked ? (
        <div className={nodeClasses}>
          {content}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
            <span className="text-white text-lg">🔒</span>
          </div>
        </div>
      ) : (
        <Link to={to} className={nodeClasses}>
          {content}
        </Link>
      )}
      <span className="mt-2 text-xs text-gray-600 dark:text-gray-400">{description}</span>
    </div>
  );
};

export default LearningPathNode;
