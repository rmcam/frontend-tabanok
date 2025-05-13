import { describe, it, expect, vi, Mock } from 'vitest'; // Import Mock
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpForm from './SignupForm';
import useFormValidation from '@/hooks/useFormValidation';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';

// Mock the hooks
vi.mock('@/hooks/useFormValidation');
vi.mock('../../auth/hooks/useAuth');
vi.mock('react-i18next');

describe('SignUpForm', () => {
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
        email: '',
        password: '',
        username: '',
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
      },
      errors: {},
      isValid: true,
      handleChange: vi.fn((e) => {
        const { name, value } = e.target;
        mockUseFormValidation.mockImplementationOnce(() => ({
          ...mockUseFormValidation().values,
          [name]: value,
        }));
      }),
      handleSubmit: vi.fn(() => (event: React.FormEvent) => {
        event.preventDefault();
        // Simplified mock for handleSubmit in default implementation
        return { isValid: true };
      }),
      setErrors: vi.fn(),
      resetForm: vi.fn(), // Add resetForm mock
      step: 1, // Default step
      nextStep: vi.fn(), // Default nextStep mock
      prevStep: vi.fn(), // Default prevStep mock
    });

    // Default mock implementation for useAuth
    mockUseAuth.mockReturnValue({
      signingUp: false,
      signup: vi.fn(),
    });
  });

  it('should render step 1 initially', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText('auth.signup.label.email')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.signup.label.password')).toBeInTheDocument();
    expect(screen.getByLabelText('auth.signup.label.username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'auth.signup.button.next' })).toBeInTheDocument();
    expect(screen.queryByLabelText('auth.signup.label.firstName')).not.toBeInTheDocument();
  });

  it('should navigate to step 2 on clicking next if step 1 is valid', async () => {
    const mockNextStep = vi.fn();
    // Mock useFormValidation to return valid state for step 1 fields and provide nextStep mock
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Form is valid
      handleChange: vi.fn(),
      handleSubmit: vi.fn(() => (event: React.FormEvent) => {
        event.preventDefault();
        return { isValid: true }; // Simulate successful validation
      }),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 1, // Simulate being in step 1
      nextStep: mockNextStep, // Provide mock nextStep
      prevStep: vi.fn(),
    });

    render(<SignUpForm />);

    const nextButton = screen.getByRole('button', { name: 'auth.signup.button.next' });
    fireEvent.click(nextButton);

    // Check if nextStep was called
    expect(mockNextStep).toHaveBeenCalled();
  });


  it('should show validation errors and not navigate to step 2 if step 1 is invalid', async () => {
    const mockNextStep = vi.fn();
    // Mock useFormValidation to return invalid state and errors for step 1 fields
    mockUseFormValidation.mockReturnValue({
      values: {
        email: '', // Invalid email
        password: '', // Invalid password
        username: '', // Invalid username
        firstName: '',
        secondName: '',
        firstLastName: '',
        secondLastName: '',
      },
      errors: {
        email: 'auth.signup.validation.emailRequired',
        password: 'auth.signup.validation.passwordRequired',
        username: 'auth.signup.validation.usernameRequired',
      },
      isValid: false, // Form is invalid
      handleChange: vi.fn(),
      handleSubmit: vi.fn(() => (event: React.FormEvent) => {
        event.preventDefault();
        return { isValid: false }; // Simulate failed validation
      }),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 1, // Simulate being in step 1
      nextStep: mockNextStep, // Provide mock nextStep
      prevStep: vi.fn(),
    });

    render(<SignUpForm />);

    const nextButton = screen.getByRole('button', { name: 'auth.signup.button.next' });
    fireEvent.click(nextButton);

    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('auth.signup.validation.emailRequired')).toBeInTheDocument();
      expect(screen.getByText('auth.signup.validation.passwordRequired')).toBeInTheDocument();
      expect(screen.getByText('auth.signup.validation.usernameRequired')).toBeInTheDocument();
    });

    // Check that nextStep was NOT called
    expect(mockNextStep).not.toHaveBeenCalled();
    // Check that we are still in step 1
    expect(screen.getByLabelText('auth.signup.label.email')).toBeInTheDocument();
    expect(screen.queryByLabelText('auth.signup.label.firstName')).not.toBeInTheDocument();
  });

  it('should call nextStep on clicking next if step 2 is valid', async () => {
    const mockNextStep = vi.fn();
    // Mock useFormValidation to simulate being in step 2 with valid data
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Form is valid
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 2, // Simulate being in step 2
      nextStep: mockNextStep, // Provide mock nextStep
      prevStep: vi.fn(),
    });

    render(<SignUpForm />);

    // Ensure we are in step 2 by checking for a step 2 element
    await waitFor(() => {
      expect(screen.getByLabelText('auth.signup.label.firstName')).toBeInTheDocument();
    });

    const nextButton = screen.getByRole('button', { name: 'auth.signup.button.next' });
    fireEvent.click(nextButton);

    // Check if nextStep was called
    expect(mockNextStep).toHaveBeenCalled();
  });

  it('should call signup function on submitting step 3 if form is valid', async () => {
    const mockSignup = vi.fn();
    mockUseAuth.mockReturnValue({
      signingUp: false,
      signup: mockSignup,
    });

    // Mock useFormValidation to simulate being in step 3 with valid data
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Form is valid
      handleChange: vi.fn(),
      handleSubmit: vi.fn(() => async (event: React.FormEvent) => {
        event.preventDefault();
        // Simulate validation success and call the mock signup
        const formIsValid = true; // Assume valid for this test
        if (formIsValid) {
          await mockSignup({
             email: 'test@example.com',
             password: 'password123',
             username: 'testuser',
             firstName: 'Test',
             secondName: '',
             firstLastName: 'User',
             secondLastName: '',
           });
        }
        return { isValid: formIsValid };
      }),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 3, // Simulate being in step 3
      nextStep: vi.fn(),
      prevStep: vi.fn(),
    });


    render(<SignUpForm />);

    // Ensure we are in step 3
    await waitFor(() => {
      expect(screen.getByText('auth.signup.confirmation.title')).toBeInTheDocument();
    });

    const signUpButton = screen.getByRole('button', { name: 'auth.signup.button.signUp' });
    fireEvent.click(signUpButton);

    // Check if signup function was called with the correct values
    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      });
    });
  });

  it('should disable submit button when signingUp is true', async () => { // Mark test as async
    mockUseAuth.mockReturnValue({
      signingUp: true, // Signing up is true
      signup: vi.fn(),
    });

    // Mock useFormValidation to simulate being in step 3
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Assume valid for this test setup
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 3, // Simulate being in step 3
      nextStep: vi.fn(),
      prevStep: vi.fn(),
    });

    render(<SignUpForm />);

    // Ensure we are in step 3
    await waitFor(() => {
      expect(screen.getByText('auth.signup.confirmation.title')).toBeInTheDocument();
    });

    const signUpButton = screen.getByRole('button', { name: 'auth.signup.button.signUp' });
    expect(signUpButton).toBeDisabled();
    expect(screen.getByTestId('loading')).toBeInTheDocument(); // Assuming Loading component has data-testid="loading"
  });

  it('should navigate back to step 1 from step 2', async () => {
    const mockPrevStep = vi.fn();
    // Mock useFormValidation to simulate being in step 2
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Assume valid for this test setup
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 2, // Simulate being in step 2
      nextStep: vi.fn(),
      prevStep: mockPrevStep, // Provide mock prevStep
    });

    render(<SignUpForm />);

    // Ensure we are in step 2
    await waitFor(() => {
      expect(screen.getByLabelText('auth.signup.label.firstName')).toBeInTheDocument();
    });

    const previousButton = screen.getByRole('button', { name: 'auth.signup.button.previous' });
    fireEvent.click(previousButton);

    // Check if prevStep was called
    expect(mockPrevStep).toHaveBeenCalled();
  });

  it('should navigate back to step 2 from step 3', async () => {
    const mockPrevStep = vi.fn();
    // Mock useFormValidation to simulate being in step 3
    mockUseFormValidation.mockReturnValue({
      values: {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
        firstName: 'Test',
        secondName: '',
        firstLastName: 'User',
        secondLastName: '',
      },
      errors: {},
      isValid: true, // Assume valid for this test setup
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      setErrors: vi.fn(),
      resetForm: vi.fn(),
      step: 3, // Simulate being in step 3
      nextStep: vi.fn(),
      prevStep: mockPrevStep, // Provide mock prevStep
    });

    render(<SignUpForm />);

    // Ensure we are in step 3
    await waitFor(() => {
      expect(screen.getByText('auth.signup.confirmation.title')).toBeInTheDocument();
    });

    const previousButton = screen.getByRole('button', { name: 'auth.signup.button.previous' });
    fireEvent.click(previousButton);

    // Check if prevStep was called
    expect(mockPrevStep).toHaveBeenCalled();
  });
});