import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Assuming PrivateRoute is the default export
import { AuthContext, AuthContextType } from '../../auth/context/authContext'; // Import AuthContextType from authContext

// Mock the Navigate component to check for redirection
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Navigate: vi.fn(({ to }) => <div data-testid="navigate">{to}</div>),
  useLocation: () => ({ pathname: '/protected' }), // Mock useLocation
}));

describe('PrivateRoute', () => {
  it('should render the component if the user is authenticated', () => {
    const mockAuthContext: AuthContextType = {
      user: { id: '1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' }, // Mock user data
      loading: false, // User is not loading
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(), // Añadir mock para refetchUser
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should redirect to the login page if the user is not authenticated', () => {
    const mockAuthContext: AuthContextType = {
      user: null, // User is not authenticated
      loading: false, // User is not loading
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(), // Añadir mock para refetchUser
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveTextContent('/'); // Redirects to home for unauthenticated
  });

  it('should render the component if the user has the required role', () => {
    const mockAuthContext: AuthContextType = {
      user: { id: '1', username: 'testuser', roles: ['teacher'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' }, // Mock user with teacher role
      loading: false,
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(), // Añadir mock para refetchUser
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute requiredRoles={['teacher']}>
            <div>Teacher Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Teacher Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should redirect to unauthorized page if the user does not have the required role', () => {
    const mockAuthContext: AuthContextType = {
      user: { id: '1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' }, // Mock user with student role
      loading: false,
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(), // Añadir mock para refetchUser
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute requiredRoles={['teacher']}>
            <div>Teacher Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.queryByText('Teacher Content')).not.toBeInTheDocument();
    expect(screen.getByTestId('navigate')).toHaveTextContent('/unauthorized');
  });

  it('should show loading state if authentication is loading', () => {
    const mockAuthContext: AuthContextType = {
      user: null,
      loading: true, // Authentication is loading
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(), // Añadir mock para refetchUser
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute>
            <div>Protected Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    // Assuming there's a test id or text for the Loading component
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should show loading state if authentication is loading and required roles are specified', () => {
    const mockAuthContext: AuthContextType = {
      user: null,
      loading: true, // Authentication is loading
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute requiredRoles={['admin']}> {/* Required roles specified */}
            <div>Protected Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    // Assuming there's a test id or text for the Loading component
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('should render the component if requiredRoles is an empty array and user is authenticated', () => {
    const mockAuthContext: AuthContextType = {
      user: { id: '1', username: 'testuser', roles: ['student'], email: 'test@example.com', firstName: 'Test', secondName: '', firstLastName: 'User', secondLastName: '' }, // Mock authenticated user
      loading: false,
      signingIn: false,
      signingUp: false,
      requestingPasswordReset: false,
      signin: vi.fn(),
      signup: vi.fn(),
      signout: vi.fn(),
      forgotPassword: vi.fn(),
      resetPassword: vi.fn(),
      resettingPassword: false,
      refetchUser: vi.fn(),
    };

    render(
      <AuthContext.Provider value={mockAuthContext}>
        <Router>
          <PrivateRoute requiredRoles={[]}> {/* Empty requiredRoles array */}
            <div>Protected Content</div>
          </PrivateRoute>
        </Router>
      </AuthContext.Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
