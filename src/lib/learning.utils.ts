import type { Unity, Lesson, Exercise, Topic, Content } from '@/types/api';
import type { LearningUnit, LearningLesson, LearningExercise, LearningTopic, LearningContent, UserProgress } from '@/types/learning'; // Importar UserProgress desde types/learning

/**
 * Calculates the completion status and progress for a learning exercise.
 * @param exercise The exercise object.
 * @param userProgress The user's progress data.
 * @param isPreviousCompleted Indica si el elemento de aprendizaje anterior está completado.
 * @returns A LearningExercise object with calculated properties.
 */
export function calculateExerciseProgress(
  exercise: Exercise,
  userProgress: UserProgress,
  isPreviousCompleted: boolean = true // Por defecto, no bloqueado si no se especifica
): LearningExercise {
  const isCompleted = userProgress.completedExerciseIds?.includes(exercise.id) || false;
  const progress = isCompleted ? 100 : 0;
  const url = `/learn/exercise/${exercise.id}`;
  // Un ejercicio está bloqueado si el anterior no está completado O si el propio ejercicio está marcado como bloqueado en la API
  const isLocked = !isPreviousCompleted || (exercise.isLocked ?? false); // Usar nullish coalescing para asegurar boolean

  return {
    ...exercise,
    url,
    isCompleted,
    isLocked,
    progress,
  };
}

/**
 * Calculates the completion status and progress for a learning content item.
 * @param contentItem The content item object.
 * @param userProgress The user's progress data.
 * @param isPreviousCompleted Indica si el elemento de aprendizaje anterior está completado.
 * @returns A LearningContent object with calculated properties.
 */
export function calculateContentProgress(
  contentItem: Content,
  userProgress: UserProgress,
  isPreviousCompleted: boolean = true // Por defecto, no bloqueado si no se especifica
): LearningContent {
  const isCompleted = userProgress.completedContentIds?.includes(String(contentItem.id)) || false;
  const progress = isCompleted ? 100 : 0;
  const url = `/learn/content/${String(contentItem.id)}`;
  // Un contenido está bloqueado si el anterior no está completado O si el propio contenido está marcado como bloqueado en la API
  const isLocked = !isPreviousCompleted || ((contentItem as any).isLocked ?? false); // Usar nullish coalescing

  return {
    ...contentItem,
    url,
    isCompleted,
    isLocked, // Añadir isLocked al contenido
    progress,
    multimedia: (contentItem as any).multimedia || [],
  };
}


/**
 * Calculates the completion status and progress for a learning lesson.
 * @param lesson The lesson object.
 * @param userProgress The user's progress data.
 * @param isPreviousLessonCompleted Indica si la lección anterior está completada.
 * @returns A LearningLesson object with calculated properties.
 */
export function calculateLessonProgress(
  lesson: Lesson,
  userProgress: UserProgress,
  isPreviousLessonCompleted: boolean = true
): LearningLesson {
  let previousExerciseCompleted = true;
  const processedExercises = (lesson.exercises || []).map(exercise => {
    const processed = calculateExerciseProgress(exercise, userProgress, previousExerciseCompleted);
    previousExerciseCompleted = processed.isCompleted; // Actualizar para el siguiente ejercicio
    return processed;
  });

  const completedExercises = processedExercises.filter(ex => ex.isCompleted).length;
  const totalExercises = processedExercises.length;

  const progress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
  const isCompleted = totalExercises > 0 && completedExercises === totalExercises;
  const url = `/learn/lesson/${lesson.id}`;
  // Una lección está bloqueada si la anterior no está completada O si la propia lección está marcada como bloqueada en la API
  const isLocked = !isPreviousLessonCompleted || (lesson.isLocked ?? false); // Usar nullish coalescing

  return {
    ...lesson,
    exercises: processedExercises,
    multimedia: (lesson as any).multimedia || [],
    topics: (lesson as any).topics || [],
    url,
    isCompleted,
    isLocked, // Añadir isLocked a la lección
    progress,
  };
}

/**
 * Calculates the completion status and progress for a learning topic.
 * @param topic The topic object.
 * @param userProgress The user's progress data.
 * @param isPreviousTopicCompleted Indica si el tópico anterior está completado.
 * @returns A LearningTopic object with calculated properties.
 */
export function calculateTopicProgress(
  topic: Topic,
  userProgress: UserProgress,
  isPreviousTopicCompleted: boolean = true
): LearningTopic {
  let previousContentCompleted = true;
  const processedContents = (topic.contents || []).map((contentItem: Content) => {
    const processed = calculateContentProgress(contentItem, userProgress, previousContentCompleted);
    previousContentCompleted = processed.isCompleted; // Actualizar para el siguiente contenido
    return processed;
  });

  let previousExerciseCompleted = true;
  const processedExercises = (topic.exercises || []).map(exercise => {
    const processed = calculateExerciseProgress(exercise, userProgress, previousExerciseCompleted);
    previousExerciseCompleted = processed.isCompleted; // Actualizar para el siguiente ejercicio
    return processed;
  });

  const completedContentItems = processedContents.filter(item => item.isCompleted).length;
  const totalContentItems = processedContents.length;

  const completedExercises = processedExercises.filter(ex => ex.isCompleted).length;
  const totalExercises = processedExercises.length; // Corregido: era topic.exercises.length

  const totalItems = totalContentItems + totalExercises;
  const completedItems = completedContentItems + completedExercises;

  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const isCompleted = totalItems > 0 && completedItems === totalItems;
  const url = `/learn/topic/${topic.id}`;
  // Un tópico está bloqueado si el anterior no está completado O si el propio tópico está marcado como bloqueado en la API
  const isLocked = !isPreviousTopicCompleted || (topic.isLocked ?? false); // Usar nullish coalescing

  return {
    ...topic,
    contents: processedContents,
    exercises: processedExercises,
    url,
    isCompleted,
    isLocked, // Añadir isLocked al tópico
    progress,
  };
}


/**
 * Calculates the completion status and progress for a learning unit.
 * @param unity The unit object.
 * @param userProgress The user's progress data.
 * @param isPreviousUnityCompleted Indica si la unidad anterior está completada.
 * @returns A LearningUnit object with calculated properties.
 */
export function calculateUnityProgress(
  unity: Unity,
  userProgress: UserProgress,
  isPreviousUnityCompleted: boolean = true
): LearningUnit {
  let previousLessonCompleted = true;
  const processedLessons = (unity.lessons || []).map(lesson => {
    const processed = calculateLessonProgress(lesson, userProgress, previousLessonCompleted);
    previousLessonCompleted = processed.isCompleted; // Actualizar para la siguiente lección
    return processed;
  });

  let previousTopicCompleted = true;
  const processedTopics = (unity.topics || []).map(topic => {
    const processed = calculateTopicProgress(topic, userProgress, previousTopicCompleted);
    previousTopicCompleted = processed.isCompleted; // Actualizar para el siguiente tópico
    return processed;
  });

  // Combine progress from lessons and topics/content
  const totalLearningItems = processedLessons.length + processedTopics.length; // Contar lecciones y tópicos como items principales
  const completedLearningItems = processedLessons.filter(lesson => lesson.isCompleted).length + processedTopics.filter(topic => topic.isCompleted).length;

  const progress = totalLearningItems > 0 ? (completedLearningItems / totalLearningItems) * 100 : 0;
  const isCompleted = totalLearningItems > 0 && completedLearningItems === totalLearningItems;
  const url = `/learn/unit/${unity.id}`;
  // Una unidad está bloqueada si la anterior no está completada O si la propia unidad está marcada como bloqueada en la API
  const isLocked = !isPreviousUnityCompleted || (unity.isLocked ?? false); // Usar nullish coalescing

  return {
    ...unity,
    lessons: processedLessons,
    topics: processedTopics,
    url,
    isCompleted,
    isLocked, // Añadir isLocked a la unidad
    progress,
  };
}
