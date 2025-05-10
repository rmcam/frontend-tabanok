// src/types/multimediaTypes.ts

export interface MultimediaItem {
  id: string;
  title: string;
  url: string; // URL del recurso multimedia
  type: 'video' | 'audio' | 'image'; // Tipos de multimedia conocidos
  // Agrega otras propiedades relevantes para un item multimedia
}

// Puedes agregar otros tipos relacionados con multimedia aquí
