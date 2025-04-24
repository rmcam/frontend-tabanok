import { useState } from 'react';

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

interface UseFormValidationResult<T> {
  values: T;
  errors: { [key: string]: string };
  isValid: boolean;
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (validationRules: { [key: string]: (value: string) => string | undefined }) => (event: React.FormEvent) => void;
}

const useFormValidation = <T extends { [key: string]: string }>(initialValues: T): UseFormValidationResult<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = (validationRules: { [key: string]: (value: string) => string | undefined }) => (event: React.FormEvent) => {
    event.preventDefault();
    const validationResult = validate(values, validationRules);
    setErrors(validationResult.errors);
    setIsValid(validationResult.isValid);
    return validationResult;
  };

  const validate = (currentValues: T, validationRules: { [key: string]: (value: string) => string | undefined }): ValidationResult => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    for (const key in validationRules) {
      const rule = validationRules[key];
      const value = currentValues[key];
      const error = rule(value);
      if (error) {
        errors[key] = error;
        isValid = false;
      }
    }

    return { isValid, errors };
  };

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
  };
};

export { useFormValidation as default, UseFormValidationResult };
