import Loading from '@/components/common/Loading';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth'; // Corregir la ruta de importación

const SignUpForm = () => {
  const [signupError, setSignupError] = useState<string | null>(null);
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
        if (!value) return 'Email es requerido';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email no es válido';
        return undefined;
      },
      password: (value: string) => {
        if (!value) return 'Contraseña es requerida';
        if (value.length < 6) return 'Contraseña debe tener al menos 6 caracteres';
        return undefined;
      },
      username: (value: string) => {
        if (!value) return 'Usuario es requerido';
        return undefined;
      },
      firstName: (value: string) => {
        if (!value) return 'Nombre es requerido';
        return undefined;
      },
      secondName: () => {
        return undefined; // Optional field
      },
      firstLastName: (value: string) => {
        if (!value) return 'Apellido es requerido';
        return undefined;
      },
      secondLastName: () => {
        return undefined; // Optional field
      },
    }),
    [],
  );

  const { values, errors, isValid, handleChange, handleSubmit } = useFormValidation(initialValues);

  const navigate = useNavigate();
  const { signup, signingUp } = useAuth();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupError(null);

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
        const success = await signup({
          email: values.email,
          password: values.password,
          username: values.username,
          firstName: values.firstName,
          secondName: values.secondName,
          firstLastName: values.firstLastName,
          secondLastName: values.secondLastName,
        });
        if (success) {
          console.log('Registro exitoso');
          navigate('/');
        }
      } catch (error: unknown) { // Usar unknown para un manejo de errores más seguro
        console.error('Error durante el registro:', error);
        const errorMessage = (error instanceof Error && error.message) ? error.message : 'Ocurrió un error desconocido durante el registro.';
        setSignupError(errorMessage);
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
        Paso {step} de 3
      </div>
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-3">
        {step === 1 && (
          <>
            <div className="grid gap-1">
              <Label htmlFor="email" className="text-sm text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                value={values.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-red-500 text-sm mt-2">{errors.email}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="password" className="text-sm text-gray-700">
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
              />
              {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="username" className="text-sm text-gray-700">
                Usuario
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Username"
                name="username"
                value={values.username}
                onChange={handleChange}
                aria-invalid={!!errors.username}
              />
              {errors.username && <p className="text-red-500 text-sm mt-2">{errors.username}</p>}
            </div>
            <Button type="button" onClick={nextStep} className="w-full rounded-lg py-2 mt-4">
              Siguiente
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid gap-1">
              <Label htmlFor="firstName" className="text-sm text-gray-700">
                Nombre
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="secondName" className="text-sm text-gray-700">
                Segundo Nombre
              </Label>
              <Input
                id="secondName"
                type="text"
                placeholder="Second Name"
                name="secondName"
                value={values.secondName}
                onChange={handleChange}
                aria-invalid={!!errors.secondName}
              />
              {errors.secondName && <p className="text-red-500 text-sm mt-2">{errors.secondName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="firstLastName" className="text-sm text-gray-700">
                Apellido
              </Label>
              <Input
                id="firstLastName"
                type="text"
                placeholder="First Last Name"
                name="firstLastName"
                value={values.firstLastName}
                onChange={handleChange}
                aria-invalid={!!errors.firstLastName}
              />
              {errors.firstLastName && <p className="text-red-500 text-sm mt-2">{errors.firstLastName}</p>}
            </div>
            <div className="grid gap-1">
              <Label htmlFor="secondLastName" className="text-sm text-gray-700">
                Segundo Apellido
              </Label>
              <Input
                id="secondLastName"
                type="text"
                placeholder="Second Last Name"
                name="secondLastName"
                value={values.secondLastName}
                onChange={handleChange}
                aria-invalid={!!errors.secondLastName}
              />
              {errors.secondLastName && <p className="text-red-500 text-sm mt-2">{errors.secondLastName}</p>}
            </div>
            <Button type="button" onClick={prevStep} className="w-full rounded-lg py-2 mt-4">
              Anterior
            </Button>
            <Button type="button" onClick={nextStep} className="w-full rounded-lg py-2">
              Siguiente
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-2 text-gray-700">
              <p className="font-semibold">Confirme sus datos:</p>
              <p>Email: {values.email}</p>
              <p>Usuario: {values.username}</p>
              <p>Nombre: {values.firstName}</p>
              <p>Segundo Nombre: {values.secondName}</p>
              <p>Apellido: {values.firstLastName}</p>
              <p>Segundo Apellido: {values.secondLastName}</p>
            </div>
            <Button type="button" onClick={prevStep} className="w-full rounded-lg py-2 mt-4">
              Anterior
            </Button>
            <Button type="submit" className="w-full rounded-lg py-2" disabled={!isValid || signingUp}>
              {signingUp ? <Loading /> : 'Registrarse'}
            </Button>
          </>
        )}

        {signupError && (
          <p className="text-red-500 text-sm mt-2 text-center">{signupError}</p>
        )}
      </form>
    </div>
  );
};

export default SignUpForm;
