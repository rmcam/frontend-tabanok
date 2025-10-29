// src/types/learning/learning.d.ts

import { Multimedia } from "../multimedia/multimedia.d";
import { Content } from "../content/content.d"; // Importar Content
export { Content } from "../content/content.d"; // Reexportar Content

/**
 * @interface Module
 * @description Interfaz para el modelo de módulo de aprendizaje.
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  order: number;
  isLocked: boolean;
  points: number;
  progress?: number; // Progreso del módulo (0-100)
  unities?: Unity[]; // Añadir las unidades al módulo
  // Añadir otros campos relevantes del modelo Module
}

/**
 * @interface CreateModuleDto
 * @description DTO para crear un nuevo módulo.
 */
export interface CreateModuleDto {
  name: string;
  description: string;
  order: number;
  points: number;
}

/**
 * @interface UpdateModuleDto
 * @description DTO para actualizar un módulo existente.
 */
export interface UpdateModuleDto {
  name?: string;
  description?: string;
  order?: number;
  isLocked?: boolean;
  points?: number;
}

/**
 * @interface Unity
 * @description Interfaz para el modelo de unidad de aprendizaje.
 */
export interface Unity {
  id: string;
  moduleId: string;
  title: string; // Cambiado de 'name' a 'title'
  description: string;
  level?: string; // Añadir el campo level
  order: number;
  isLocked: boolean;
  requiredPoints: number; // Cambiado de 'points' a 'requiredPoints'
  progress?: number; // Progreso de la unidad (0-100)
  isCompleted?: boolean; // Si la unidad está completada
  icon?: string; // Icono para la unidad (ej. emoji o URL)
  lessons?: Lesson[]; // Añadir las lecciones a la unidad
  topics?: Topic[]; // Añadir tópicos a la unidad
  isActive: boolean; // Añadir isActive a la unidad
  // Añadir otros campos relevantes del modelo Unity
}

/**
 * @interface DetailedUnity
 * @description Interfaz para el modelo de unidad de aprendizaje con tópicos y lecciones anidados, incluyendo ejercicios.
 */

/**
 * @interface CreateUnityDto
 * @description DTO para crear una nueva unidad.
 */
export interface CreateUnityDto {
  moduleId: string;
  name: string;
  description: string;
  order: number;
  points: number;
}

/**
 * @interface UpdateUnityDto
 * @description DTO para actualizar una unidad existente.
 */
export interface UpdateUnityDto {
  name?: string;
  description?: string;
  order?: number;
  isLocked?: boolean;
  points?: number;
}

/**
 * @interface Lesson
 * @description Interfaz para el modelo de lección.
 */
import { Exercise, Multimedia, Topic } from './index'; // Importar Exercise, Multimedia y Topic

export interface Lesson {
  id: string;
  unityId: string;
  title: string; // Cambiado de 'name' a 'title'
  description: string;
  guideContent?: string; // Añadir el campo guideContent
  order: number;
  isLocked: boolean;
  requiredPoints: number; // Cambiado de 'points' a 'requiredPoints'
  isCompleted: boolean;
  isFeatured?: boolean; // Añadido según los datos de ejemplo
  isActive?: boolean; // Añadido según los datos de ejemplo
  createdAt: string; // Añadido según los datos de ejemplo
  updatedAt: string; // Añadido según los datos de ejemplo
  exercises?: Exercise[]; // Añadir ejercicios
  multimedia?: Multimedia[]; // Añadir multimedia
  topics?: Topic[]; // Añadir tópicos
  url?: string; // Añadir URL
  progress?: number; // Añadir progreso
  difficulty?: "easy" | "normal" | "hard"; // Añadir dificultad
}

/**
 * @interface CreateLessonDto
 * @description DTO para crear una nueva lección.
 */
export interface CreateLessonDto {
  unityId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  requiredPoints: number;
}

/**
 * @interface UpdateLessonDto
 * @description DTO para actualizar una lección existente.
 */
export interface UpdateLessonDto {
  title?: string;
  description?: string;
  content?: string;
  order?: number;
  isLocked?: boolean;
  requiredPoints?: number;
  isCompleted?: boolean;
}

/**
 * @interface Topic
 * @description Interfaz para el modelo de tema.
 */
export interface Topic {
  id: string;
  unityId: string; // Añadido para relacionar con la unidad
  title: string; // Cambiado de 'name' a 'title' según la descripción de la tarea
  description?: string; // Hecho opcional según la descripción de la tarea
  order: number; // Añadido según la descripción de la tarea
  isLocked: boolean; // Añadido según la descripción de la tarea
  requiredPoints: number; // Añadido según la descripción de la tarea
  isActive: boolean; // Añadido según la descripción de la tarea
  contents?: Content[]; // Añadir contenidos al tópico
  exercises?: Exercise[]; // Añadir ejercicios al tópico
  // Añadir otros campos relevantes del modelo Topic
}

/**
 * @interface CreateTopicDto
 * @description DTO para crear un nuevo tema.
 */
export interface CreateTopicDto {
  name: string;
  description: string;
}

/**
 * @interface UpdateTopicDto
 * @description DTO para actualizar un tema existente.
 */
export interface UpdateTopicDto {
  name?: string;
  description?: string;
}

/**
 * @interface BaseExercise
 * @description Interfaz base para el modelo de ejercicio.
 */
export interface BaseExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  timeLimit?: number;
  isActive: boolean;
  topicId?: string;
  topic?: Topic;
  tags?: string[];
  timesCompleted?: number;
  averageScore?: number;
  createdAt: string;
  updatedAt: string;
  lesson?: string;
  progress?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
}

/**
 * @interface QuizContent
 * @description Interfaz para el contenido de un ejercicio de tipo quiz.
 */
export interface QuizContent {
  question: string;
  options: string[];
  answer: string;
}

/**
 * @interface QuizExercise
 * @description Interfaz para un ejercicio de tipo quiz.
 */
export interface QuizExercise extends BaseExercise {
  type: "quiz";
  content: QuizContent;
}

/**
 * @interface MatchingContent
 * @description Interfaz para el contenido de un ejercicio de tipo matching.
 */
export interface MatchingContent {
  pairs: { id: string; term: string; match: string }[];
}

/**
 * @interface MatchingExercise
 * @description Interfaz para un ejercicio de tipo matching.
 */
export interface MatchingExercise extends BaseExercise {
  type: "matching";
  content: MatchingContent;
}

/**
 * @interface FillInTheBlankContent
 * @description Interfaz para el contenido de un ejercicio de tipo fill-in-the-blank.
 */
export interface FillInTheBlankContent {
  text: string;
  blanks: { id: string; correctAnswers: string[] }[];
  options?: string[]; // Opcional, para ejercicios con opciones predefinidas
}

/**
 * @interface FillInTheBlankExercise
 * @description Interfaz para un ejercicio de tipo fill-in-the-blank.
 */
export interface FillInTheBlankExercise extends BaseExercise {
  type: "fill-in-the-blank";
  content: FillInTheBlankContent;
}

/**
 * @interface AudioPronunciationContent
 * @description Interfaz para el contenido de un ejercicio de tipo audio-pronunciation.
 */
export interface AudioPronunciationContent {
  text: string; // La frase a pronunciar
  audioUrl: string; // URL del audio de referencia
}

/**
 * @interface AudioPronunciationExercise
 * @description Interfaz para un ejercicio de tipo audio-pronunciation.
 */
export interface AudioPronunciationExercise extends BaseExercise {
  type: "audio-pronunciation";
  content: AudioPronunciationContent;
}

/**
 * @interface TranslationContent
 * @description Interfaz para el contenido de un ejercicio de tipo translation.
 */
export interface TranslationContent {
  sourceText: string; // El texto a traducir
  targetLanguage: string; // El idioma al que se debe traducir (ej. "es", "kmt")
  correctTranslation: string; // La traducción correcta
}

/**
 * @interface TranslationExercise
 * @description Interfaz para un ejercicio de tipo translation.
 */
export interface TranslationExercise extends BaseExercise {
  type: "translation";
  content: TranslationContent;
}

/**
 * @interface FunFactContent
 * @description Interfaz para el contenido de un ejercicio de tipo fun-fact.
 */
export interface FunFactContent {
  fact: string;
  imageUrl?: string; // URL de una imagen relacionada con el dato curioso (opcional)
}

/**
 * @interface FunFactExercise
 * @description Interfaz para un ejercicio de tipo fun-fact.
 */
export interface FunFactExercise extends BaseExercise {
  type: "fun-fact";
  content: FunFactContent;
}

/**
 * @type Exercise
 * @description Tipo unido para todos los ejercicios.
 */
export type Exercise =
  | QuizExercise
  | MatchingExercise
  | FillInTheBlankExercise
  | AudioPronunciationExercise
  | TranslationExercise
  | FunFactExercise;

/**
 * @interface CreateExerciseDto
 * @description DTO para crear un nuevo ejercicio.
 */
export type CreateExerciseDto =
  | Omit<QuizExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string }
  | Omit<MatchingExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string }
  | Omit<FillInTheBlankExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string }
  | Omit<AudioPronunciationExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string }
  | Omit<TranslationExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string }
  | Omit<FunFactExercise, "id" | "createdAt" | "updatedAt" | "topic"> & { lessonId?: string };

/**
 * @interface UpdateExerciseDto
 * @description DTO para actualizar un ejercicio existente.
 */
export type UpdateExerciseDto = Partial<CreateExerciseDto>;

/**
 * @interface LearningPathDto
 * @description DTO para la ruta de aprendizaje del usuario.
 */
export interface LearningPathDto {
  modules: Module[];
  // Añadir otros campos relevantes
}
