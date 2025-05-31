import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRequestPasswordReset } from '@/hooks/auth/auth.hooks';
import type { ApiError } from '@/types/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // Importar useTranslation

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

interface ForgotPasswordFormProps {
  changeView: (view: AuthView) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ changeView }) => {
  const { t } = useTranslation(); // Inicializar useTranslation
   const forgotPasswordSchema = z.object({
    email: z.string().email(t('email_invalid')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate: requestReset, isPending: isRequestingReset } = useRequestPasswordReset();

  const handleForgotPassword = async (values: z.infer<typeof forgotPasswordSchema>) => {
    console.log('Forgot password form submitted:', values);

    requestReset(values, {
      onSuccess: (data) => {
        console.log('Password reset request successful:', data);
        toast.success(t('password_reset_request_successful'));
        changeView('login');
      },
      onError: (err: ApiError) => {
        console.error('Password reset request failed:', err);
        let errorMessage = t('error_password_reset_request_failed');
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
        <CardTitle className="text-2xl">{t('forgot_password_title')}</CardTitle>
        <CardDescription>{t('forgot_password_description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="forgot-password-email">{t('email_username_label')}</Label>
              <div className="relative flex items-center mt-1">
                <Mail className="absolute left-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-password-email"
                  type="email"
                  {...register('email')}
                  className="pl-8"
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email.message}</p>}
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isRequestingReset}>
            {isRequestingReset ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('sending')}
              </>
            ) : (
              t('send_instructions_button')
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

export default ForgotPasswordForm;
