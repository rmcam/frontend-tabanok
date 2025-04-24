import Loading from '@/components/common/Loading';
import { Button, Input, Label } from '@/components/ui';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../auth/hooks/useAuth'; // Import useAuth from hooks

interface SigninFormProps {
  identifier: string;
  password: string;
  [key: string]: string;
}

const SigninForm: React.FC = () => {
  const initialValues: SigninFormProps = {
    identifier: '',
    password: '',
  };

  const { values, errors, isValid, handleChange } =
    useFormValidation<SigninFormProps>(initialValues);

  const navigate = useNavigate(); // Get navigate function
  const { signin, signingIn } = useAuth(); // Use useAuth hook from context and get signin and signingIn state

  const [apiError, setApiError] = useState<string | null>(null);

  const submitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setApiError(null); // Clear previous errors
      try {
        // Use signin from the context
        const success = await signin({
          identifier: values.identifier,
          password: values.password,
        });
        if (success) {
          navigate('/dashboard'); // Redirigir al dashboard después del inicio de sesión exitoso
        }
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('Error al iniciar sesión:', error);
        // Intenta parsear el error para mostrar un mensaje más amigable
        const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión. Inténtalo de nuevo.';
        setApiError(errorMessage); // Muestra el mensaje de error parseado
      }
    },
    [values, signin, navigate], // Add signin and navigate to dependencies
  );

  return (
    <div className="flex flex-col items-center justify-center"> {/* Removed card styles */}
      {apiError && <p className="text-red-500 mb-4">{apiError}</p>} {/* Display API error */}
      <form onSubmit={submitHandler} className="w-full max-w-sm space-y-6"> {/* Increased space-y, Adjusted max-width */}
        <div className="grid gap-3"> {/* Increased gap */}
          <Label htmlFor="identifier" className="text-sm">
            Usuario
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder="Email or Username"
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
            className={`w-full rounded-lg border ${errors.identifier ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            aria-label="Usuario"
          />
          {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
        </div>
        <div className="grid gap-3">
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
            className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            aria-label="Contraseña"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <div className="text-right text-sm mt-1">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
        <Button type="submit" className="w-full rounded-lg py-2" disabled={!isValid || signingIn}>
          {signingIn ? <Loading /> : 'Iniciar Sesión'}
        </Button>
      </form>
    </div>
  );
};

export default SigninForm;
