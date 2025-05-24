/// <reference types="vitest/globals" />
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFetchData, useSignIn, useSignUp, useProfile, useUpdateProfile, useChangePassword, useRequestPasswordReset, useResetPassword, useRefreshToken, useVerifySession, useSignOut } from './useApi'; // Importar todos los hooks
import { fetchData, signIn, signUp, getProfile, updateProfile, changePassword, requestPasswordReset, resetPassword, refreshToken, verifySession, signOut } from '../services/api'; // Importar todas las funciones de API

// Mock the API service functions
vi.mock('../services/api', () => ({
  fetchData: vi.fn(),
  signIn: vi.fn(), // Mockear signIn
  signUp: vi.fn(), // Mockear signUp
  getProfile: vi.fn(), // Mockear getProfile
  updateProfile: vi.fn(), // Mockear updateProfile
  changePassword: vi.fn(), // Mockear changePassword
  requestPasswordReset: vi.fn(), // Mockear requestPasswordReset
  resetPassword: vi.fn(), // Mockear resetPassword
  refreshToken: vi.fn(), // Mockear refreshToken
  verifySession: vi.fn(), // Mockear verifySession
  signOut: vi.fn(), // Mockear signOut
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Deshabilitar retries en tests de error
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useApi Hook', () => {
  it('useFetchData should fetch data successfully', async () => {
    const mockData = { message: 'Hook Success' };
    (fetchData as vi.Mock).mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useFetchData('/hook-endpoint', ['hookData']), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
    expect(fetchData).toHaveBeenCalledWith('/hook-endpoint');
  });

  it('useFetchData should handle fetch error', async () => {
    const mockError = new Error('Hook Error');
    (fetchData as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useFetchData('/hook-error', ['hookError']), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(fetchData).toHaveBeenCalledWith('/hook-error');
  });

  it('useSignIn should successfully log in a user', async () => {
    const mockCredentials = { identifier: 'testuser', password: 'password123' };
    const mockResponseData = { token: 'fake-token' };
    (signIn as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useSignIn(), { wrapper });

    result.current.mutate(mockCredentials);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(signIn).toHaveBeenCalledWith(mockCredentials);
  });

  it('useSignIn should handle login error', async () => {
    const mockCredentials = { identifier: 'testuser', password: 'wrongpassword' };
    const mockError = new Error('Credenciales inválidas');
    (signIn as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSignIn(), { wrapper });

    result.current.mutate(mockCredentials);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(signIn).toHaveBeenCalledWith(mockCredentials);
  });

  it('useSignUp should successfully register a user', async () => {
    const mockUserData = {
      username: 'newuser',
      firstName: 'John',
      firstLastName: 'Doe',
      email: 'newuser@example.com',
      password: 'securepassword',
      languages: ['es'],
      preferences: { notifications: true, language: 'es', theme: 'dark' },
      role: 'user',
    };
    const mockResponseData = { message: 'User registered successfully' };
    (signUp as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useSignUp(), { wrapper });

    result.current.mutate(mockUserData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(signUp).toHaveBeenCalledWith(mockUserData);
  });

  it('useSignUp should handle registration error', async () => {
    const mockUserData = {
      username: 'existinguser',
      firstName: 'Jane',
      firstLastName: 'Doe',
      email: 'existing@example.com',
      password: 'securepassword',
      languages: ['en'],
      preferences: { notifications: false, language: 'en', theme: 'light' },
      role: 'user',
    };
    const mockError = new Error('El usuario ya existe');
    (signUp as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSignUp(), { wrapper });

    result.current.mutate(mockUserData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(signUp).toHaveBeenCalledWith(mockUserData);
  });

  it('useProfile should fetch profile data successfully (httpOnly cookie)', async () => {
    const mockProfileData = { firstName: 'Test', lastName: 'User' };
    (getProfile as vi.Mock).mockResolvedValueOnce(mockProfileData);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockProfileData);
    expect(getProfile).toHaveBeenCalled();
  });

  it('useProfile should handle profile fetch error (httpOnly cookie)', async () => {
    const mockError = new Error('No autorizado');
    (getProfile as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useProfile(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(getProfile).toHaveBeenCalled();
  });

  it('useUpdateProfile should successfully update profile data (httpOnly cookie)', async () => {
    const mockUpdateData = { firstName: 'Updated' };
    const mockResponseData = { firstName: 'Updated', lastName: 'User' };
    (updateProfile as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    result.current.mutate(mockUpdateData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(updateProfile).toHaveBeenCalledWith(mockUpdateData);
  });

  it('useUpdateProfile should handle profile update error (httpOnly cookie)', async () => {
    const mockUpdateData = { firstName: 'Updated' };
    const mockError = new Error('No autorizado');
    (updateProfile as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useUpdateProfile(), { wrapper });

    result.current.mutate(mockUpdateData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(updateProfile).toHaveBeenCalledWith(mockUpdateData);
  });

  it('useChangePassword should successfully change password', async () => {
    const mockPasswordData = { currentPassword: 'oldpassword', newPassword: 'newpassword' };
    const mockResponseData = { message: 'Contraseña cambiada exitosamente' };
    (changePassword as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useChangePassword(), { wrapper });

    result.current.mutate(mockPasswordData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(changePassword).toHaveBeenCalledWith(mockPasswordData);
  });

  it('useChangePassword should handle password change error', async () => {
    const mockPasswordData = { currentPassword: 'wrongpassword', newPassword: 'newpassword' };
    const mockError = new Error('Contraseña actual incorrecta');
    (changePassword as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useChangePassword(), { wrapper });

    result.current.mutate(mockPasswordData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(changePassword).toHaveBeenCalledWith(mockPasswordData);
  });

  it('useRequestPasswordReset should successfully request password reset', async () => {
    const mockEmailData = { email: 'user@example.com' };
    const mockResponseData = { message: 'Correo enviado exitosamente' };
    (requestPasswordReset as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useRequestPasswordReset(), { wrapper });

    result.current.mutate(mockEmailData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(requestPasswordReset).toHaveBeenCalledWith(mockEmailData);
  });

  it('useRequestPasswordReset should handle request password reset error', async () => {
    const mockEmailData = { email: 'nonexistent@example.com' };
    const mockError = new Error('Usuario no encontrado');
    (requestPasswordReset as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRequestPasswordReset(), { wrapper });

    result.current.mutate(mockEmailData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(requestPasswordReset).toHaveBeenCalledWith(mockEmailData);
  });

  it('useResetPassword should successfully reset password', async () => {
    const mockResetData = { token: 'valid-token', newPassword: 'newsecurepassword' };
    const mockResponseData = { message: 'Contraseña restablecida exitosamente' };
    (resetPassword as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    result.current.mutate(mockResetData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(resetPassword).toHaveBeenCalledWith(mockResetData);
  });

  it('useResetPassword should handle reset password error', async () => {
    const mockResetData = { token: 'invalid-token', newPassword: 'newsecurepassword' };
    const mockError = new Error('Token inválido o expirado');
    (resetPassword as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    result.current.mutate(mockResetData);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(resetPassword).toHaveBeenCalledWith(mockResetData);
  });

  it('useRefreshToken should successfully refresh token', async () => {
    const mockResponseData = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
    (refreshToken as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useRefreshToken(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(refreshToken).toHaveBeenCalled();
  });

  it('useRefreshToken should handle refresh token error', async () => {
    const mockError = new Error('Refresh token inválido o expirado');
    (refreshToken as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useRefreshToken(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(refreshToken).toHaveBeenCalled();
  });

  it('useVerifySession should fetch user data on valid session', async () => {
    const mockUserData = { id: '123', username: 'testuser' };
    (verifySession as vi.Mock).mockResolvedValueOnce(mockUserData);

    const { result } = renderHook(() => useVerifySession(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockUserData);
    expect(verifySession).toHaveBeenCalled();
  });

  it('useVerifySession should handle invalid or absent session error', async () => {
    const mockError = new Error('Sesión inválida o ausente'); // Mockear un Error

    (verifySession as vi.Mock).mockRejectedValueOnce(mockError); // Usar mockRejectedValueOnce

    const { result } = renderHook(() => useVerifySession(), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError); // Esperar el objeto Error mockeado
    expect(verifySession).toHaveBeenCalled();
  });

  it('useSignOut should successfully sign out a user', async () => {
    const mockResponseData = { message: 'Sesión cerrada exitosamente' };
    (signOut as vi.Mock).mockResolvedValueOnce(mockResponseData);

    const { result } = renderHook(() => useSignOut(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockResponseData);
    expect(signOut).toHaveBeenCalled();
  });

  it('useSignOut should handle sign out error', async () => {
    const mockError = new Error('Error al cerrar sesión');
    (signOut as vi.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useSignOut(), { wrapper });

    result.current.mutate();

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toEqual(mockError);
    expect(signOut).toHaveBeenCalled();
  });
});
