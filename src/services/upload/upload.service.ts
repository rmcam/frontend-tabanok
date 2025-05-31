import { apiRequest } from '../_shared';
import type { Multimedia } from '@/types/api'; // Importar Multimedia

export const uploadService = {
  /**
   * Sube un archivo al servidor.
   * @param file El archivo a subir.
   * @returns Una promesa que resuelve con los detalles del archivo multimedia subido.
   */
  uploadFile: async (file: File): Promise<Multimedia> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest<Multimedia>('POST', '/multimedia/upload', formData, {}, true);
    return response;
  },
};
