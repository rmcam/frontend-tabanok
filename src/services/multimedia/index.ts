import { apiRequest, API_URL } from '../_shared';
import type { Multimedia } from '../../types/api';

/**
 * Servicio para interactuar con los endpoints de Multimedia.
 */
export const multimediaService = {
  /**
   * Obtiene la URL para descargar un archivo multimedia específico.
   * Esta URL puede ser usada directamente en los atributos `src` de las etiquetas HTML.
   * @param id El ID del archivo multimedia.
   * @returns La URL completa del archivo multimedia.
   */
  getMultimediaFileUrl: (id: string): string => {
    return `${API_URL}/multimedia/${id}/file`;
  },

  /**
   * Obtiene los metadatos de un archivo multimedia específico por su ID.
   * @param id El ID del archivo multimedia.
   * @returns Una promesa que resuelve con los metadatos del archivo multimedia.
   */
  getMultimediaMetadata: async (id: string): Promise<Multimedia> => {
    return apiRequest<Multimedia>('GET', `/multimedia/${id}`);
  },

  // Aunque el prompt no especifica endpoints para crear/actualizar/eliminar multimedia,
  // es común tenerlos. Si se necesitan, se añadirían aquí.
  // Por ejemplo, para subir un archivo:
  /*
  uploadMultimedia: async (file: File): Promise<Multimedia> => {
    const formData = new FormData();
    formData.append('file', file);
    return apiRequest<Multimedia>('POST', '/multimedia/upload', formData, {}, true);
  },
  */
};
