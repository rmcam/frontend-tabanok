import ForgotPasswordForm from '@/auth/components/ForgotPasswordForm';
import SigninForm from '@/auth/components/SigninForm';
import SignupForm from '@/auth/components/SignupForm';
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'; // Import useEffect
import Modal from './Modal';
interface AuthModalsProps {
  defaultOpen?: 'signin' | 'signup' | 'forgotPassword';
  showDefaultTriggers?: boolean; // Add prop to control default triggers
  onModalClose?: () => void; // Add callback for when any modal closes
}

const AuthModals: React.FC<AuthModalsProps> = ({
  defaultOpen,
  showDefaultTriggers = true,
  onModalClose,
}) => {
  // Add onModalClose prop
  const [openModal, setOpenModal] = useState<'signin' | 'signup' | 'forgotPassword' | null>(
    defaultOpen || null,
  );

  useEffect(() => {
    setOpenModal(defaultOpen || null);
  }, [defaultOpen]);

  const handleOpenChange = (modalName: 'signin' | 'signup' | 'forgotPassword' | null) => {
    return (open: boolean) => {
      if (open) {
        setOpenModal(modalName);
      } else {
        setOpenModal(null);
        if (onModalClose) {
          onModalClose();
        }
      }
    };
  };

  const renderForm = () => {
    switch (openModal) {
      case 'signin':
        return <SigninForm />;
      case 'signup':
        return <SignupForm />;
      case 'forgotPassword':
        return <ForgotPasswordForm />;
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (openModal) {
      case 'signin':
        return 'Iniciar Sesión';
      case 'signup':
        return 'Registrarse';
      case 'forgotPassword':
        return 'Recuperar Contraseña';
      default:
        return '';
    }
  };

  const getModalDescription = () => {
    switch (openModal) {
      case 'signin':
        return 'Ingresa tus credenciales para acceder a tu cuenta.';
      case 'signup':
        return 'Crea una cuenta para empezar a usar la plataforma.';
      case 'forgotPassword':
        return 'Ingresa tu correo electrónico para restablecer tu contraseña.';
      default:
        return '';
    }
  };

  return (
    <>
      {showDefaultTriggers && (
        <>
          <Button variant="outline" onClick={() => setOpenModal('signin')}>
            Iniciar Sesión
          </Button>
          <Button variant="outline" onClick={() => setOpenModal('signup')}>
            Registrarse
          </Button>
          <Button variant="outline" onClick={() => setOpenModal('forgotPassword')}>
            ¿Olvidaste tu contraseña?
          </Button>
        </>
      )}

      <Modal
        isOpen={openModal !== null}
        onOpenChange={handleOpenChange(null)}
        title={getModalTitle()}
        description={getModalDescription()}
      >
        {renderForm()}
      </Modal>
    </>
  );
};

export default AuthModals;
