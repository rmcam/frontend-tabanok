import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner'; // Importar toast de sonner
import { z } from 'zod'; // Importar zod para validación de esquemas
import { useForm } from 'react-hook-form'; // Importar useForm de react-hook-form
import { zodResolver } from '@hookform/resolvers/zod'; // Importar zodResolver
import RegisterForm from './RegisterForm'; // Importar RegisterForm
import ForgotPasswordForm from './ForgotPasswordForm'; // Importar ForgotPasswordForm
import ResetPasswordForm from './ResetPasswordForm'; // Importar ResetPasswordForm
import { useSignIn } from '@/hooks/useApi';

export interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthView = 'login' | 'register' | 'forgotPassword' | 'resetPassword';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [currentView, setCurrentView] = useState<AuthView>('login');

  // Esquema de validación para el formulario de inicio de sesión
  const loginSchema = z.object({
    identifier: z.string().min(1, 'El email o usuario es requerido.'),
    password: z.string().min(1, 'La contraseña es requerida.'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Añadir reset para limpiar el formulario al cambiar de vista
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate: signIn } = useSignIn();

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    signIn(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        toast.success('Inicio de sesión exitoso');
        onClose();
        // Lógica de redirección o manejo de estado global
      },
      onError: (err: ApiError) => {
        console.error('Login failed:', err);
        let errorMessage = 'Error al iniciar sesión';
        if (err && typeof err === 'object') {
          if (err.response?.data?.message) {
            errorMessage = err.response.data.message;
          } else if (typeof err.message === 'string') {
            try {
              const parsedMessage = JSON.parse(err.message);
              if (parsedMessage && typeof parsedMessage === 'object' && parsedMessage.message) {
                errorMessage = parsedMessage.message;
              } else {
                errorMessage = err.message;
              }
            } catch {
              errorMessage = err.message;
            }
          } else if (err.message) {
             errorMessage = String(err.message);
          }
        }
        toast.error(errorMessage);
      },
    });
  };

  // Función para cambiar la vista y resetear el formulario actual
  const changeView = (view: AuthView) => {
    setCurrentView(view);
    reset(); // Resetear el formulario actual al cambiar de vista
  };

  const renderForm = () => {
    switch (currentView) {
      case 'login':
        return (
          <form onSubmit={handleSubmit(handleLogin)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="identifier" className="text-right">
                  Email/Usuario
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  className="col-span-3"
                  {...register('identifier')}
                />
                {errors.identifier && <p className="col-span-4 text-red-500 text-sm">{errors.identifier.message}</p>}
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="col-span-3"
                  {...register('password')}
                />
                {errors.password && <p className="col-span-4 text-red-500 text-sm">{errors.password.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{' '}
              <Button variant="link" type="button" onClick={() => changeView('register')} className="p-0 h-auto">
                Regístrate
              </Button>
            </div>
            <div className="mt-2 text-center text-sm">
              <Button variant="link" type="button" onClick={() => changeView('forgotPassword')} className="p-0 h-auto">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          </form>
        );
      case 'register':
        return <RegisterForm changeView={changeView} />;
      case 'forgotPassword':
        return <ForgotPasswordForm changeView={changeView} />;
      case 'resetPassword':
        return <ResetPasswordForm changeView={changeView} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'login':
        return 'Iniciar sesión';
      case 'register':
        return 'Crear cuenta';
      case 'forgotPassword':
        return 'Olvidé mi contraseña';
      case 'resetPassword':
        return 'Restablecer contraseña';
      default:
        return 'Autenticación';
    }
  };

  const getDescription = () => {
    switch (currentView) {
      case 'login':
        return 'Ingresa tus credenciales para acceder a tu cuenta.';
      case 'register':
        return 'Completa los siguientes pasos para crear tu cuenta.';
      case 'forgotPassword':
        return 'Ingresa tu email para recibir instrucciones para restablecer tu contraseña.';
      case 'resetPassword':
        return 'Ingresa tu nueva contraseña.';
      default:
        return 'Gestiona tu autenticación.';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        {renderForm()}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
