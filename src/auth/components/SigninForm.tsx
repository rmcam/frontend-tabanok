import Loading from '@/components/common/Loading';
import { Button, Input, Label } from '@/components/ui';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../auth/hooks/useAuth'; // Import useAuth from hooks
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface SigninFormProps {
  identifier: string;
  password: string;
  [key: string]: string;
}

const SigninForm: React.FC = () => {
  const { t } = useTranslation(); // Initialize useTranslation

  const initialValues: SigninFormProps = {
    identifier: '',
    password: '',
  };

  const { values, errors, isValid, handleChange } =
    useFormValidation<SigninFormProps>(initialValues);

  const navigate = useNavigate(); // Get navigate function
  const { signin, signingIn } = useAuth(); // Use useAuth hook from context and get signin and signingIn state

  const submitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        // Use signin from the context
        await signin({
          identifier: values.identifier,
          password: values.password,
        });
        navigate('/dashboard'); // Redirigir al dashboard después del inicio de sesión exitoso
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // El AuthProvider ya maneja la visualización de los toasts de error.
        // No necesitamos establecer un estado de error local aquí.
      }
    },
    [values, signin, navigate], // Add signin and navigate to dependencies
  );

  return (
    <div className="flex flex-col items-center justify-center"> {/* Removed card styles */}
      <form onSubmit={submitHandler} className="w-full max-w-sm space-y-6"> {/* Increased space-y, Adjusted max-width */}
        <div className="grid gap-3"> {/* Increased gap */}
          <Label htmlFor="identifier" className="text-sm">
            {t('auth.signin.label.username')} 
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={t('auth.signin.placeholder.username')} 
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
            className={`w-full rounded-lg border ${errors.identifier ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            aria-label={t('auth.signin.label.username')} 
            aria-describedby="identifier-error"
          />
          {errors.identifier && <p id="identifier-error" className="text-red-500 text-sm mt-1">{errors.identifier}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password" className="text-sm text-gray-700">
            {t('auth.signin.label.password')} 
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.signin.placeholder.password')} 
            name="password"
            value={values.password}
            onChange={handleChange}
            className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50`}
            aria-label={t('auth.signin.label.password')} 
            aria-describedby="password-error"
          />
          {errors.password && <p id="password-error" className="text-red-500 text-sm mt-1">{errors.password}</p>}
          <div className="text-right text-sm mt-1">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              {t('auth.signin.link.forgotPassword')} 
            </a>
          </div>
        </div>
        <Button type="submit" className="w-full rounded-lg py-2" disabled={!isValid || signingIn}>
          {signingIn ? <Loading /> : t('auth.signin.button.signIn')} 
        </Button>
      </form>
    </div>
  );
};

export default SigninForm;
