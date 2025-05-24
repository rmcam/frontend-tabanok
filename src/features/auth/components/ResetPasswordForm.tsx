import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useResetPassword } from '@/hooks/useApi';
import type { ApiError } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

interface ResetPasswordFormProps {
  changeView: (view: AuthView) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ changeView }) => {
  const { t } = useTranslation(); // Inicializar useTranslation
   const resetPasswordSchema = z.object({
    password: z.string().min(6, t('password_min_length')),
    confirmPassword: z.string().min(6, t('password_min_length')),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwords_do_not_match'),
    path: ['confirmPassword'],
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate: resetPass, isPending: isResettingPassword } = useResetPassword();

  const handleResetPassword = async (values: z.infer<typeof resetPasswordSchema>) => {
    console.log('Reset password form submitted:', values);

    const token = 'example-token-from-url'; // TODO: Obtener el token real de la URL o de otro lugar

    resetPass({ token, newPassword: values.password }, {
      onSuccess: (data) => {
        console.log('Password reset successful:', data);
        toast.success(t('password_reset_successful'));
        changeView('login');
      },
      onError: (err: ApiError) => {
        console.error('Password reset failed:', err);
        let errorMessage = t('error_password_reset_failed');
        if (err.details) {
          if (typeof err.details === 'string') {
            try {
              const parsedDetails = JSON.parse(err.details);
              if (parsedDetails && typeof parsedDetails === 'object' && parsedDetails.message) {
                errorMessage = parsedDetails.message;
              }
            } catch (e) {
              errorMessage = err.details;
            }
          } else if (typeof err.details === 'object' && (err.details as any).message) {
            errorMessage = (err.details as any).message;
          }
        }
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Card className="p-6">
      <CardHeader className="text-center p-0 mb-6">
        <CardTitle className="text-2xl">{t('reset_password_title')}</CardTitle>
        <CardDescription>{t('reset_password_description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">{t('new_password_label')}</Label>
              <div className="relative flex items-center mt-1">
                <Lock className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="pl-8"
                />
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">{t('confirm_new_password_label')}</Label>
              <div className="relative flex items-center mt-1">
                <Lock className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register('confirmPassword')}
                  className="pl-8"
                />
              </div>
              {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isResettingPassword}>
            {isResettingPassword ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('resetting_password')}
              </>
            ) : (
              t('reset_password_button')
            )}
          </Button>
          <div className="mt-4 text-center text-sm">
            <Button variant="link" type="button" onClick={() => changeView('login')} className="p-0 h-auto">
              {t('back_to_login')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
