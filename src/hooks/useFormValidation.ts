import { useState } from "react";

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

interface UseFormValidationResult<T extends object> { // Relaxed type constraint
  values: T;
  errors: { [key: string]: string };
  isValid: boolean;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (validationRules: {
    [key: string]: (value: unknown) => string | undefined; // Use unknown instead of any
  }) => (event?: React.FormEvent, formValues?: T) => ValidationResult; // Allow optional event and formValues
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  resetForm: () => void;
}

const useFormValidation = <T extends object>( // Relaxed type constraint
  initialValues: T
): UseFormValidationResult<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(true);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit =
    (validationRules: {
      [key: string]: (value: unknown) => string | undefined; // Use unknown instead of any
    }) =>
    (event?: React.FormEvent, formValues?: T) => { // Allow optional event and formValues
      event?.preventDefault(); // Prevent default only if event is provided
      const valuesToValidate = formValues || values; // Use provided values or internal state
      const validationResult = validate(valuesToValidate, validationRules);
      setErrors(validationResult.errors);
      setIsValid(validationResult.isValid);
      return validationResult;
    };

  const validate = (
    currentValues: T,
    validationRules: { [key: string]: (value: unknown) => string | undefined } // Use unknown instead of any
  ): ValidationResult => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    for (const key in validationRules) {
      // Ensure the key exists in currentValues and validationRules
      if (Object.prototype.hasOwnProperty.call(currentValues, key) && Object.prototype.hasOwnProperty.call(validationRules, key)) {
        const rule = validationRules[key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (currentValues as any)[key]; // Keep as any for property access
        const error = rule(value);
        if (error) {
          errors[key] = error;
          isValid = false;
        }
      }
    }

    return { isValid, errors };
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setIsValid(true);
  };

  return {
    values,
    errors,
    isValid,
    handleChange,
    handleSubmit,
    setErrors,
    resetForm,
  };
};

export { useFormValidation as default, UseFormValidationResult };
