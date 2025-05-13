import { describe, it, expect, vi, Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from './ProfilePage';
import { useAuth } from '@/auth/hooks/useAuth';
import * as authService from '@/auth/services/authService';

import { User } from '@/auth/types/authTypes';
import { AuthContextType } from '@/auth/context/authContext';

// Mock the useAuth hook
vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn() as Mock<() => AuthContextType>, // Corrected Mock typing
}));

// Mock the authService
vi.mock('@/auth/services/authService', () => ({
  updateProfile: vi.fn() as Mock<typeof authService.updateProfile>, // Corrected Mock typing
}));

describe('ProfilePage', () => {
  const mockUser = {
    id: '1',
    username: 'testuser',
    roles: ['student'],
    email: 'test@example.com',
    firstName: 'Test',
    secondName: 'User',
    firstLastName: 'One',
    secondLastName: 'Two',
  };

  const mockAuthContext = {
    user: mockUser,
    loading: false,
    signingIn: false,
    signingUp: false,
    requestingPasswordReset: false,
    signin: vi.fn(),
    signup: vi.fn(),
    signout: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
    resettingPassword: false,
    refetchUser: vi.fn(),
  };

  it('should render the profile form and initialize inputs with user data when user is authenticated and not loading', () => {
   (useAuth as Mock).mockReturnValue(mockAuthContext); // Use mocked function

   render(<ProfilePage />);

   const firstNameInput = screen.getByLabelText(/Primer Nombre:/i) as HTMLInputElement;
   const secondNameInput = screen.getByLabelText(/Segundo Nombre:/i) as HTMLInputElement;
   const firstLastNameInput = screen.getByLabelText(/Primer Apellido:/i) as HTMLInputElement;
   const secondLastNameInput = screen.getByLabelText(/Segundo Apellido:/i) as HTMLInputElement;
   const usernameInput = screen.getByLabelText(/Nombre de Usuario:/i) as HTMLInputElement;
   const emailInput = screen.getByLabelText(/Correo Electrónico:/i) as HTMLInputElement;
   const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });


   expect(firstNameInput).toBeInTheDocument();
   expect(secondNameInput).toBeInTheDocument();
   expect(firstLastNameInput).toBeInTheDocument();
   expect(secondLastNameInput).toBeInTheDocument();
   expect(usernameInput).toBeInTheDocument();
   expect(emailInput).toBeInTheDocument();
   expect(saveButton).toBeInTheDocument();

   // Verify initial input values
   expect(firstNameInput.value).toBe(mockUser.firstName);
   expect(secondNameInput.value).toBe(mockUser.secondName);
   expect(firstLastNameInput.value).toBe(mockUser.firstLastName);
   expect(secondLastNameInput.value).toBe(mockUser.secondLastName);
   expect(usernameInput.value).toBe(mockUser.username);
   expect(emailInput.value).toBe(mockUser.email);
 });

 it('should display loading state when authentication is loading', () => {
   (useAuth as Mock).mockReturnValue({ ...mockAuthContext, loading: true }); // Use mocked function

   render(<ProfilePage />);

   expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming Loading component has data-testid="loading"
   expect(screen.queryByLabelText(/Primer Nombre:/i)).not.toBeInTheDocument();
 });

 it('should display error message if user is null after loading', () => {
   (useAuth as Mock).mockReturnValue({ ...mockAuthContext, user: null, loading: false }); // Use mocked function

   render(<ProfilePage />);

   expect(screen.getByText('No se pudo cargar la información del usuario.')).toBeInTheDocument();
   expect(screen.queryByLabelText(/Primer Nombre:/i)).not.toBeInTheDocument();
 });

 it('should update state on input change', () => {
   (useAuth as Mock).mockReturnValue(mockAuthContext); // Use mocked function

   render(<ProfilePage />);

   const firstNameInput = screen.getByLabelText(/Primer Nombre:/i) as HTMLInputElement;
   fireEvent.change(firstNameInput, { target: { value: 'Updated Name' } });

   expect(firstNameInput.value).toBe('Updated Name');
 });

 it('should call updateProfile with updated data and refetchUser on form submission success', async () => {
   (useAuth as Mock).mockReturnValue(mockAuthContext); // Use mocked function
   const updatedUserData: User = { ...mockUser, firstName: 'Updated Name' };
   (authService.updateProfile as Mock).mockResolvedValue(updatedUserData); // Use mocked function

   render(<ProfilePage />);

   const firstNameInput = screen.getByLabelText(/Primer Nombre:/i) as HTMLInputElement;
   fireEvent.change(firstNameInput, { target: { value: 'Updated Name' } });

   const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
   fireEvent.click(saveButton);

   expect(screen.getByRole('button', { name: /Guardando.../i })).toBeInTheDocument();
   expect(saveButton).toBeDisabled(); // Check if button is disabled

   await waitFor(() => {
     expect(authService.updateProfile).toHaveBeenCalledWith({ // Check if called with updated values
       firstName: 'Updated Name',
       secondName: mockUser.secondName,
       firstLastName: mockUser.firstLastName,
       secondLastName: mockUser.secondLastName,
       username: mockUser.username,
       email: mockUser.email,
     });
     expect(mockAuthContext.refetchUser).toHaveBeenCalled();
     expect(screen.getByText('Perfil actualizado exitosamente.')).toBeInTheDocument();
     expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
     expect(saveButton).not.toBeDisabled(); // Check if button is re-enabled
   });
 });

 it('should display error message on form submission failure', async () => {
   (useAuth as Mock).mockReturnValue(mockAuthContext); // Use mocked function
   const errorMessage = 'Failed to update profile';
   (authService.updateProfile as Mock).mockRejectedValue(new Error(errorMessage)); // Use mocked function

   render(<ProfilePage />);

   const saveButton = screen.getByRole('button', { name: /Guardar Cambios/i });
   fireEvent.click(saveButton);

   expect(screen.getByRole('button', { name: /Guardando.../i })).toBeInTheDocument();
   expect(saveButton).toBeDisabled(); // Check if button is disabled

   await waitFor(() => {
     // The updateProfile mock is called with the initial mockUser data in this test,
     // as we are not simulating input changes before submission in this specific test case.
     // If we wanted to test submission with changed data on failure, we would add input changes here.
     // For now, we focus on the error handling flow.
     expect(authService.updateProfile).toHaveBeenCalledWith({
        firstName: mockUser.firstName,
        secondName: mockUser.secondName,
        firstLastName: mockUser.firstLastName,
        secondLastName: mockUser.secondLastName,
        username: mockUser.username,
        email: mockUser.email,
     });
     expect(screen.getByText(errorMessage)).toBeInTheDocument();
     expect(screen.getByRole('button', { name: /Guardar Cambios/i })).toBeInTheDocument();
     expect(saveButton).not.toBeDisabled(); // Check if button is re-enabled
   });
 });
});