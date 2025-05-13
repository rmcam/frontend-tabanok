import { renderHook, act } from '@testing-library/react-hooks';
import useFormValidation from './useFormValidation';

describe('useFormValidation', () => {
  const initialValues = {
    name: '',
    email: '',
    password: '',
  };

  const validationRules = {
    name: (value: unknown) => (typeof value === 'string' && value ? undefined : 'Name is required'),
    email: (value: unknown) => {
      if (typeof value !== 'string') return 'Email is required';
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
      return undefined;
    },
    password: (value: unknown) =>
      typeof value === 'string' && value && value.length >= 6 ? undefined : 'Password must be at least 6 characters',
  };

  it('should initialize with initial values and no errors', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should update values on handleChange', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));
    const event = {
      target: { name: 'name', value: 'John Doe' },
    } as React.ChangeEvent<HTMLInputElement>;

    act(() => {
      result.current.handleChange(event);
    });

    expect(result.current.values.name).toBe('John Doe');
  });

  it('should validate form and set errors on handleSubmit', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));

    act(() => {
      result.current.handleSubmit(validationRules)(); // Pass validationRules and call the returned function
    });

    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Email is required',
      password: 'Password must be at least 6 characters',
    });
    expect(result.current.isValid).toBe(false);
  });

  it('should return validation result on handleSubmit', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));

    let validationResult;
    act(() => {
      validationResult = result.current.handleSubmit(validationRules)();
    });

    expect(validationResult).toEqual({
      isValid: false,
      errors: {
        name: 'Name is required',
        email: 'Email is required',
        password: 'Password must be at least 6 characters',
      },
    });
  });

  it('should validate form with provided values on handleSubmit', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));
    const formValues = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'securepassword',
    };

    let validationResult;
    act(() => {
      validationResult = result.current.handleSubmit(validationRules)(undefined, formValues); // Pass formValues
    });

    expect(validationResult).toEqual({
      isValid: true,
      errors: {},
    });
    // Ensure internal state is not updated when formValues are provided
    expect(result.current.values).toEqual(initialValues);
  });


  it('should set errors directly', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));
    const newErrors = { email: 'Email already exists' };

    act(() => {
      result.current.setErrors(newErrors);
    });

    expect(result.current.errors).toEqual(newErrors);
    expect(result.current.isValid).toBe(false); // Setting errors should make form invalid
  });

  it('should reset form to initial values and clear errors', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));

    // Simulate some changes and errors
    act(() => {
      result.current.handleChange({ target: { name: 'name', value: 'John Doe' } } as React.ChangeEvent<HTMLInputElement>);
      result.current.setErrors({ email: 'Invalid email' });
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.errors).toEqual({ email: 'Invalid email' });
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });
});
