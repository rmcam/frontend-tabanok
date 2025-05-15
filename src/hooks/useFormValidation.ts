import { useState } from "react";

interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

interface UseFormValidationResult<T extends object> {
  values: T;
  errors: { [key: string]: string };
  isValid: boolean;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (validationRules: {
    [key: string]: (value: unknown) => string | undefined;
  }) => (event?: React.FormEvent, formValues?: T) => ValidationResult;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  resetForm: () => void;
}

const useFormValidation = <T extends object>(
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
    // Clear errors when input changes
    setErrors({});
    // Re-evaluate isValid based on current values and rules (requires rules here)
    // For now, just clearing errors is sufficient to allow re-validation on next submit.
  };

  const handleSubmit =
    (validationRules: {
      [key: string]: (value: unknown) => string | undefined;
    }) =>
    (event?: React.FormEvent, formValues?: T) => {
      event?.preventDefault();
      const valuesToValidate = formValues || values;
      const validationResult = validate(valuesToValidate, validationRules);
      setErrors(validationResult.errors);
      setIsValid(validationResult.isValid);
      return validationResult;
    };

  const validate = (
    currentValues: T,
    validationRules: { [key: string]: (value: unknown) => string | undefined }
  ): ValidationResult => {
    let isValid = true;
    const errors: { [key: string]: string } = {};

    for (const key in validationRules) {
      if (Object.prototype.hasOwnProperty.call(currentValues, key) && Object.prototype.hasOwnProperty.call(validationRules, key)) {
        const rule = validationRules[key];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const value = (currentValues as any)[key];
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
