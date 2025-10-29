// src/types/language-validation/language-validation.d.ts

/**
 * @interface ValidateTextDto
 * @description DTO para validar texto en Kamëntsá.
 */
export interface ValidateTextDto {
  text: string;
}

/**
 * @interface ValidationResultDto
 * @description DTO para el resultado de la validación de texto.
 */
export interface ValidationResultDto {
  isValid: boolean;
  errors?: string[];
  suggestions?: string[];
}

/**
 * @interface DictionaryEntryDto
 * @description DTO para una entrada del diccionario Kamëntsá.
 */
export interface DictionaryEntryDto {
  id: string;
  wordKamentsa: string;
  wordSpanish: string;
  pronunciation?: string;
  examples?: string[];
  // Añadir otros campos relevantes
}
