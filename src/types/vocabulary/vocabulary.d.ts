// src/types/vocabulary/vocabulary.d.ts

/**
 * @interface Vocabulary
 * @description Interfaz para el modelo de vocabulario.
 */
export interface Vocabulary {
  id: string;
  topicId: string;
  wordKamentsa: string;
  wordSpanish: string;
  audioUrl?: string;
  imageUrl?: string;
  // Añadir otros campos relevantes del modelo Vocabulary
}

/**
 * @interface CreateVocabularyDto
 * @description DTO para crear un nuevo vocabulario.
 */
export interface CreateVocabularyDto {
  topicId: string;
  wordKamentsa: string;
  wordSpanish: string;
  audioUrl?: string;
  imageUrl?: string;
}

/**
 * @interface UpdateVocabularyDto
 * @description DTO para actualizar un vocabulario existente.
 */
export interface UpdateVocabularyDto {
  wordKamentsa?: string;
  wordSpanish?: string;
  audioUrl?: string;
  imageUrl?: string;
}
