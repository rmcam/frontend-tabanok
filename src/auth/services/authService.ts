import { SigninData, User } from '../types/authTypes'; // Importar User

const API_URL = import.meta.env.VITE_API_URL; // Reemplazar con la URL real de tu backend

export interface SignupData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
}

// Función para registrar un nuevo usuario
// Ya no espera tokens en la respuesta, solo confirma el éxito.
export const signup = async (data: SignupData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: data.username,
        firstName: data.firstName,
        secondName: data.secondName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error en el registro. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error en el registro';
      throw new Error(errorMessage);
    }

    // Si la respuesta es OK, el backend ha establecido las cookies HttpOnly.
    // No necesitamos procesar el cuerpo de la respuesta para tokens.
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error en el registro';
    throw new Error(errorMessage);
  }
};

// Función para solicitar el restablecimiento de contraseña
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al solicitar el restablecimiento de contraseña. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al solicitar el restablecimiento de contraseña';
      throw new Error(errorMessage);
    }

    console.log('Correo electrónico de restablecimiento de contraseña enviado');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al solicitar el restablecimiento de contraseña';
    throw new Error(errorMessage);
  }
};

// Función para iniciar sesión
// Ya no espera tokens en la respuesta, solo confirma el éxito.
export const signin = async (data: SigninData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: data.identifier,
        password: data.password,
      }),
      credentials: 'include', // Incluir cookies en la solicitud
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error en el inicio de sesión. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error en el inicio de sesión';
      throw new Error(errorMessage);
    }

    // Si la respuesta es OK, el backend ha establecido las cookies HttpOnly.
    // No necesitamos procesar el cuerpo de la respuesta para tokens.
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error en el inicio de sesión';
    throw new Error(errorMessage);
  }
};

// Función para refrescar el token
// Ya no espera tokens en la respuesta, solo confirma el éxito.
// La solicitud se enviará con la cookie HttpOnly de refresh token.
export const refreshToken = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies en la solicitud
      // No enviar refresh token en el body, se espera que esté en la cookie HttpOnly
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al refrescar el token. Por favor, inicia sesión de nuevo.'
        : errorData.message || 'Error al refrescar el token';
      throw new Error(errorMessage);
    }

    // Si la respuesta es OK, el backend ha establecido las nuevas cookies HttpOnly.
    // No necesitamos procesar el cuerpo de la respuesta para tokens.
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Error al refrescar el token';
    throw new Error(errorMessage);
  }
};

// Función para cerrar sesión
// Llama a un endpoint en el backend que elimina las cookies HttpOnly.
export const signout = async (): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/signout`, {
      method: 'POST', // O el método que use el backend para este endpoint de logout
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies en la solicitud
      // Las cookies HttpOnly se adjuntarán automáticamente por el navegador
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = import.meta.env.NODE_ENV === 'production'
        ? 'Error al cerrar sesión. Por favor, inténtalo de nuevo.'
        : errorData.message || 'Error al cerrar sesión';
      throw new Error(errorMessage);
    }

    // Si la respuesta es OK, el backend ha eliminado las cookies HttpOnly.
  } catch (error: unknown) {
    console.error('Error signing out:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error al cerrar sesión';
    throw new Error(errorMessage);
  }
};


// Nueva función para verificar la sesión actual usando la cookie HttpOnly
export const verifySession = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/verify-session`, {
      method: 'GET', // O el método que use el backend para este endpoint
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies en la solicitud
      // Las cookies HttpOnly se adjuntarán automáticamente por el navegador
    });

    if (!response.ok) {
      // Si la respuesta no es OK (ej. 401 Unauthorized), significa que la sesión no es válida.
      // El backend debería manejar la eliminación de cookies inválidas.
      return null;
    }

    // Si la respuesta es OK, el backend debería devolver los datos del usuario.
    const userData: User = await response.json();
    return userData;

  } catch (error: unknown) {
    console.error('Error verifying session:', error);
    return null; // En caso de error de red u otro, asumimos que la sesión no es válida.
  }
};
