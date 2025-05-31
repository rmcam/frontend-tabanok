import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { usersService } from '../../services/users/users.service';
import { ApiError } from '../../services/_shared';
import type {
  ApiResponse,
  User,
  UserProfile, // Importar UserProfile
  CreateUserDto,
  UpdateUserDto,
} from '../../types/api';

/**
 * Hooks para los endpoints de usuarios.
 */
export const useAllUsers = () => {
  return useQuery<User[], ApiError>({
    queryKey: ['users'],
    queryFn: async () => (await usersService.getAllUsers()).data,
  });
};

export const useUserById = (id: string) => {
  return useQuery<UserProfile, ApiError>({ // Cambiar a UserProfile
    queryKey: ['users', id],
    queryFn: async () => await usersService.getUserById(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<User>, ApiError, CreateUserDto>({
    mutationFn: usersService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error.message, error.details);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<User>, ApiError, { id: string, userData: UpdateUserDto }>({
    mutationFn: ({ id, userData }) => usersService.updateUser(id, userData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success(data.message || 'Usuario actualizado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', error.message, error.details);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<void>, ApiError, string>({
    mutationFn: usersService.deleteUser,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['users', id] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario eliminado exitosamente.');
    },
    onError: (error) => {
      console.error('Error al eliminar usuario:', error.message, error.details);
    },
  });
};
