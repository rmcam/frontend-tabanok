/// &lt;reference types="vitest/globals" /&gt;
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { AuthProvider } from './authProvider';
import { AuthContext, AuthContextType } from './authContext';
import useAuthService from '../hooks/useAuthService';
import { toast } from 'sonner';

// Mock the useAuthService hook
vi.mock('../hooks/useAuthService');

// Mock the entire sonner module
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock the sonner toast
const mockedToast = vi.mocked(toast);

// Mock the Navigate component to check for redirection (already mocked in PrivateRoute test, but good to have here if needed)
// vi.mock('react-router-dom', () => ({
//   ...vi.importActual('react-router-dom'), // Use actual react-router-dom for other exports
//   Navigate: vi.fn(({ to }) => <div data-testid="navigate">{to}</div>),
//   useLocation: () => ({ pathname: '/protected' }), // Mock useLocation if needed
// }));

const mockUseAuthService = useAuthService as Mock;

const mockVerifySessionService = vi.fn() as Mock;
const mockSigninService = vi.fn() as Mock;
const mockSignupService = vi.fn() as Mock;
const mockSignoutService = vi.fn() as Mock;
const mockForgotPasswordService = vi.fn() as Mock;
const mockResetPasswordService = vi.fn() as Mock;

describe('AuthProvider', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockVerifySessionService.mockReset();
    mockSigninService.mockReset();
    mockSignupService.mockReset();
    mockSignoutService.mockReset();
    mockForgotPasswordService.mockReset();
    mockResetPasswordService.mockReset();
    (mockedToast.success as Mock).mockReset();
    (mockedToast.error as Mock).mockReset();
    (mockedToast.info as Mock).mockReset();

    mockUseAuthService.mockReturnValue({
      handleSignup: mockSignupService,
      handleSignin: mockSigninService,
      handleForgotPassword: mockForgotPasswordService,
      handleSignout: mockSignoutService,
      verifySession: mockVerifySessionService,
      handleResetPassword: mockResetPasswordService,
    });
  });

  it('should render children and provide auth context', async () => {
    mockVerifySessionService.mockResolvedValue(null); // No user initially

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <div data-testid="auth-context-value">
              {value.user ? value.user.username : 'No user'}
              {value.loading ? ' | Loading' : ''}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for the initial session verification to complete
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));

    const contextValueElement = screen.getByTestId('auth-context-value');
    expect(contextValueElement).toHaveTextContent('No user');
    expect(contextValueElement).not.toHaveTextContent('Loading');
  });

  it('should handle initial loading state', async () => {
    mockVerifySessionService.mockResolvedValue(null); // Simulate loading

    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => (
            <div data-testid="auth-context-value">
              {value.user ? value.user.username : 'No user'}
              {value.loading ? ' | Loading' : ''}
            </div>
          )}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    const contextValueElement = screen.getByTestId('auth-context-value');
    expect(contextValueElement).toHaveTextContent('Loading');

    // Clean up to avoid state update on unmounted component
    // Note: In a real scenario, you might not need this if the test environment handles it.
    // For explicit cleanup in testing-library, you might unmount the component.
  });

  it('should handle successful signin', async () => {
    const mockUser = { id: '123', username: 'testuser', roles: ['user'] };
    mockSigninService.mockResolvedValue(mockUser);
    mockVerifySessionService.mockResolvedValue(null); // Initial session check returns no user

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
                {value.signingIn ? ' | Signing In' : ''}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('auth-context-value')).toHaveTextContent('No user');

    // Trigger signin
    authContextValue.signin({ identifier: 'testuser', password: 'password' });

    // Check signingIn state
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('Signing In'));

    // Wait for signin to complete
    await waitFor(() => expect(mockSigninService).toHaveBeenCalledWith('testuser', 'password'));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('testuser'));
    expect(screen.getByTestId('auth-context-value')).not.toHaveTextContent('Signing In');
    expect(authContextValue.user).toEqual(mockUser);
    expect(mockedToast.success).toHaveBeenCalledWith('Inicio de sesión exitoso');
  });

  it('should handle signin error', async () => {
    const errorMessage = 'Invalid credentials';
    mockSigninService.mockRejectedValue(new Error(errorMessage));
    mockVerifySessionService.mockResolvedValue(null); // Initial session check returns no user

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
                {value.signingIn ? ' | Signing In' : ''}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('auth-context-value')).toHaveTextContent('No user');

    // Trigger signin
    authContextValue.signin({ identifier: 'testuser', password: 'password' });

    // Check signingIn state
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('Signing In'));

    // Wait for signin to complete and handle error
    await waitFor(() => expect(mockSigninService).toHaveBeenCalledWith('testuser', 'password'));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('No user'));
    expect(screen.getByTestId('auth-context-value')).not.toHaveTextContent('Signing In');
    expect(authContextValue.user).toBeNull();
    expect(mockedToast.error).toHaveBeenCalledWith(`Error al iniciar sesión: ${errorMessage}`);
  });

  it('should handle successful signout', async () => {
    const mockUser = { id: '123', username: 'testuser', roles: ['user'] };
    mockVerifySessionService.mockResolvedValue(mockUser); // Initial session check returns a user
    mockSignoutService.mockResolvedValue(undefined);

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check and user to be set
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('testuser'));
    expect(authContextValue.user).toEqual(mockUser);

    // Trigger signout
    authContextValue.signout();

    // Wait for signout to complete and user to be null
    await waitFor(() => expect(mockSignoutService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('No user'));
    expect(authContextValue.user).toBeNull();
    expect(mockedToast.success).toHaveBeenCalledWith('Sesión cerrada exitosamente');
  });

  it('should handle signout error', async () => {
    const mockUser = { id: '123', username: 'testuser', roles: ['user'] };
    const errorMessage = 'Signout failed';
    mockVerifySessionService.mockResolvedValue(mockUser); // Initial session check returns a user
    mockSignoutService.mockRejectedValue(new Error(errorMessage));

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check and user to be set
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('testuser'));
    expect(authContextValue.user).toEqual(mockUser);

    // Trigger signout
    authContextValue.signout();

    // Wait for signout to complete and handle error
    await waitFor(() => expect(mockSignoutService).toHaveBeenCalledTimes(1));
    // User should still be present as signout failed
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('testuser'));
    expect(authContextValue.user).toEqual(mockUser);
    expect(mockedToast.error).toHaveBeenCalledWith(`Error al cerrar sesión: ${errorMessage}`);
  });

  it('should verify session on mount and set user if found', async () => {
    const mockUser = { id: '123', username: 'testuser', roles: ['user'] };
    mockVerifySessionService.mockResolvedValue(mockUser);

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
                {value.loading ? ' | Loading' : ''}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Initial state should be loading
    expect(screen.getByTestId('auth-context-value')).toHaveTextContent('Loading');

    // Wait for session verification to complete and user to be set
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('testuser'));
    expect(screen.getByTestId('auth-context-value')).not.toHaveTextContent('Loading');
    expect(authContextValue.user).toEqual(mockUser);
  });

  it('should verify session on mount and set user to null if not found', async () => {
    mockVerifySessionService.mockResolvedValue(null);

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
                {value.loading ? ' | Loading' : ''}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Initial state should be loading
    expect(screen.getByTestId('auth-context-value')).toHaveTextContent('Loading');

    // Wait for session verification to complete
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('No user'));
    expect(screen.getByTestId('auth-context-value')).not.toHaveTextContent('Loading');
    expect(authContextValue.user).toBeNull();
  });

  it('should handle successful refetchUser', async () => {
    const initialUser = { id: '123', username: 'initialuser', roles: ['user'] };
    const updatedUser = { id: '123', username: 'updateduser', roles: ['admin'] };
    mockVerifySessionService.mockResolvedValue(initialUser); // Initial session check
    mockVerifySessionService.mockResolvedValueOnce(initialUser).mockResolvedValueOnce(updatedUser); // First call for initial, second for refetch

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check and user to be set
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('initialuser'));
    expect(authContextValue.user).toEqual(initialUser);

    // Trigger refetchUser
    authContextValue.refetchUser();

    // Wait for refetch to complete and user to be updated
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(2)); // One for initial, one for refetch
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('updateduser'));
    expect(authContextValue.user).toEqual(updatedUser);
  });

  it('should handle refetchUser error', async () => {
    const initialUser = { id: '123', username: 'initialuser', roles: ['user'] };
    const errorMessage = 'Refetch failed';
    mockVerifySessionService.mockResolvedValueOnce(initialUser).mockRejectedValueOnce(new Error(errorMessage)); // First call for initial, second for refetch error

    let authContextValue: AuthContextType;
    render(
      <AuthProvider>
        <AuthContext.Consumer>
          {(value) => {
            authContextValue = value;
            return (
              <div data-testid="auth-context-value">
                {value.user ? value.user.username : 'No user'}
              </div>
            );
          }}
        </AuthContext.Consumer>
      </AuthProvider>
    );

    // Wait for initial session check and user to be set
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('initialuser'));
    expect(authContextValue.user).toEqual(initialUser);

    // Trigger refetchUser
    authContextValue.refetchUser();

    // Wait for refetch to complete and handle error
    await waitFor(() => expect(mockVerifySessionService).toHaveBeenCalledTimes(2)); // One for initial, one for refetch
    // User should remain the same as refetch failed
    await waitFor(() => expect(screen.getByTestId('auth-context-value')).toHaveTextContent('initialuser'));
    expect(authContextValue.user).toEqual(initialUser);
    expect(mockedToast.error).toHaveBeenCalledWith(`Error al actualizar usuario: ${errorMessage}`);
  });
});