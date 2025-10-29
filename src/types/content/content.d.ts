// src/types/content/content.d.ts

import { Multimedia } from "../multimedia/multimedia.d";
import { Exercise, Topic } from "../learning/learning.d";

/**
 * @interface Content
 * @description Interfaz para el modelo de contenido de aprendizaje.
 */
export interface Content {
  id: string | number; // string o number según la descripción de la tarea
  title: string;
  description?: string; // Hecho opcional según la descripción de la tarea
  type: string; // Ej: 'text', 'video', 'quiz', etc.
  content?: any; // El contenido real (JSONB). Estructura varía según 'type'.
  unityId: string; // Añadido según la descripción de la tarea
  topicId?: string; // Hecho opcional para permitir contenido no directamente asociado a un tópico
  order?: number; // Hecho opcional según la descripción de la tarea
  categories?: string[]; // Hecho opcional según la descripción de la tarea
  tags?: string[]; // Hecho opcional según la descripción de la tarea
  multimedia: Multimedia[]; // Añadido según la descripción de la tarea
  isLocked?: boolean; // Añadido para la lógica de bloqueo
  // Añadir otros campos relevantes del modelo Content
}

/**
 * @interface CreateContentDto
 * @description DTO para crear un nuevo contenido de aprendizaje.
 */
export interface CreateContentDto {
  title: string;
  description?: string;
  type: string;
  content?: any;
  unityId: string;
  topicId?: string;
  order?: number;
  categories?: string[];
  tags?: string[];
  multimedia?: Multimedia[]; // Opcional al crear, ya que se podría añadir después
}

/**
 * @interface UpdateContentDto
 * @description DTO para actualizar un contenido de aprendizaje existente.
 */
export interface UpdateContentDto {
  title?: string;
  description?: string;
  type?: string;
  content?: any;
  unityId?: string;
  topicId?: string;
  order?: number;
  categories?: string[];
  tags?: string[];
  multimedia?: Multimedia[];
  isLocked?: boolean;
}

/**
 * @interface ContentQueryParams
 * @description Interfaz para los parámetros de consulta al obtener contenido.
 */
export interface ContentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  unityId?: string;
  topicId?: string;
  // Añadir otros parámetros de filtro si son necesarios
}
