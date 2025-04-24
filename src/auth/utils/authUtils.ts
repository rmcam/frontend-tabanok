import { jwtDecode } from 'jwt-decode';
import { User } from '../types/authTypes'; // Importar la interfaz User

// Las funciones de manejo de tokens ahora dependen del backend que establece cookies HttpOnly.
// El frontend ya no guarda ni lee directamente de localStorage.

// Estas funciones son no-operativas ya que el frontend no maneja directamente las cookies HttpOnly.
export const saveToken = (): void => {};
export const getToken = (): string | null => null;
export const removeToken = (): void => {};
export const saveRefreshToken = (): void => {};
export const getRefreshToken = (): string | null => null;
export const removeRefreshToken = (): void => {};

// La lógica de autenticación ahora debe depender del estado del usuario en AuthContext,
// que se actualiza a través del endpoint de verificación de sesión del backend.
// Esta función ya no es útil para determinar el estado de autenticación en el frontend.
export const isAuthenticated = (): boolean => {
  console.warn("isAuthenticated en frontend no puede validar tokens en cookies HttpOnly directamente. Use el estado 'user' del AuthContext.");
  return false;
};

// Esta función solo sería útil si el backend expone un endpoint que devuelve el token
// para que el frontend lo decodifique. Dado el modelo de cookies HttpOnly,
// es probable que esta función no sea necesaria y pueda eliminarse si no hay un caso de uso específico.
// Se mantiene por ahora, pero con la advertencia de su uso limitado.
export const decodeTokenAndCreateUser = (token: string): User => {
  const decoded = jwtDecode<{ id: string; email: string; roles: string[]; firstName: string; secondName: string; firstLastName: string; secondLastName: string; avatar?: string }>(token);
  return {
    id: decoded.id,
    email: decoded.email,
    roles: decoded.roles,
    firstName: decoded.firstName,
    secondName: decoded.secondName,
    firstLastName: decoded.firstLastName,
    secondLastName: decoded.secondName, // Corregido: secondLastName
    avatar: decoded.avatar,
  };
};
