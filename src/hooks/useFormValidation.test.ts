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
    email: (value: unknown) =>
      (typeof value === 'string' && value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) ? undefined : 'Invalid email format',
    password: (value: unknown) =>
      (typeof value === 'string' && value && value.length >= 6) ? undefined : 'Password must be at least 6 characters',
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

  it('should validate successfully with handleSubmit', () => {
    const { result } = renderHook(() =>
      useFormValidation({ name: 'John Doe', email: 'john@example.com', password: 'password123' })
    );

    let validationResult;
    act(() => {
      validationResult = result.current.handleSubmit(validationRules)({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
    expect(validationResult?.isValid).toBe(true);
    expect(validationResult?.errors).toEqual({});
  });

  it('should validate with errors with handleSubmit', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));

    let validationResult;
    act(() => {
      validationResult = result.current.handleSubmit(validationRules)({
        preventDefault: () => {},
      } as React.FormEvent);
    });

    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Invalid email format',
      password: 'Password must be at least 6 characters',
    });
    expect(result.current.isValid).toBe(false);
    expect(validationResult?.isValid).toBe(false);
    expect(validationResult?.errors).toEqual({
      name: 'Name is required',
      email: 'Invalid email format',
      password: 'Password must be at least 6 characters',
    });
  });

  it('should set errors manually with setErrors', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));
    const manualErrors = { name: 'Custom error' };

    act(() => {
      result.current.setErrors(manualErrors);
    });

    expect(result.current.errors).toEqual(manualErrors);
    // Note: setErrors does not automatically update isValid, it needs to be handled separately if needed
  });

  it('should reset form to initial values with resetForm', () => {
    const { result } = renderHook(() => useFormValidation(initialValues));

    // Change values and set errors
    act(() => {
      result.current.handleChange({
        target: { name: 'name', value: 'John Doe' },
      } as React.ChangeEvent<HTMLInputElement>);
      result.current.setErrors({ name: 'Some error' });
      result.current.handleSubmit(validationRules)({
        preventDefault: () => {},
      } as React.FormEvent); // Trigger validation to set isValid to false
    });

    expect(result.current.values.name).toBe('John Doe');
    expect(result.current.errors).toEqual({
      name: 'Name is required',
      email: 'Invalid email format',
      password: 'Password must be at least 6 characters',
    });
    expect(result.current.isValid).toBe(false);


    act(() => {
      result.current.resetForm();
    });

    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });
});
