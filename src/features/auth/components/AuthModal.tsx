import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSignIn } from '@/hooks/useApi';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ApiError } from '@/types/api';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock, Loader2, Chrome, Github } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton'; // Importar Skeleton para fallback
import { useAuthModalStore } from '@/stores/authModalStore'; // Importar el store de Zustand

// Lazy load de los componentes de formulario
const RegisterForm = React.lazy(() => import('./RegisterForm'));
const ForgotPasswordForm = React.lazy(() => import('./ForgotPasswordForm'));
const ResetPasswordForm = React.lazy(() => import('./ResetPasswordForm'));

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

const AuthModal: React.FC = () => {
  const { t } = useTranslation(); // Inicializar useTranslation
  const { isOpen, closeModal } = useAuthModalStore(); // Obtener estado y acciones del store
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const [backendError, setBackendError] = useState<string | null>(null);

  const loginSchema = z.object({
    identifier: z.string().min(1, t('email_username_required')),
    password: z.string().min(1, t('password_required')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: signIn } = useSignIn();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    setBackendError(null);
    signIn(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        toast.success(t('login_successful'));
        closeModal();
      },
      onError: (err: ApiError) => {
        console.error('Login failed:', err);
        let backendMessage = t('error_login_failed');

        const extractMessage = (data: string | unknown): string | null => {
          if (typeof data === 'string') {
            try {
              const parsed = JSON.parse(data);
              if (parsed && typeof parsed === 'object' && parsed.message) {
                return parsed.message;
              }
            } catch (e) {
              // No es un JSON válido, ignorar
            }
          } else if (typeof data === 'object' && data !== null && (data as any).message) {
            return (data as any).message;
          }
          return null;
        };

        let extracted = extractMessage(err.message);
        if (extracted) {
          backendMessage = extracted;
        } else {
          backendMessage = err.message || backendMessage;
        }

        if (err.details) {
          extracted = extractMessage(err.details);
          if (extracted) {
            backendMessage = extracted;
          } else if (typeof err.details === 'string') {
            backendMessage = err.details;
          } else if (Array.isArray(err.details) && err.details.length > 0) {
            extracted = extractMessage(err.details[0]);
            if (extracted) {
              backendMessage = extracted;
            } else if (typeof err.details[0] === 'string') {
              backendMessage = err.details[0];
            }
          }
        }
        
        console.log('Mensaje de error del backend:', backendMessage);
        setBackendError(backendMessage);
      },
    });
  };

  const changeView = (view: AuthView) => {
    setCurrentView(view);
    reset();
    setBackendError(null);
  };

  // Función para manejar el cambio de tab
  const handleTabChange = (value: string) => {
    setCurrentView(value as AuthView);
    reset();
    setBackendError(null);
  };

  const renderAuthForms = () => {
    const loadingFallback = (
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );

    if (currentView === 'forgotPassword') {
      return (
        <React.Suspense fallback={loadingFallback}>
          <ForgotPasswordForm changeView={changeView} />
        </React.Suspense>
      );
    }
    if (currentView === 'resetPassword') {
      return (
        <React.Suspense fallback={loadingFallback}>
          <ResetPasswordForm changeView={changeView} />
        </React.Suspense>
      );
    }

    return (
      <Tabs value={currentView} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t('login_tab')}</TabsTrigger>
          <TabsTrigger value="register">{t('register_tab')}</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card className="p-6">
            <CardHeader className="text-center p-0 mb-6">
              <CardTitle className="text-2xl">{t('login_title')}</CardTitle>
              <CardDescription>{t('login_description')}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                {backendError && (
                  <Alert variant="destructive">
                    <AlertTitle>{t('error_authentication')}</AlertTitle>
                    <AlertDescription>{backendError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="identifier">{t('email_username_label')}</Label>
                    <div className="relative flex items-center mt-1">
                      <Mail className="absolute left-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="identifier"
                        type="text"
                        {...register('identifier')}
                        className="pl-8"
                      />
                    </div>
                    {errors.identifier && <p className="text-red-500 text-sm mt-1">{errors.identifier.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">{t('password_label')}</Label>
                    <div className="relative flex items-center mt-1">
                      <Lock className="absolute left-2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        {...register('password')}
                        className="pl-8"
                      />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('logging_in')}
                    </>
                  ) : (
                    t('login_button')
                  )}
                </Button>
                <div className="mt-4 text-center text-sm">
                  <Button variant="link" type="button" onClick={() => changeView('forgotPassword')} className="p-0 h-auto">
                    {t('forgot_password_link')}
                  </Button>
                </div>
              </form>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t('or_continue_with')}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full">
                  <Chrome className="mr-2 h-4 w-4" /> Google
                </Button>
                <Button variant="outline" className="w-full">
                  <Github className="mr-2 h-4 w-4" /> GitHub
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <React.Suspense fallback={loadingFallback}>
            <RegisterForm changeView={changeView} />
          </React.Suspense>
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-primary">{t('auth_modal_title')}</h2>
          <p className="text-sm text-muted-foreground">{t('auth_modal_description')}</p>
        </div>
        {renderAuthForms()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
