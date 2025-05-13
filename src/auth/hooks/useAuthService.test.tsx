import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks'; // Import act
import useAuthService from './useAuthService'; // Asegúrate de que la ruta de importación sea correcta
import { SigninData, SignupData, User } from '../types/authTypes'; // Import necessary types

// Mock del authService
vi.mock('../services/authService', () => ({
  signin: vi.fn(),
  signup: vi.fn(),
  signout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  verifySession: vi.fn(), // Mock verifySession instead of getCurrentUser
}));

describe('useAuthService', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar las funciones del servicio de autenticación', () => {
    const { result } = renderHook(() => useAuthService());

    expect(result.current.handleSignup).toBeDefined();
    expect(result.current.handleSignin).toBeDefined();
    expect(result.current.handleSignout).toBeDefined();
    expect(result.current.handleForgotPassword).toBeDefined();
    expect(result.current.handleResetPassword).toBeDefined();
    expect(result.current.verifySession).toBeDefined();
  });

  it('debería llamar a authService.signin con los argumentos correctos cuando se llama a handleSignin', async () => {
    const mockCredentials: SigninData = { identifier: 'test@example.com', password: 'password123' };
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.handleSignin(mockCredentials);
    });

    expect(authService.signin).toHaveBeenCalledWith(mockCredentials);
  });

  it('debería manejar una respuesta exitosa de authService.signin', async () => {
    const mockCredentials: SigninData = { identifier: 'test@example.com', password: 'password123' };
    const authService = await import('../services/authService');
    vi.mocked(authService.signin).mockResolvedValue(undefined); // signin returns Promise<void>

    const { result } = renderHook(() => useAuthService());

    let response;
    await act(async () => {
      response = await result.current.handleSignin(mockCredentials);
    });

    expect(response).toBeUndefined();
  });

  it('debería manejar un error de authService.signin', async () => {
    const mockCredentials: SigninData = { identifier: 'test@example.com', password: 'password123' };
    const mockError = new Error('Invalid credentials');
    const authService = await import('../services/authService');
    vi.mocked(authService.signin).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.handleSignin(mockCredentials);
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });

  it('debería llamar a authService.signup con los argumentos correctos cuando se llama a handleSignup', async () => {
    const mockUserData: SignupData = { username: 'newuser', email: 'new@example.com', password: 'newpassword', firstName: 'New', secondName: '', firstLastName: 'User', secondLastName: '' };
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.handleSignup(mockUserData);
    });

    expect(authService.signup).toHaveBeenCalledWith(mockUserData);
  });

  it('debería manejar una respuesta exitosa de authService.signup', async () => {
    const mockUserData: SignupData = { username: 'newuser', email: 'new@example.com', password: 'newpassword', firstName: 'New', secondName: '', firstLastName: 'User', secondLastName: '' };
    const authService = await import('../services/authService');
    vi.mocked(authService.signup).mockResolvedValue(undefined); // signup returns Promise<void>

    const { result } = renderHook(() => useAuthService());

    let response;
    await act(async () => {
      response = await result.current.handleSignup(mockUserData);
    });

    expect(response).toBeUndefined();
  });

  it('debería manejar un error de authService.signup', async () => {
    const mockUserData: SignupData = { username: 'newuser', email: 'new@example.com', password: 'newpassword', firstName: 'New', secondName: '', firstLastName: 'User', secondLastName: '' };
    const mockError = new Error('Username already exists');
    const authService = await import('../services/authService');
    vi.mocked(authService.signup).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.handleSignup(mockUserData);
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });

  it('debería llamar a authService.signout cuando se llama a handleSignout', async () => {
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.handleSignout();
    });

    expect(authService.signout).toHaveBeenCalled();
  });

  it('debería manejar una respuesta exitosa de authService.signout', async () => {
    const authService = await import('../services/authService');
    vi.mocked(authService.signout).mockResolvedValue(undefined); // signout returns Promise<void>

    const { result } = renderHook(() => useAuthService());

    let response;
    await act(async () => {
      response = await result.current.handleSignout();
    });

    expect(response).toBeUndefined();
  });

  it('debería manejar un error de authService.signout', async () => {
    const mockError = new Error('Signout failed');
    const authService = await import('../services/authService');
    vi.mocked(authService.signout).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.handleSignout();
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });


  it('debería llamar a authService.forgotPassword con el argumento correcto cuando se llama a handleForgotPassword', async () => {
    const mockEmail = 'test@example.com';
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.handleForgotPassword(mockEmail);
    });

    expect(authService.forgotPassword).toHaveBeenCalledWith(mockEmail);
  });

  it('debería manejar una respuesta exitosa de authService.forgotPassword', async () => {
    const mockEmail = 'test@example.com';
    const authService = await import('../services/authService');
    vi.mocked(authService.forgotPassword).mockResolvedValue(undefined); // forgotPassword returns Promise<void>

    const { result } = renderHook(() => useAuthService());

    let response;
    await act(async () => {
      response = await result.current.handleForgotPassword(mockEmail);
    });

    expect(response).toBeUndefined();
  });

  it('debería manejar un error de authService.forgotPassword', async () => {
    const mockEmail = 'test@example.com';
    const mockError = new Error('Email not found');
    const authService = await import('../services/authService');
    vi.mocked(authService.forgotPassword).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.handleForgotPassword(mockEmail);
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });


  it('debería llamar a authService.resetPassword con los argumentos correctos cuando se llama a handleResetPassword', async () => {
    const mockResetData = { token: 'reset-token', newPassword: 'newpassword123' };
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.handleResetPassword(mockResetData.token, mockResetData.newPassword); // Pass token and newPassword separately
    });

    expect(authService.resetPassword).toHaveBeenCalledWith(mockResetData.token, mockResetData.newPassword);
  });

  it('debería manejar una respuesta exitosa de authService.resetPassword', async () => {
    const mockResetData = { token: 'reset-token', newPassword: 'newpassword123' };
    const authService = await import('../services/authService');
    vi.mocked(authService.resetPassword).mockResolvedValue(undefined); // resetPassword returns Promise<void>

    const { result } = renderHook(() => useAuthService());

    let response;
    await act(async () => {
      response = await result.current.handleResetPassword(mockResetData.token, mockResetData.newPassword);
    });

    expect(response).toBeUndefined();
  });

  it('debería manejar un error de authService.resetPassword', async () => {
    const mockResetData = { token: 'reset-token', newPassword: 'newpassword123' };
    const mockError = new Error('Invalid token');
    const authService = await import('../services/authService');
    vi.mocked(authService.resetPassword).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.handleResetPassword(mockResetData.token, mockResetData.newPassword);
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });


  it('debería llamar a authService.verifySession cuando se llama a verifySession', async () => {
    const authService = await import('../services/authService');
    const { result } = renderHook(() => useAuthService());

    await act(async () => {
      await result.current.verifySession();
    });

    expect(authService.verifySession).toHaveBeenCalled();
  });

  it('debería manejar una respuesta exitosa de authService.verifySession con usuario', async () => {
    const mockUser: User = { id: '1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' };
    const authService = await import('../services/authService');
    vi.mocked(authService.verifySession).mockResolvedValue(mockUser); // verifySession returns Promise<User | null>

    const { result } = renderHook(() => useAuthService());

    let user;
    await act(async () => {
      user = await result.current.verifySession();
    });

    expect(user).toEqual(mockUser);
  });

  it('debería manejar una respuesta exitosa de authService.verifySession sin usuario', async () => {
    const authService = await import('../services/authService');
    vi.mocked(authService.verifySession).mockResolvedValue(null); // verifySession returns Promise<User | null>

    const { result } = renderHook(() => useAuthService());

    let user;
    await act(async () => {
      user = await result.current.verifySession();
    });

    expect(user).toBeNull();
  });

  it('debería manejar un error de authService.verifySession', async () => {
    const mockError = new Error('Verification failed');
    const authService = await import('../services/authService');
    vi.mocked(authService.verifySession).mockRejectedValue(mockError);

    const { result } = renderHook(() => useAuthService());

    let error;
    try {
      await act(async () => {
        await result.current.verifySession();
      });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual(mockError);
  });
});