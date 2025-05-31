import type {
  ApiResponse,
  ValidateTextDto,
  ValidationResultDto,
} from '../../types/api';

import { apiRequest } from '../_shared';

/**
 * Funciones específicas para los endpoints de validación de lenguaje.
 */
export const languageValidationService = {
  validateText: (textData: ValidateTextDto) =>
    apiRequest<ApiResponse<ValidationResultDto>>('POST', '/language-validation/validate', textData),
};
