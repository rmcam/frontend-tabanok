
import { API_URL, handleApiResponse } from '@/services/_shared';
import type { AuthResponse, UserProfile } from '../types/auth';
import type { ApiResponse } from '@/types/api';

export const signIn = async (credentials: { identifier: string; password: string }): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include',
  });
  return handleApiResponse<AuthResponse>(response);
};

export const signUp = async (userData: {
  username: string;
  firstName: string;
  secondName?: string;
  firstLastName: string;
  secondLastName?: string;
  email: string;
  password: string;
  languages: string[];
  preferences: {
    notifications: boolean;
    language: string;
    theme: string;
  };
  role: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleApiResponse<AuthResponse>(response);
};

export const getProfile = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'GET',
    credentials: 'include',
  });
  return handleApiResponse<UserProfile>(response);
};

export const updateProfile = async (profileData: {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  languages?: string[];
  preferences?: {
    notifications?: boolean;
    language?: string;
    theme?: string;
  };
  profile?: {
    bio?: string;
    location?: string;
    interests?: string[];
    community?: string;
  };
}): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData),
    credentials: 'include',
  });
  return handleApiResponse<UserProfile>(response);
};

export const changePassword = async (passwordData: { currentPassword: string; newPassword: string }): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_URL}/auth/password/change`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
    credentials: 'include',
  });
  return handleApiResponse<ApiResponse<null>>(response);
};

export const requestPasswordReset = async (emailData: { email: string }): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_URL}/auth/password/reset/request`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
    credentials: 'include',
  });
  return handleApiResponse<ApiResponse<null>>(response);
};

export const resetPassword = async (resetData: { token: string; newPassword: string }): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(resetData),
    credentials: 'include',
  });
  return handleApiResponse<ApiResponse<null>>(response);
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleApiResponse<AuthResponse>(response);
};

export const verifySession = async (): Promise<UserProfile> => {
  const response = await fetch(`${API_URL}/auth/verify-session`, {
    method: 'GET',
    credentials: 'include',
  });
  return handleApiResponse<UserProfile>(response);
};

export const signOut = async (): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_URL}/auth/signout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleApiResponse<ApiResponse<null>>(response);
};
