import { createContext } from 'react';
import { SigninData, SignupData, User } from '../types/authTypes';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signingIn: boolean;
  signingUp: boolean;
  requestingPasswordReset: boolean;
  signin: (data: SigninData) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  signout: () => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
