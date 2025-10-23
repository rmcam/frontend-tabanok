import { useCallback } from 'react';

type SoundEffect = 'correct' | 'incorrect' | 'levelUp' | 'unlock';

const soundMap: Record<SoundEffect, string> = {
  correct: '/sounds/correct.mp3', // Asume que los sonidos están en la carpeta public
  incorrect: '/sounds/incorrect.mp3',
  levelUp: '/sounds/level-up.mp3',
  unlock: '/sounds/unlock.mp3',
};

/**
 * Hook para reproducir efectos de sonido de gamificación.
 * @returns Una función para reproducir un efecto de sonido específico.
 */
export const useSoundEffect = () => {
  const playSound = useCallback((effect: SoundEffect) => {
    const audio = new Audio(soundMap[effect]);
    audio.play().catch(error => console.error("Error al reproducir el sonido:", error));
  }, []);

  return playSound;
};
