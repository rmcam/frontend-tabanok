import Loading from '@/components/common/Loading';
import useFormValidation from '@/hooks/useFormValidation';
import React, { FormEvent, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from "@/lib/utils";
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SigninFormProps {
  identifier: string;
  password: string;
  [key: string]: string;
}

const SigninForm = React.forwardRef<HTMLFormElement, SigninFormProps>((props, ref) => {
  const { t } = useTranslation();

  const initialValues: SigninFormProps = {
    identifier: '',
    password: '',
  };

  const { values, errors, isValid, handleChange } =
    useFormValidation<SigninFormProps>(initialValues);

  const navigate = useNavigate();
  const { signin, signingIn, user } = useAuth();

  const identifierRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  const submitHandler = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        await signin({
          identifier: values.identifier,
          password: values.password,
        });
        console.log('User after signin:', user);
        if (user?.roles.includes('teacher') || user?.roles.includes('admin')) {
          navigate('/dashboard');
        } else if (user?.roles.includes('student')) {
          navigate('/student-panel');
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error);
      }
    },
    [values, signin, navigate, user]);

 useEffect(() => {
   if (user?.roles.includes('teacher') || user?.roles.includes('admin')) {
     navigate('/dashboard');
   } else if (user?.roles.includes('student')) {
     navigate('/student-panel');
   } else if (user) {
     navigate('/');
   }
 }, [user, navigate]);

 return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={submitHandler} className="w-full max-w-sm space-y-6" ref={ref}>
        <div className="grid gap-3">
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
            aria-invalid={!!errors.identifier}
            aria-describedby="identifier-error"
            ref={identifierRef}
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
            aria-invalid={!!errors.password}
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
});

SigninForm.displayName = "SigninForm";

export default SigninForm;
