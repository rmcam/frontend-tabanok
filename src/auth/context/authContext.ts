import { createContext } from 'react';
import { SigninData, SignupData, User } from '../types/authTypes';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signingUp: boolean;
  requestingPasswordReset: boolean;
  signin: (data: SigninData) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  signout: () => void;
  forgotPassword: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
