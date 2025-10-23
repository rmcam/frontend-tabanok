import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authService } from '../../services/auth/auth.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserProfile,
  PasswordChangeRequest,
  PasswordResetRequest,
  ResetPasswordRequest,
  TokenRefreshResponse,
} from '../../types/api';

// Hook para iniciar sesión
export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LoginResponse>, ApiError, LoginRequest>({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success(data.message || 'Inicio de sesión exitoso.');
    },
    onError: (error) => {
      console.error('Error al iniciar sesión:', error.message, error.details);
    },
  });
};

// Hook para registrar un nuevo usuario
export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<LoginResponse>, ApiError, RegisterRequest>({
    mutationFn: authService.register,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success(data.message || 'Registro exitoso.');
    },
    onError: (error) => {
      console.error('Error al registrar usuario:', error.message, error.details);
    },
  });
};

// Hook para obtener el perfil del usuario
export const useProfile = (options?: { enabled?: boolean }) => {
  return useQuery<UserProfile, ApiError>({
    queryKey: ['userProfile'],
    queryFn: async () => await authService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: options?.enabled, // Habilitar/deshabilitar la consulta condicionalmente
  });
};

// Hook para actualizar el perfil del usuario
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, ApiError, Partial<UserProfile>>({ // Cambiar ApiResponse<UserProfile> a UserProfile
    mutationFn: authService.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data); // data ya es UserProfile
      toast.success('Perfil actualizado exitosamente.'); // message ya no está en data
    },
    onError: (error) => {
      console.error('Error al actualizar perfil:', error.message, error.details);
    },
  });
};

// Hook para cambiar la contraseña
export const useChangePassword = () => {
  return useMutation<void, ApiError, PasswordChangeRequest>({ // Cambiar ApiResponse<void> a void
    mutationFn: authService.changePassword,
    onSuccess: () => { // data ya no es necesario
      toast.success('Contraseña cambiada exitosamente.');
    },
    onError: (error) => {
      console.error('Error al cambiar contraseña:', error.message, error.details);
    },
  });
};

// Hook para solicitar restablecimiento de contraseña
export const useRequestPasswordReset = () => {
  return useMutation<void, ApiError, PasswordResetRequest>({ // Cambiar ApiResponse<void> a void
    mutationFn: authService.requestPasswordReset,
    onSuccess: () => { // data ya no es necesario
      toast.success('Solicitud de restablecimiento de contraseña enviada.');
    },
    onError: (error) => {
      console.error('Error al solicitar restablecimiento de contraseña:', error.message, error.details);
    },
  });
};

// Hook para restablecer contraseña
export const useResetPassword = () => {
  return useMutation<void, ApiError, ResetPasswordRequest>({ // Cambiar ApiResponse<void> a void
    mutationFn: authService.resetPassword,
    onSuccess: () => { // data ya no es necesario
      toast.success('Contraseña restablecida exitosamente.');
    },
    onError: (error) => {
      console.error('Error al restablecer contraseña:', error.message, error.details);
    },
  });
};

// Hook para renovar token de acceso
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation<TokenRefreshResponse, ApiError, void>({ // Cambiar ApiResponse<TokenRefreshResponse> a TokenRefreshResponse
    mutationFn: authService.refreshToken,
    onSuccess: () => { // data ya no es necesario
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success('Token renovado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al renovar token:', error.message, error.details);
    },
  });
};

// Hook para verificar la sesión actual
export const useVerifySession = (options?: { enabled?: boolean }) => {
  return useQuery<UserProfile, ApiError>({ // Cambiar ApiResponse<UserProfile> a UserProfile
    queryKey: ['userProfile'], // Usar 'userProfile' como queryKey para que se invalide con login/signup
    queryFn: async () => await authService.verifySession(), // Devolver el resultado completo
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled: options?.enabled, // Habilitar/deshabilitar la consulta condicionalmente
  });
};

// Hook para cerrar sesión
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, void>({ // Cambiar ApiResponse<void> a void
    mutationFn: authService.logout,
    onSuccess: () => { // data ya no es necesario
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success('Sesión cerrada exitosamente.');
    },
    onError: (error) => {
      console.error('Error al cerrar sesión:', error.message, error.details);
    },
  });
};
