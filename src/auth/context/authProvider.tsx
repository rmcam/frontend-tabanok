import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import useAuthService from '../hooks/useAuthService';
import { SigninData, SignupData, User } from '../types/authTypes';
import { AuthContext } from './authContext';

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (type === 'success') {
    toast.success(message);
  } else if (type === 'error') {
    toast.error(message);
  } else {
    toast.info(message);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [requestingPasswordReset, setRequestingPasswordReset] = useState(false);

  const {
    handleSignup: signupService,
    handleSignin: signinService,
    handleForgotPassword: forgotPasswordService,
    handleSignout: signoutService,
    verifySession: verifySessionService,
  } = useAuthService();

  const signout = useCallback(async () => {
    try {
      await signoutService();
      setUser(null);
      showToast('Sesión cerrada exitosamente.', 'success');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Error al cerrar sesión. Por favor, inténtalo de nuevo.';
      showToast(errorMessage, 'error');
      throw error;
    }
  }, [signoutService]);

  // Efecto para verificar la sesión al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticatedUser = await verifySessionService();
        setUser(authenticatedUser);
      } catch (error) {
        console.error('Error checking authentication session:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [verifySessionService]); // Dependencia: verifySessionService

  const signup = async (data: SignupData) => {
    setSigningUp(true);
    try {
      await signupService({
        email: data.email,
        password: data.password,
        username: data.username,
        firstName: data.firstName,
        secondName: data.secondName,
        firstLastName: data.firstLastName,
        secondLastName: data.secondLastName,
      });
      // Después de un registro exitoso, verificar la sesión para obtener los datos del usuario
      const authenticatedUser = await verifySessionService();
      setUser(authenticatedUser);
      showToast('Registro exitoso. ¡Bienvenido!', 'success');
    } catch (error) {
      console.error('Error al registrarse:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Error al registrarse. Por favor, inténtalo de nuevo.';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setSigningUp(false);
    }
  };

  const signin = async (data: SigninData) => {
    setSigningIn(true);
    try {
      await signinService(data);
      // Después de un inicio de sesión exitoso, verificar la sesión para obtener los datos del usuario
      const authenticatedUser = await verifySessionService();
      setUser(authenticatedUser);
      showToast('Inicio de sesión exitoso.', 'success');
    } catch (error: unknown) {
      console.error('Error al iniciar sesión:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Error al iniciar sesión. Por favor, inténtalo de nuevo.';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setSigningIn(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setRequestingPasswordReset(true);
    try {
      await forgotPasswordService(email);
      showToast('Se ha enviado un correo electrónico para restablecer tu contraseña.', 'success');
    } catch (error: unknown) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : 'Error al solicitar el restablecimiento de contraseña. Por favor, inténtalo de nuevo.';
      showToast(errorMessage, 'error');
      throw error;
    } finally {
      setRequestingPasswordReset(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signingIn,
        signingUp,
        requestingPasswordReset,
        signin,
        signup,
        signout,
        forgotPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
