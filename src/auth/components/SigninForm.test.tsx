import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignInForm from './SigninForm';
import { AuthContext } from '../context/authContext';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import { vi, Mock } from 'vitest'; // Import Mock

// Mock the hooks
vi.mock('@/hooks/useFormValidation');
vi.mock('../../auth/hooks/useAuth');
vi.mock('react-i18next');

// Import the mocked hooks after mocking
import useFormValidation from '@/hooks/useFormValidation';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';


describe('SignInForm Component', () => {
  const mockUseFormValidation = useFormValidation as Mock; // Use Mock
  const mockUseAuth = useAuth as Mock; // Use Mock
  const mockUseTranslation = useTranslation as Mock; // Use Mock

  // Mock translation function
  const t = vi.fn((key) => key);
  mockUseTranslation.mockReturnValue({ t });

  beforeEach(() => {
    // Reset mocks before each test
    mockUseFormValidation.mockReset();
    mockUseAuth.mockReset();
    t.mockClear();

    // Default mock implementation for useFormValidation
    mockUseFormValidation.mockReturnValue({
      values: {
        identifier: '',
        password: '',
      },
      errors: {},
      isValid: true,
      handleChange: vi.fn((e) => {
        const { name, value } = e.target;
        // Update the mock return value to simulate state change
        mockUseFormValidation.mockReturnValue({
          ...mockUseFormValidation(), // Keep other mocked properties
          values: {
            ...mockUseFormValidation().values,
            [name]: value,
          },
        });
      }),
      handleSubmit: vi.fn(() => (event: React.FormEvent) => {
        event.preventDefault();
        // Simulate validation success by default
        return { isValid: true };
      }),
      setErrors: vi.fn(),
    });

    // Default mock implementation for useAuth
    mockUseAuth.mockReturnValue({
      signingIn: false,
      signin: vi.fn(),
    });
  });

  it('renders the form with identifier and password fields', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthContext.Provider value={mockUseAuth()}> {/* Pass the full mocked context value */}
            <SignInForm />
          </AuthContext.Provider>
        </BrowserRouter>
      </I18nextProvider>
    );

    expect(screen.getByLabelText(/Correo electrónico o nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Iniciar sesión/i })).toBeInTheDocument();
  });

  it('calls the signin function with the correct data when the form is submitted', async () => {
    const mockSignin = vi.fn();
    mockUseAuth.mockReturnValue({
      signingIn: false,
      signin: mockSignin,
    });

    // Mock useFormValidation to return valid data for submission
    mockUseFormValidation.mockReturnValue({
      values: {
        identifier: 'test@example.com',
        password: 'password123',
      },
      errors: {},
      isValid: true,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(() => async (event: React.FormEvent) => {
        event.preventDefault();
        // Simulate validation success and call the mock signin
        const formIsValid = true; // Assume valid for this test
        if (formIsValid) {
          await mockSignin({
             identifier: 'test@example.com',
             password: 'password123',
           });
        }
        return { isValid: formIsValid };
      }),
      setErrors: vi.fn(),
    });


    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthContext.Provider value={mockUseAuth()}> {/* Pass the full mocked context value */}
            <SignInForm />
          </AuthContext.Provider>
        </BrowserRouter>
      </I18nextProvider>
    );

    const signinButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    fireEvent.click(signinButton);

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        identifier: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('displays validation errors when the form is submitted with invalid data', async () => {
    // Mock useFormValidation to return invalid data and errors
    mockUseFormValidation.mockReturnValue({
      values: {
        identifier: '', // Invalid identifier
        password: '', // Invalid password
      },
      errors: {
        identifier: 'auth.signin.validation.identifier.required',
        password: 'auth.signin.validation.password.required',
      },
      isValid: false, // Form is invalid
      handleChange: vi.fn(),
      handleSubmit: vi.fn(() => (event: React.FormEvent) => {
        event.preventDefault();
        // Simulate failed validation
        return { isValid: false };
      }),
      setErrors: vi.fn(),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthContext.Provider value={mockUseAuth()}> {/* Pass the full mocked context value */}
            <SignInForm />
          </AuthContext.Provider>
        </BrowserRouter>
      </I18nextProvider>
    );

    const signinButton = screen.getByRole('button', { name: /Iniciar sesión/i });

    fireEvent.click(signinButton);

    await waitFor(() => {
      expect(screen.getByText(/El usuario\/correo electrónico es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/La contraseña es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button when signingIn is true', async () => {
    mockUseAuth.mockReturnValue({
      signingIn: true, // Signing in is true
      signin: vi.fn(),
    });

    // Mock useFormValidation to return valid data for submission
    mockUseFormValidation.mockReturnValue({
      values: {
        identifier: 'test@example.com',
        password: 'password123',
      },
      errors: {},
      isValid: true,
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <AuthContext.Provider value={mockUseAuth()}> {/* Pass the full mocked context value */}
            <SignInForm />
          </AuthContext.Provider>
        </BrowserRouter>
      </I18nextProvider>
    );

    const signinButton = screen.getByRole('button', { name: /Iniciar sesión/i });
    expect(signinButton).toBeDisabled();
    // Assuming Loading component has data-testid="loading"
    // expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
