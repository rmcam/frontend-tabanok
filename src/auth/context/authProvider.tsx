import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import useAuthService from "../hooks/useAuthService";
import { SigninData, SignupData, User } from "../types/authTypes";
import { AuthContext } from "./authContext";

const showToast = (
  message: string,
  type: "success" | "error" | "info" = "info"
) => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "error") {
    toast.error(message);
  } else {
    toast.info(message);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [signingUp, setSigningUp] = useState(false);
  const [requestingPasswordReset, setRequestingPasswordReset] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false); // New state for password reset

  const {
    handleSignup: signupService,
    handleSignin: signinService,
    handleForgotPassword: forgotPasswordService,
    handleSignout: signoutService,
    verifySession: verifySessionService,
    handleResetPassword: resetPasswordService, // Corrected import name
  } = useAuthService();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const authenticatedUser = await verifySessionService();
        if (authenticatedUser) {
          setUser(authenticatedUser);
        }
      } catch (error) {
        console.error("Error verifying session on mount:", error);
        // Manejar el error según sea necesario
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [verifySessionService]);

  const signout = useCallback(async () => {
    try {
      await signoutService();
      setUser(null);
      showToast("Sesión cerrada exitosamente.", "success");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Error al cerrar sesión. Por favor, inténtalo de nuevo.";
      showToast(errorMessage, "error");
      // No retornar false aquí, ya que el cierre de sesión fallido no debería impedir la limpieza del estado local
    }
  }, [signoutService]);

  const signup = async (data: SignupData) => {
    setSigningUp(true);
    try {
      await signupService(data);
      // Después de un registro exitoso, realizar un inicio de sesión automático
      // para asegurar que las cookies HttpOnly se establezcan correctamente.
      await signin({ identifier: data.email, password: data.password }); // Usar la función signin del AuthProvider
      // La función signin ya llama a verifySessionService y actualiza el estado del usuario.
      showToast("Registro exitoso. ¡Bienvenido!", "success");
    } catch (error) {
      console.error("Error al registrarse:", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Error al registrarse. Por favor, inténtalo de nuevo.";
      showToast(errorMessage, "error");
      // No retornar false aquí, ya que el error ya se maneja con el toast
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
      showToast("Inicio de sesión exitoso.", "success");
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Error al iniciar sesión. Por favor, inténtalo de nuevo.";
      showToast(errorMessage, "error");
      // No retornar false aquí, ya que el error ya se maneja con el toast
    } finally {
      setSigningIn(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setRequestingPasswordReset(true);
    try {
      await forgotPasswordService(email);
      showToast(
        "Se ha enviado un correo electrónico para restablecer tu contraseña.",
        "success"
      );
    } catch (error: unknown) {
      console.error(
        "Error al solicitar el restablecimiento de contraseña:",
        error
      );
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Error al solicitar el restablecimiento de contraseña. Por favor, inténtalo de nuevo.";
      showToast(errorMessage, "error");
      // No retornar false aquí, ya que el error ya se maneja con el toast
    } finally {
      setRequestingPasswordReset(false);
    }
  };

  // New function to handle password reset
  const resetPassword = async (token: string, newPassword: string) => {
    setResettingPassword(true);
    try {
      await resetPasswordService(token, newPassword);
      showToast("Contraseña restablecida exitosamente.", "success");
    } catch (error: unknown) {
      console.error("Error al restablecer contraseña:", error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Error al restablecer contraseña. Por favor, inténtalo de nuevo.";
      showToast(errorMessage, "error");
      // No retornar false aquí, ya que el error ya se maneja con el toast
    } finally {
      setResettingPassword(false);
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
        resettingPassword, // Include new state
        signin,
        signup,
        signout,
        forgotPassword,
        resetPassword, // Include new function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
