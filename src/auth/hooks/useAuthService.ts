import { useCallback } from 'react'; // Import useCallback
import { signin, signup, forgotPassword, SignupData, verifySession, signout } from '../services/authService'; // Importar verifySession y signout, eliminar refreshToken
import { SigninData, User } from '../types/authTypes'; // Importar User, eliminar AuthResponse
// Eliminar importaciones de authUtils
// import { removeToken, saveToken, saveRefreshToken, removeRefreshToken } from '../utils/authUtils';
// Eliminar importación de toast
// import { toast } from 'sonner';

// Eliminar función showToast
// const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
//   if (type === 'success') {
//     toast.success(message);
//   } else if (type === 'error') {
//     toast.error(message);
//   } else {
//     toast.info(message);
//   }
// };

const useAuthService = () => {
  const handleSignup = useCallback(async (data: SignupData): Promise<void> => { // Cambiar tipo de retorno a Promise<void>
    try {
      await signup({ // Ya no esperamos respuesta con tokens
        email: data.email,
        password: data.password,
        username: data.username, // Usar el username proporcionado
        firstName: data.firstName,
        secondName: data.secondName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
      });
      // El backend establece las cookies HttpOnly
    } catch (error) {
      console.error('Error al registrarse:', error);
      // Los toasts ahora se manejan en AuthContext
      throw error;
    }
  }, []);

  const handleSignin = useCallback(async (data: SigninData): Promise<void> => { // Cambiar tipo de retorno a Promise<void>
    try {
      await signin({ // Ya no esperamos respuesta con tokens
        identifier: data.identifier,
        password: data.password,
      });
      // El backend establece las cookies HttpOnly
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      // Los toasts ahora se manejan en AuthContext
      throw error;
    }
  }, []);

  const handleForgotPassword = useCallback(async (email: string): Promise<void> => { // Mantener tipo de retorno
    try {
      await forgotPassword(email);
      // Los toasts ahora se manejan en AuthContext
    } catch (error: unknown) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      // Los toasts ahora se manejan en AuthContext
      throw error;
    }
  }, []);

  const handleSignout = useCallback(async (): Promise<void> => { // Cambiar tipo de retorno a Promise<void>
    try {
      await signout(); // Llama al endpoint de logout en el backend
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Los toasts ahora se manejan en AuthContext
      throw error;
    }
  }, []);

  const handleVerifySession = useCallback(async (): Promise<User | null> => { // Nueva función para verificar sesión
    try {
      const user = await verifySession();
      return user;
    } catch (error) {
      console.error('Error verifying session:', error);
      throw error;
    }
  }, []);

  return {
    handleSignup,
    handleSignin,
    handleForgotPassword,
    // handleRefreshToken ya no se exporta ni se usa directamente en AuthContext
    handleSignout,
    verifySession: handleVerifySession, // Exportar la nueva función con un nombre más descriptivo para el contexto
  };
};

export default useAuthService;
