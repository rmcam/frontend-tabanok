import { describe, it, expect, vi } from 'vitest';
import { fetchData, signIn, signUp, getProfile, updateProfile, changePassword, requestPasswordReset, resetPassword, refreshToken, verifySession, signOut } from './api'; // Importar todas las funciones de API

// Mock global fetch
global.fetch = vi.fn();

describe('API Service', () => {
  it('fetchData should return data on successful request', async () => {
    const mockData = { message: 'Success' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await fetchData('/test-endpoint');
    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/test-endpoint');
  });

  it('fetchData should throw an error on failed request', async () => {
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(fetchData('/test-endpoint')).rejects.toThrow('Error al obtener datos de /test-endpoint: Not Found');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/test-endpoint');
  });

  // Puedes agregar más tests para otros escenarios, como errores de red, etc.

  it('signIn should return data on successful login (httpOnly cookie)', async () => {
    const mockCredentials = { identifier: 'testuser', password: 'password123' };
    const mockResponseData = { message: 'Login successful' }; // No se espera token en el cuerpo
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await signIn(mockCredentials);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockCredentials),
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('signIn should throw an error on failed login (httpOnly cookie)', async () => {
    const mockCredentials = { identifier: 'testuser', password: 'wrongpassword' };
    const mockErrorData = { message: 'Credenciales inválidas' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(signIn(mockCredentials)).rejects.toThrow('Credenciales inválidas');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockCredentials),
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('signUp should return data on successful registration', async () => {
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
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await signUp(mockUserData);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUserData),
    });
  });

  it('signUp should throw an error on failed registration', async () => {
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
    const mockErrorData = { message: 'El usuario ya existe' };
    const mockResponse = {
      ok: false,
      statusText: 'Conflict',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(signUp(mockUserData)).rejects.toThrow('El usuario ya existe');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUserData),
    });
  });

  it('getProfile should return profile data on successful request (httpOnly cookie)', async () => {
    const mockProfileData = { firstName: 'Test', lastName: 'User' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockProfileData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await getProfile();
    expect(data).toEqual(mockProfileData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/profile', {
      method: 'GET',
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('getProfile should throw an error on unauthorized request (httpOnly cookie)', async () => {
    const mockErrorData = { message: 'No autorizado' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(getProfile()).rejects.toThrow('No autorizado');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/profile', {
      method: 'GET',
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('updateProfile should return updated profile data on successful request (httpOnly cookie)', async () => {
    const mockUpdateData = { firstName: 'Updated' };
    const mockResponseData = { firstName: 'Updated', lastName: 'User' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await updateProfile(mockUpdateData);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUpdateData),
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('updateProfile should throw an error on unauthorized update (httpOnly cookie)', async () => {
    const mockUpdateData = { firstName: 'Updated' };
    const mockErrorData = { message: 'No autorizado' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(updateProfile(mockUpdateData)).rejects.toThrow('No autorizado');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUpdateData),
      credentials: 'include', // Verificar que se incluye credentials
    });
  });

  it('changePassword should return success message on successful password change', async () => {
    const mockPasswordData = { currentPassword: 'oldpassword', newPassword: 'newpassword' };
    const mockResponseData = { message: 'Contraseña cambiada exitosamente' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await changePassword(mockPasswordData);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/password/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockPasswordData),
      credentials: 'include',
    });
  });

  it('changePassword should throw an error on incorrect current password', async () => {
    const mockPasswordData = { currentPassword: 'wrongpassword', newPassword: 'newpassword' };
    const mockErrorData = { message: 'Contraseña actual incorrecta' };
    const mockResponse = {
      ok: false,
      statusText: 'Bad Request',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(changePassword(mockPasswordData)).rejects.toThrow('Contraseña actual incorrecta');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/password/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockPasswordData),
      credentials: 'include',
    });
  });

  it('requestPasswordReset should return success message on successful request', async () => {
    const mockEmailData = { email: 'user@example.com' };
    const mockResponseData = { message: 'Correo enviado exitosamente' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await requestPasswordReset(mockEmailData);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/password/reset/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockEmailData),
      credentials: 'include',
    });
  });

  it('requestPasswordReset should throw an error if user not found', async () => {
    const mockEmailData = { email: 'nonexistent@example.com' };
    const mockErrorData = { message: 'Usuario no encontrado' };
    const mockResponse = {
      ok: false,
      statusText: 'Not Found',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(requestPasswordReset(mockEmailData)).rejects.toThrow('Usuario no encontrado');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/password/reset/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockEmailData),
      credentials: 'include',
    });
  });

  it('resetPassword should return success message on successful password reset', async () => {
    const mockResetData = { token: 'valid-token', newPassword: 'newsecurepassword' };
    const mockResponseData = { message: 'Contraseña restablecida exitosamente' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await resetPassword(mockResetData);
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResetData),
      credentials: 'include',
    });
  });

  it('resetPassword should throw an error on invalid or expired token', async () => {
    const mockResetData = { token: 'invalid-token', newPassword: 'newsecurepassword' };
    const mockErrorData = { message: 'Token inválido o expirado' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(resetPassword(mockResetData)).rejects.toThrow('Token inválido o expirado');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockResetData),
      credentials: 'include',
    });
  });

  it('refreshToken should return new tokens on successful refresh', async () => {
    const mockResponseData = { accessToken: 'new-access-token', refreshToken: 'new-refresh-token' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await refreshToken();
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  });

  it('refreshToken should throw an error on invalid or expired refresh token', async () => {
    const mockErrorData = { message: 'Refresh token inválido o expirado' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(refreshToken()).rejects.toThrow('Refresh token inválido o expirado');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/refresh', {
      method: 'POST',
      credentials: 'include',
    });
  });

  it('verifySession should return user data on valid session', async () => {
    const mockUserData = { id: '123', username: 'testuser' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockUserData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await verifySession();
    expect(data).toEqual(mockUserData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/verify-session', {
      method: 'GET',
      credentials: 'include',
    });
  });

  it('verifySession should throw an error on invalid or absent session', async () => {
    const mockErrorData = { message: 'Sesión inválida o ausente' };
    const mockResponse = {
      ok: false,
      statusText: 'Unauthorized',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(verifySession()).rejects.toThrow('Sesión inválida o ausente');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/verify-session', {
      method: 'GET',
      credentials: 'include',
    });
  });

  it('signOut should return success message on successful sign out', async () => {
    const mockResponseData = { message: 'Sesión cerrada exitosamente' };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockResponseData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    const data = await signOut();
    expect(data).toEqual(mockResponseData);
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
  });

  it('signOut should throw an error on failed sign out', async () => {
    const mockErrorData = { message: 'Error al cerrar sesión' };
    const mockResponse = {
      ok: false,
      statusText: 'Internal Server Error',
      json: () => Promise.resolve(mockErrorData),
    } as Response;

    (fetch as vi.Mock).mockResolvedValueOnce(mockResponse);

    await expect(signOut()).rejects.toThrow('Error al cerrar sesión');
    expect(fetch).toHaveBeenCalledWith('http://localhost:8000/auth/signout', {
      method: 'POST',
      credentials: 'include',
    });
  });
});
