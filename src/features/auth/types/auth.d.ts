// src/features/auth/types/auth.d.ts

export interface AuthResponse {
  token?: string; // Si el token se devuelve en el cuerpo (aunque se usa httpOnly cookie)
  user?: UserProfile;
  message: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  languages: string[];
  preferences: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  role: string;
  avatarUrl?: string;
  profile?: {
    bio?: string;
    location?: string;
    interests?: string[];
    community?: string;
  };
}
