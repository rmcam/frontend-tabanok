import type { Module, Unity, Lesson, Exercise, Multimedia, Content } from './api';

// Definir la interfaz UserProgress directamente aquí
export interface UserProgress {
  completedExerciseIds?: string[];
  completedContentIds?: string[];
}

// Definir tipos para el camino de aprendizaje procesado
export interface LearningExercise extends Exercise {
  url: string;
  isCompleted: boolean;
  isLocked: boolean;
  progress: number; // Añadir progreso al ejercicio
  lessonId: string; // Añadir lessonId para vincular el ejercicio a una lección
}

export interface LearningLesson extends Lesson {
  exercises: LearningExercise[];
  multimedia: Multimedia[]; // Usar Multimedia[] directamente
  topics: LearningTopic[]; // Añadir tópicos a la lección
  url: string;
  isCompleted: boolean;
  progress: number; // Añadir progreso a la lección
}

export interface LearningUnit extends Unity {
  lessons: LearningLesson[]; // Redefinido para usar LearningLesson[]
  topics: LearningTopic[]; // Redefinido para usar LearningTopic[]
  url: string;
  isCompleted: boolean;
  progress: number;
}

// Tipos específicos para el campo 'content' basado en el 'type'
interface TextContentData {
  text: string; // O la estructura exacta para texto/html
}

interface VideoContentData {
  url: string;
  // Posiblemente otras propiedades como thumbnail, duration, etc.
}

interface QuizContentData {
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  exerciseId: string; // Añadir exerciseId para vincular el quiz a un ejercicio
}

// Tipo base para el contenido de aprendizaje
interface BaseLearningContent extends Content {
  id: string | number;
  title: string;
  description?: string;
  multimedia: Multimedia[]; // Multimedia asociada al contenido
  url?: string; // URL para contenido individual si es navegable
  isCompleted: boolean; // Añadir isCompleted al contenido
  isLocked: boolean; // Añadir isLocked al contenido
  progress: number; // Añadir progreso al contenido
}

// Tipos discriminados para LearningContent
export interface LearningTextContent extends BaseLearningContent {
  type: 'text' | 'html';
  content: string; // El contenido es una cadena para texto/html
}

export interface LearningVideoContent extends BaseLearningContent {
  type: 'video' | 'youtube';
  content: VideoContentData; // El contenido es un objeto con URL para video
}

export interface LearningQuizContent extends BaseLearningContent {
  type: 'quiz';
  content: QuizContentData; // El contenido es un objeto con datos del quiz
}

export interface LearningImageContent extends BaseLearningContent {
  type: 'image';
  content: { url: string }; // Asumiendo que el contenido de imagen también tiene una URL
}

// Unión de todos los tipos de contenido posibles
export type LearningContent =
  | LearningTextContent
  | LearningVideoContent
  | LearningQuizContent
  | LearningImageContent
  | BaseLearningContent; // Incluir BaseLearningContent para tipos desconocidos o futuros

export interface LearningTopic extends Topic {
  id: string; // Añadido explícitamente
  title: string; // Añadido explícitamente
  description?: string; // Añadido explícitamente
  contents: LearningContent[]; // Usar la unión de tipos de contenido (plural)
  url?: string; // URL para tópico individual si es navegable
  isCompleted: boolean; // Si el tópico está completado (basado en su contenido)
  isLocked: boolean; // Añadir isLocked al tópico
  progress: number; // Progreso del tópico (basado en su contenido)
  exercises: LearningExercise[]; // Añadir ejercicios procesados al tópico
}

// Definir interfaces para las props de los componentes
export interface LearningExerciseItemProps {
  exercise: LearningExercise;
  isCompleted: boolean; // Añadir prop isCompleted
  isLocked?: boolean; // Añadir prop para la lógica de bloqueo
}

export interface LearningContentRendererProps {
  content: LearningContent;
  userProgress?: UserProgress;
  isLocked?: boolean; // Añadir prop para la lógica de bloqueo
}

export interface LearningLessonCardProps {
  lesson: LearningLesson;
  userProgress: UserProgress | undefined;
  isPreviousLessonCompleted?: boolean; // Añadir prop para la lógica de bloqueo
}

export interface LearningTopicSectionProps {
  topic: LearningTopic;
  userProgress?: UserProgress; // Añadir prop userProgress (opcional)
  isPreviousTopicCompleted?: boolean; // Añadir prop para la lógica de bloqueo
}

export interface LearningModule extends Module {
  units: LearningUnit[];
  url: string;
  isCompleted: boolean;
  progress: number;
}
// Forzar actualización de TypeScript
