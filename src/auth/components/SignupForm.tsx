import Loading from '@/components/common/Loading';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth'; // Corregir la ruta de importación
import { useTranslation } from 'react-i18next'; // Import useTranslation

const SignUpForm = () => {
  const { t } = useTranslation(); // Initialize useTranslation
  const [step, setStep] = useState(1);
  const initialValues = {
    email: '',
    password: '',
    username: '',
    firstName: '',
    secondName: '',
    firstLastName: '',
    secondLastName: '',
  };

  // Define validation rules separately
  const validationRules = React.useMemo(
    () => ({
      email: (value: string) => {
        if (!value) return t('auth.signup.validation.emailRequired');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t('auth.signup.validation.emailInvalid');
        return undefined;
      },
      password: (value: string) => {
        if (!value) return t('auth.signup.validation.passwordRequired');
        if (value.length < 6) return t('auth.signup.validation.passwordMinLength');
        return undefined;
      },
      username: (value: string) => {
        if (!value) return t('auth.signup.validation.usernameRequired');
        return undefined;
      },
      firstName: (value: string) => {
        if (!value) return t('auth.signup.validation.firstNameRequired');
        return undefined;
      },
      secondName: () => {
        return undefined; // Optional field
      },
      firstLastName: (value: string) => {
        if (!value) return t('auth.signup.validation.lastNameRequired');
        return undefined;
      },
      secondLastName: () => {
        return undefined; // Optional field
      },
    }),
    [t], // Add t to dependencies
  );

  const { values, errors, isValid, handleChange, handleSubmit } = useFormValidation(initialValues);

  const navigate = useNavigate();
  const { signup, signingUp } = useAuth();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Trigger validation for all fields on final submit
    // Based on the previous error message "Se esperaban 1 argumentos, pero se obtuvieron 0" for handleSubmit(),
    // it seems handleSubmit might expect the validation rules as an argument.
    // This contradicts the error for useFormValidation itself, but let's try passing rules here.
    const formIsValid = handleSubmit(validationRules); // Pass validationRules to handleSubmit

    // Check overall form validity using the state provided by the hook
    // isValid is updated by useFormValidation after handleChange and handleSubmit
    if (formIsValid) { // Use the boolean return value from handleSubmit
      console.log('Formulario válido, enviando datos:', values);
      try {
        await signup({
          email: values.email,
          password: values.password,
          username: values.username,
          firstName: values.firstName,
          secondName: values.secondName,
          firstLastName: values.firstLastName,
          secondLastName: values.secondLastName,
        });
        // If signup completes without throwing an error, it was successful
        console.log('Registro exitoso');
        navigate('/');
      } catch (error) {
        console.error('Error durante el registro:', error);
        // El AuthProvider ya maneja la visualización de los toasts de error.
        // No necesitamos establecer un estado de error local aquí.
      }
    } else {
      console.log('Errores de validación en el formulario final.');
      // Errors will be displayed by the Input components using the errors state from useFormValidation
    }
  };

  const nextStep = () => {
    let currentStepFields: (keyof typeof initialValues)[] = [];

    if (step === 1) {
      currentStepFields = ['email', 'password', 'username'];
    } else if (step === 2) {
      currentStepFields = ['firstName', 'firstLastName']; // Only required fields for step 2
    }

    // Simple check if required fields for the current step are filled and valid based on the defined rules
    const stepFieldsValid = currentStepFields.every(field => {
      const value = values[field];
      const rule = validationRules[field];
      // Check if the field has a validation rule and if applying the rule results in no error
      return rule && !rule(value);
    });

    if (stepFieldsValid) {
      setStep(step + 1);
    } else {
      console.log(`Validation errors in step ${step}. Cannot proceed.`);
      // Errors for the current step's fields should be visible via the `errors` state from useFormValidation
      // if the hook updates `errors` on `handleChange` or `onBlur` (if onBlur is re-added).
      // For a multi-step form, a more sophisticated validation trigger per step might be needed,
      // potentially by extending useFormValidation or implementing custom field-level validation on blur.
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 text-center text-gray-700">
        {t('auth.signup.step', { step })} {/* Use translation with interpolation */}
      </div>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        {step === 1 && (
          <>
            <div className="grid gap-1">
              <Label htmlFor="email" className="text-sm text-gray-700">
                {t('auth.signup.label.email')} {/* Use translation */}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('auth.signup.placeholder.email')}
                name="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
              {errors.email && <p id="email-error" className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password" className="text-sm text-gray-700">
                {t('auth.signup.label.password')} {/* Use translation */}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t('auth.signup.placeholder.password')}
                name="password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              {errors.password && <p id="password-error" className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="username" className="text-sm text-gray-700">
                {t('auth.signup.label.username')} {/* Use translation */}
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t('auth.signup.placeholder.username')}
                name="username"
                value={values.username}
                onChange={handleChange}
                aria-invalid={!!errors.username}
                aria-describedby="username-error"
              />
              {errors.username && <p id="username-error" className="text-red-500 text-sm mt-2">{errors.username}</p>}
            </div>
            <Button type="button" onClick={nextStep} className="w-full rounded-lg py-2 mt-4">
              {t('auth.signup.button.next')} {/* Use translation */}
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-1">
              <Label htmlFor="firstName" className="text-sm text-gray-700">
                {t('auth.signup.label.firstName')} {/* Use translation */}
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder={t('auth.signup.placeholder.firstName')}
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
                aria-describedby="firstName-error"
              />
              {errors.firstName && <p id="firstName-error" className="text-red-500 text-sm mt-2">{errors.firstName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="secondName" className="text-sm text-gray-700">
                {t('auth.signup.label.secondName')} {/* Use translation */}
              </Label>
              <Input
                id="secondName"
                type="text"
                placeholder={t('auth.signup.placeholder.secondName')}
                name="secondName"
                value={values.secondName}
                onChange={handleChange}
                aria-invalid={!!errors.secondName}
                aria-describedby="secondName-error"
              />
              {errors.secondName && <p id="secondName-error" className="text-red-500 text-sm mt-2">{errors.secondName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="firstLastName" className="text-sm text-gray-700">
                {t('auth.signup.label.firstLastName')} {/* Use translation */}
              </Label>
              <Input
                id="firstLastName"
                type="text"
                placeholder={t('auth.signup.placeholder.firstLastName')}
                name="firstLastName"
                value={values.firstLastName}
                onChange={handleChange}
                aria-invalid={!!errors.firstLastName}
                aria-describedby="firstLastName-error"
              />
              {errors.firstLastName && <p id="firstLastName-error" className="text-red-500 text-sm mt-2">{errors.firstLastName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="secondLastName" className="text-sm text-gray-700">
                {t('auth.signup.label.secondLastName')} {/* Use translation */}
              </Label>
              <Input
                id="secondLastName"
                type="text"
                placeholder={t('auth.signup.placeholder.secondLastName')}
                name="secondLastName"
                value={values.secondLastName}
                onChange={handleChange}
                aria-invalid={!!errors.secondLastName}
                aria-describedby="secondLastName-error"
              />
              {errors.secondLastName && <p id="secondLastName-error" className="text-red-500 text-sm mt-2">{errors.secondLastName}</p>}
            </div>
            <Button type="button" onClick={prevStep} className="w-full rounded-lg py-2 mt-4">
              {t('auth.signup.button.previous')} {/* Use translation */}
            </Button>
            <Button type="button" onClick={nextStep} className="w-full rounded-lg py-2">
              {t('auth.signup.button.next')} {/* Use translation */}
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">{t('auth.signup.confirmation.title')}</p> {/* Use translation */}
              <p>{t('auth.signup.confirmation.email', { email: values.email })}</p> {/* Use translation with interpolation */}
              <p>{t('auth.signup.confirmation.username', { username: values.username })}</p> {/* Use translation with interpolation */}
              <p>{t('auth.signup.confirmation.firstName', { firstName: values.firstName })}</p> {/* Use translation with interpolation */}
              <p>{t('auth.signup.confirmation.secondName', { secondName: values.secondName })}</p> {/* Use translation with interpolation */}
              <p>{t('auth.signup.confirmation.firstLastName', { firstLastName: values.firstLastName })}</p> {/* Use translation with interpolation */}
              <p>{t('auth.signup.confirmation.secondLastName', { secondLastName: values.secondLastName })}</p> {/* Use translation with interpolation */}
            </div>
            <Button type="button" onClick={prevStep} className="w-full rounded-lg py-2 mt-4">
              {t('auth.signup.button.previous')} {/* Use translation */}
            </Button>
            <Button type="submit" className="w-full rounded-lg py-2" disabled={!isValid || signingUp}>
              {signingUp ? <Loading /> : t('auth.signup.button.signUp')} {/* Use translation */}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
