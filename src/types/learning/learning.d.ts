// src/types/learning/learning.d.ts

import { Multimedia } from "../multimedia/multimedia.d";

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
  // El progreso se inferirá o se manejará de otra manera en el frontend
  // El tipo de contenido (video, texto, quiz, audio) se inferirá en el frontend
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
 * @interface Exercise
 * @description Interfaz para el modelo de ejercicio.
 */
export interface Exercise {
  id: string;
  title: string; // Añadido 'title'
  description: string; // Añadido 'description'
  type: string; // Ej. 'quiz', 'mission' (según el feedback)
  content: any; // Tipo flexible para el contenido del ejercicio
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  timeLimit?: number; // Añadido según el feedback
  isActive: boolean;
  topicId?: string; // Añadido según el feedback
  topic?: Topic; // Añadido según el feedback
  tags?: string[]; // Añadido según el feedback
  timesCompleted?: number; // Añadido según el feedback
  averageScore?: number; // Añadido según el feedback
  createdAt: string;
  updatedAt: string;
  lesson?: string; // Añadido según el feedback
  progress?: number; // Cambiado a number para consistencia con LearningExercise
  isCompleted?: boolean;
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Exercise
}

/**
 * @interface CreateExerciseDto
 * @description DTO para crear un nuevo ejercicio.
 */
export interface CreateExerciseDto {
  lessonId?: string; // Cambiado de activityId a lessonId, y hecho opcional
  title: string;
  description: string;
  type: string;
  content: any;
  difficulty: "beginner" | "intermediate" | "advanced";
  points: number;
  timeLimit?: number;
  isActive?: boolean;
  topicId?: string;
  tags?: string[];
}

/**
 * @interface UpdateExerciseDto
 * @description DTO para actualizar un ejercicio existente.
 */
export interface UpdateExerciseDto {
  title?: string;
  description?: string;
  type?: string;
  content?: any;
  difficulty?: "beginner" | "intermediate" | "advanced";
  points?: number;
  timeLimit?: number;
  isActive?: boolean;
  topicId?: string;
  tags?: string[];
  isCompleted?: boolean;
  isLocked?: boolean;
}

/**
 * @interface LearningPathDto
 * @description DTO para la ruta de aprendizaje del usuario.
 */
export interface LearningPathDto {
  modules: Module[];
  // Añadir otros campos relevantes
}
