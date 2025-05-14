import Loading from '@/components/common/Loading';

import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth } from '../../auth/hooks/useAuth'; // Import useAuth from hooks
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { cn } from "@/lib/utils"; // Import cn utility
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  const { signin, signingIn, user } = useAuth(); // Use useAuth hook from context and get signin, signingIn state, and user

  const submitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        // Use signin from the context
        await signin({
          identifier: values.identifier,
          password: values.password,
        });
        // Después de un inicio de sesión exitoso, verificar el rol del usuario para redirigir
        if (user?.roles.includes('teacher') || user?.roles.includes('admin')) {
          navigate('/dashboard'); // Redirigir a docentes/admins al dashboard unificado
        } else if (user?.roles.includes('student')) {
          navigate('/student-panel'); // Redirigir a estudiantes a su panel
        } else {
          // Opcional: redirigir a una página por defecto o mostrar un mensaje si el rol no es reconocido
          navigate('/');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // El AuthProvider ya maneja la visualización de los toasts de error.
        // No necesitamos establecer un estado de error local aquí.
      }
    },
    [values, signin, navigate, user], // Add signin, navigate, and user to dependencies
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md"> {/* Added padding, background, rounded corners, and shadow */}
      <form onSubmit={submitHandler} className="w-full max-w-sm space-y-6"> {/* Increased space-y, Adjusted max-width */}
        <div className="grid gap-3"> {/* Increased gap */}
          <Label htmlFor="identifier">
            {t('auth.signin.label.username')}
          </Label>
          <Input
            id="identifier"
            type="text"
            placeholder={t('auth.signin.placeholder.username')}
            name="identifier"
            value={values.identifier}
            onChange={handleChange}
            className={cn(
              errors.identifier && 'border-destructive'
            )}
            aria-label={t('auth.signin.label.username')}
            aria-describedby="identifier-error"
          />
          {errors.identifier && <p id="identifier-error" className="text-destructive text-sm mt-1">{errors.identifier}</p>}
        </div>
        <div className="grid gap-3">
          <Label htmlFor="password">
            {t('auth.signin.label.password')}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('auth.signin.placeholder.password')}
            name="password"
            value={values.password}
            onChange={handleChange}
            className={cn(
              errors.password && 'border-destructive'
            )}
            aria-label={t('auth.signin.label.password')}
            aria-describedby="password-error"
          />
          {errors.password && <p id="password-error" className="text-destructive text-sm mt-1">{errors.password}</p>}
          <div className="text-right text-sm mt-1">
            <a href="/forgot-password" className="text-primary hover:underline">
              {t('auth.signin.link.forgotPassword')}
            </a>
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={!isValid || signingIn}>
          {signingIn ? <Loading /> : t('auth.signin.button.signIn')}
        </Button>
      </form>
    </div>
  );
};

export default SigninForm;
