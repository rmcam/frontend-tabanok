import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../context/authContext';

export * from '../types/authTypes';

export const useAuth = () => {
  const context = useContext<AuthContextType | undefined>(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
