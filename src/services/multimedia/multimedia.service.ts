import type {
  ApiResponse,
} from '../../types/common/common.d';
import type {
  Multimedia,
  MultimediaQueryParams,
} from '../../types/multimedia/multimedia.d';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de multimedia.
 */
export const multimediaService = {
  uploadFile: (file: FormData) =>
    apiRequest<ApiResponse<Multimedia>>('POST', '/multimedia/upload', file, { 'Content-Type': 'multipart/form-data' }),
  getAllMultimedia: (params?: MultimediaQueryParams) =>
    apiRequest<ApiResponse<Multimedia[]>>('GET', '/multimedia', params),
  getMultimediaById: (id: string) =>
    apiRequest<ApiResponse<Multimedia>>('GET', `/multimedia/${id}`),
  deleteMultimedia: (id: string) =>
    apiRequest<ApiResponse<void>>('DELETE', `/multimedia/${id}`),
  getMultimediaFile: (id: string) =>
    apiRequest<ApiResponse<Blob>>('GET', `/multimedia/${id}/file`), // Devuelve ApiResponse<Blob>
};
