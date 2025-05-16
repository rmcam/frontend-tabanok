import { createContext } from 'react';
import { SigninData, SignupData, User } from '../types/authTypes';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signingUp: boolean;
  requestingPasswordReset: boolean;
  signingOut: boolean; // Add signingOut state
  signin: (data: SigninData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  resettingPassword: boolean;
  refetchUser: () => Promise<void>; // Añadir función para refrescar datos del usuario
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
