import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAuth } from './useAuth'; // Asegúrate de que la ruta de importación sea correcta
import { AuthContext, AuthContextType } from '../context/authContext'; // Importar el contexto de autenticación

// Mock del AuthContext
const mockAuthContextValue: AuthContextType = {
  user: null,
  loading: false,
  signingIn: false,
  signingUp: false,
  requestingPasswordReset: false,
  resettingPassword: false,
  signin: vi.fn(),
  signup: vi.fn(),
  signout: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  refetchUser: vi.fn(),
};

const wrapper = ({ children, contextValue = mockAuthContextValue }: { children: React.ReactNode, contextValue?: AuthContextType }) => (
  <AuthContext.Provider value={contextValue}>
    {children}
  </AuthContext.Provider>
);

describe('useAuth', () => {
  // Limpiar mocks antes de cada test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería retornar el contexto de autenticación', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toEqual(mockAuthContextValue);
  });

  it('debería lanzar un error si no se usa dentro de un AuthProvider', () => {
    // Renderizar el hook sin el proveedor
    const { result } = renderHook(() => useAuth());

    // Esperar que se lance un error
    expect(() => result.current).toThrow('useAuth must be used within an AuthProvider.');
  });

  // Nota: Los tests para signin, signup, signout, etc.
  // deben estar en el archivo de pruebas del AuthProvider o authService, ya que esas funciones
  // se definen y se proporcionan a través del contexto o servicio.
  // Aquí solo testeamos que el hook accede correctamente al contexto.
});