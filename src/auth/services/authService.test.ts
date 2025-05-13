import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'; // Importar Mock
import * as authService from './authService'; // Importar como namespace
import { SigninData, SignupData } from '../types/authTypes';

// Mock global fetch
global.fetch = vi.fn() as Mock; // Tipar fetch con Mock

// Helper function to create a mock response
const createMockResponse = (ok: boolean, data?: any, status = 200) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  return {
    ok,
    json: () => Promise.resolve(data), // Use Promise.resolve for consistency
    status,
  };
};

// Mock the environment variable
const mockApiUrl = 'http://localhost:3000';
vi.stubGlobal('import', {
  meta: {
    env: {
      VITE_API_URL: mockApiUrl,
      NODE_ENV: 'test', // Set NODE_ENV for testing
    },
  },
});


describe('authService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (fetch as Mock).mockReset(); // Usar Mock aquí también
  });

  describe('signup', () => {
    it('should successfully sign up a user', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const signupData: SignupData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        secondName: 'User',
        firstLastName: 'Last',
        secondLastName: 'Name',
      };

      await expect(authService.signup(signupData)).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupData.username,
          firstName: signupData.firstName,
          secondName: signupData.secondName,
          firstLastName: signupData.firstLastName,
          secondLastName: signupData.secondLastName,
          email: signupData.email,
          password: signupData.password,
        }),
      });
    });

    it('should throw an error if signup fails', async () => {
      const errorResponse = { message: 'User already exists' };
      const mockResponse = createMockResponse(false, errorResponse, 400);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const signupData: SignupData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        secondName: 'User',
        firstLastName: 'Last',
        secondLastName: 'Name',
      };

      await expect(authService.signup(signupData)).rejects.toThrow('User already exists');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: signupData.username,
          firstName: signupData.firstName,
          secondName: signupData.secondName,
          firstLastName: signupData.firstLastName,
          secondLastName: signupData.secondLastName,
          email: signupData.email,
          password: signupData.password,
        }),
      });
    });
  });

  describe('signin', () => {
    it('should successfully sign in a user', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const signinData: SigninData = {
        identifier: 'testuser',
        password: 'password123',
      };

      await expect(authService.signin(signinData)).resolves.toBeUndefined(); // Pass the object
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: signinData.identifier,
          password: signinData.password,
        }),
        credentials: 'include',
      });
    });

    it('should throw an error if signin fails', async () => {
      const errorResponse = { message: 'Invalid credentials' };
      const mockResponse = createMockResponse(false, errorResponse, 401);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const signinData: SigninData = {
        identifier: 'testuser',
        password: 'password123',
      };

      await expect(authService.signin(signinData)).rejects.toThrow('Invalid credentials'); // Pass the object
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: signinData.identifier,
          password: signinData.password,
        }),
        credentials: 'include',
      });
    });
  });

  describe('verifySession', () => { // Renamed from getCurrentUser
    it('should return user data if session is valid', async () => {
      const userData = { id: 1, username: 'testuser', email: 'test@example.com' };
      const mockResponse = createMockResponse(true, userData);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const user = await authService.verifySession(); // Use verifySession
      expect(user).toEqual(userData);
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/verify-session`, { // Corrected endpoint
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should return null if session is invalid', async () => {
      const mockResponse = createMockResponse(false, null, 401);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const user = await authService.verifySession(); // Use verifySession
      expect(user).toBeNull();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/verify-session`, { // Corrected endpoint
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });
  });

  describe('signout', () => {
    it('should successfully sign out a user', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      await expect(authService.signout()).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should throw an error if signout fails', async () => {
      const errorResponse = { message: 'Signout failed' };
      const mockResponse = createMockResponse(false, errorResponse, 500);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      await expect(authService.signout()).rejects.toThrow('Signout failed');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });
  });

  // Add tests for forgotPassword, resetPassword, refreshToken, and updateProfile
  describe('forgotPassword', () => {
    it('should successfully request password reset', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const email = 'test@example.com';

      await expect(authService.forgotPassword(email)).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    });

    it('should throw an error if forgot password fails', async () => {
      const errorResponse = { message: 'Email not found' };
      const mockResponse = createMockResponse(false, errorResponse, 404);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const email = 'test@example.com';

      await expect(authService.forgotPassword(email)).rejects.toThrow('Email not found');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const token = 'resettoken123';
      const newPassword = 'newpassword456';

      await expect(authService.resetPassword(token, newPassword)).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
    });

    it('should throw an error if reset password fails', async () => {
      const errorResponse = { message: 'Invalid token' };
      const mockResponse = createMockResponse(false, errorResponse, 400);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const token = 'invalidtoken';
      const newPassword = 'newpassword456';

      await expect(authService.resetPassword(token, newPassword)).rejects.toThrow('Invalid token');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh token', async () => {
      const mockResponse = createMockResponse(true);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      await expect(authService.refreshToken()).resolves.toBeUndefined();
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should throw an error if refresh token fails', async () => {
      const errorResponse = { message: 'Invalid refresh token' };
      const mockResponse = createMockResponse(false, errorResponse, 401);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      await expect(authService.refreshToken()).rejects.toThrow('Invalid refresh token');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });
  });

  describe('updateProfile', () => {
    it('should successfully update user profile', async () => {
      const updatedUserData = { id: 1, username: 'updateduser', email: 'updated@example.com' };
      const mockResponse = createMockResponse(true, updatedUserData);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const profileData = { username: 'updateduser', email: 'updated@example.com' };

      const user = await authService.updateProfile(profileData);
      expect(user).toEqual(updatedUserData);
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/profile`, {
        method: 'PUT', // Assuming PUT based on service code
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
    });

    it('should throw an error if update profile fails', async () => {
      const errorResponse = { message: 'Update failed' };
      const mockResponse = createMockResponse(false, errorResponse, 400);
      (fetch as Mock).mockResolvedValueOnce(mockResponse); // Usar Mock aquí también

      const profileData = { username: 'updateduser' };

      await expect(authService.updateProfile(profileData)).rejects.toThrow('Update failed');
      expect(fetch).toHaveBeenCalledWith(`${mockApiUrl}/auth/profile`, {
        method: 'PUT', // Assuming PUT based on service code
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
        credentials: 'include',
      });
    });
  });
});