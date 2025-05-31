import type {
  ApiResponse,
  Multimedia,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de multimedia.
 */
export const multimediaService = {
  uploadFile: (file: FormData) =>
    apiRequest<ApiResponse<Multimedia>>('POST', '/multimedia/upload', file, { 'Content-Type': 'multipart/form-data' }),
  getAllMultimedia: () =>
    apiRequest<ApiResponse<Multimedia[]>>('GET', '/multimedia'),
  getMultimediaById: (id: string) =>
    apiRequest<ApiResponse<Multimedia>>('GET', `/multimedia/${id}`),
  deleteMultimedia: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/multimedia/${id}`),
  getMultimediaFile: (id: string) =>
    apiRequest<Blob>('GET', `/multimedia/${id}/file`), // Asumiendo que devuelve un Blob para archivos
};
