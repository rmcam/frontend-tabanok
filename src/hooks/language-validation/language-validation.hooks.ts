import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { languageValidationService } from '../../services/language-validation/language-validation.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  ValidateTextDto,
  ValidationResultDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de validación de lenguaje.
 */
export const useValidateText = () => {
  return useMutation<ApiResponse<ValidationResultDto>, ApiError, ValidateTextDto>({
    mutationFn: languageValidationService.validateText,
    onSuccess: (data) => {
      toast.success(data.message || 'Validación de texto completada.');
    },
    onError: (error) => {
      console.error('Error al validar texto:', error.message, error.details);
    },
  });
};
