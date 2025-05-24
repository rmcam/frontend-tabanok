import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner'; // Importar toast
import { fetchData, ApiError } from '../services/api'; // Importar ApiError
import { signIn, signUp, getProfile, updateProfile, changePassword, requestPasswordReset, resetPassword, refreshToken, verifySession, signOut } from '../features/auth/services/auth';
import type { ApiResponse } from '../types/api';
import type { AuthResponse, UserProfile } from '../features/auth/types/auth'; // Importar tipos con 'type'

// Ejemplo de hook para obtener datos
export const useFetchData = <T>(endpoint: string, queryKey: string[]) => {
  return useQuery<T, ApiError>({ // Tipar el error como ApiError
    queryKey: queryKey,
    queryFn: () => fetchData<T>(endpoint),
  });
};

// Hook para iniciar sesión
export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, ApiError, { identifier: string; password: string }>({ // Tipar el error como ApiError
    mutationFn: signIn,
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
  return useMutation<AuthResponse, ApiError, Parameters<typeof signUp>[0]>({ // Tipar el error como ApiError
    mutationFn: signUp,
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
export const useProfile = () => {
  return useQuery<UserProfile, ApiError>({ // Tipar el error como ApiError
    queryKey: ['userProfile'],
    queryFn: getProfile,
    staleTime: 5 * 60 * 1000, // Los datos se consideran "frescos" por 5 minutos
    gcTime: 10 * 60 * 1000, // Los datos se mantienen en caché por 10 minutos después de que no hay observadores
  });
};

// Hook para actualizar el perfil del usuario
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation<UserProfile, ApiError, Parameters<typeof updateProfile>[0]>({ // Tipar el error como ApiError
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(['userProfile'], data);
      toast.success('Perfil actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar perfil:', error.message, error.details);
    },
  });
};

// Hook para cambiar la contraseña
export const useChangePassword = () => {
  return useMutation<ApiResponse<null>, ApiError, Parameters<typeof changePassword>[0]>({ // Tipar el error como ApiError
    mutationFn: changePassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña cambiada exitosamente.');
    },
    onError: (error) => {
      console.error('Error al cambiar contraseña:', error.message, error.details);
    },
  });
};

// Hook para solicitar restablecimiento de contraseña
export const useRequestPasswordReset = () => {
  return useMutation<ApiResponse<null>, ApiError, Parameters<typeof requestPasswordReset>[0]>({ // Tipar el error como ApiError
    mutationFn: requestPasswordReset,
    onSuccess: (data) => {
      toast.success(data.message || 'Solicitud de restablecimiento de contraseña enviada.');
    },
    onError: (error) => {
      console.error('Error al solicitar restablecimiento de contraseña:', error.message, error.details);
    },
  });
};

// Hook para restablecer contraseña
export const useResetPassword = () => {
  return useMutation<ApiResponse<null>, ApiError, Parameters<typeof resetPassword>[0]>({ // Tipar el error como ApiError
    mutationFn: resetPassword,
    onSuccess: (data) => {
      toast.success(data.message || 'Contraseña restablecida exitosamente.');
    },
    onError: (error) => {
      console.error('Error al restablecer contraseña:', error.message, error.details);
    },
  });
};

// Hook para renovar token de acceso
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation<AuthResponse, ApiError, void>({ // Tipar el error como ApiError
    mutationFn: refreshToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success(data.message || 'Token renovado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al renovar token:', error.message, error.details);
    },
  });
};

// Hook para verificar la sesión actual
export const useVerifySession = () => {
  return useQuery<UserProfile, ApiError>({ // Tipar la respuesta y el error como ApiError
    queryKey: ['verifySession'],
    queryFn: verifySession,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });
};

// Hook para cerrar sesión
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, ApiError, void>({ // Tipar el error como ApiError
    mutationFn: signOut,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
      queryClient.invalidateQueries({ queryKey: ['verifySession'] });
      toast.success(data.message || 'Sesión cerrada exitosamente.');
    },
    onError: (error) => {
      console.error('Error al cerrar sesión:', error.message, error.details);
    },
  });
};
